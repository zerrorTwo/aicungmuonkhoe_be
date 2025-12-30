import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Food } from '../entities/food.entity';
import { CloudinaryProvider } from '../providers/cloudinary.provider';
import AdmZip = require('adm-zip');
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Workbook, CellValue } from 'exceljs';
import { User } from '../entities/user.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private readonly cloudinaryProvider: CloudinaryProvider,
  ) {}

  async uploadImage(file: any) {
    const name = file.originalname.split('.')[0];
    const result = await this.cloudinaryProvider.uploadStream(
      file,
      'food_images',
      name,
    );
    return result.secure_url || result.url;
  }

  async createFood(data: any, user: User) {
    const { ID, NAME } = data;
    if (!ID || !NAME) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.foodRepository.findOne({
      where: { ID: Number(ID) },
    });
    if (existing) {
      throw new HttpException('Food ID already exists', HttpStatus.BAD_REQUEST);
    }

    const newFood = this.foodRepository.create({
      ...data,
      CREATED_BY: user.USER_ID,
      UPDATED_BY: user.USER_ID,
      CREATED_DATE: new Date(),
      MODIFIED_DATE: new Date(),
    });

    return this.foodRepository.save(newFood);
  }

  async updateFood(id: number, data: any, user: User) {
    const existing = await this.foodRepository.findOne({ where: { ID: id } });
    if (!existing) {
      throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
    }

    const updated = this.foodRepository.merge(existing, {
      ...data,
      UPDATED_BY: user.USER_ID,
      MODIFIED_DATE: new Date(),
    });

    return this.foodRepository.save(updated);
  }

  async deleteFood(id: number) {
    const existing = await this.foodRepository.findOne({ where: { ID: id } });
    if (!existing) {
      throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
    }
    return this.foodRepository.delete(id);
  }

  async getFoodDetail(id: number) {
    const food = await this.foodRepository.findOne({ where: { ID: id } });
    if (!food) {
      throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
    }
    return food;
  }

  async getFoodList(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = query.search || '';
    const group_material = query.group_material || '';
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.NAME = Like(`%${search}%`);
    }
    if (group_material) {
      where.GROUP_MATERIAL = group_material;
    }

    const [data, total] = await this.foodRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { CREATED_DATE: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFoodGroupList() {
    // Return distinct GROUP_MATERIAL
    const result = await this.foodRepository
      .createQueryBuilder('food')
      .select('DISTINCT food.GROUP_MATERIAL', 'name')
      .where('food.GROUP_MATERIAL IS NOT NULL')
      .getRawMany();
    return result.map((r) => ({ name: r.name, foodGroupName: r.name })); // Mapping to expected format if needed
  }

  // Frontend expects 'code' and 'name' usually
  async getFoodClassificationList() {
    // Return distinct GROUP_NUTRITION
    const result = await this.foodRepository
      .createQueryBuilder('food')
      .select('DISTINCT food.GROUP_NUTRITION', 'name')
      .where('food.GROUP_NUTRITION IS NOT NULL')
      .getRawMany();
    return result.map((r) => ({ code: r.name, name: r.name }));
  }

  // Assuming Material Group is not needed as per request.

  async importFood(file: Express.Multer.File, user: User, logger: Logger) {
    let tempDir: string | null = null;
    const uploadId = `upload_${Date.now()}`;
    const tempZipPath = path.join(os.tmpdir(), `${uploadId}.zip`);

    try {
      // Save buffer to temp zip
      await fs.writeFile(tempZipPath, file.buffer);

      // Unzip
      tempDir = path.join(os.tmpdir(), uploadId);
      await fs.ensureDir(tempDir);
      const zip = new AdmZip(tempZipPath);
      zip.extractAllTo(tempDir, true);

      let searchDir = tempDir;
      const rootEntries = await fs.readdir(tempDir);
      // Filter out system files
      const validEntries = rootEntries.filter((e) => e !== '__MACOSX');

      if (
        validEntries.length === 1 &&
        (await fs.stat(path.join(tempDir, validEntries[0]))).isDirectory()
      ) {
        searchDir = path.join(tempDir, validEntries[0]);
      }

      const children = await fs.readdir(searchDir);
      const folderMap = children.reduce(
        (acc, name) => {
          acc[name.toLowerCase()] = name;
          return acc;
        },
        {} as Record<string, string>,
      );

      let excelDir: string | null = null;
      let imagesDir: string | null = null;

      if (folderMap['excel'])
        excelDir = path.join(searchDir, folderMap['excel']);
      if (folderMap['images'])
        imagesDir = path.join(searchDir, folderMap['images']);

      // Parse Excel
      let dataBatch: any[] = [];
      if (excelDir) {
        const result = await this.processExcelFile(excelDir, user);
        dataBatch = result[0];
      }

      logger.log('Excel parsed');
      // Upload Images
      const uploaded = await this.storeImages(imagesDir);
      logger.log('Images uploaded');

      let finalFoods = dataBatch;

      // Logic to merge images
      if (excelDir && imagesDir) {
        for (const food of finalFoods) {
          const newImg = uploaded['images'][food.ID];
          if (newImg) {
            food.IMAGE = newImg.url;
            food.IMAGE_COOKED = newImg.url;
          }
        }
      }

      // Clean and Save
      const cleanBatch = await this.keepOldDataIfNewOneNotFound(finalFoods);

      // Save batch
      await this.foodRepository.save(cleanBatch);

      return {
        success: true,
        processed: cleanBatch.length,
        message: 'Import successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Import failed',
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      if (tempDir) await fs.remove(tempDir);
      if (await fs.pathExists(tempZipPath)) await fs.remove(tempZipPath);
    }
  }

  private async processExcelFile(excelDir: string, user: User) {
    let dataBatch: any[] = [];
    const excelFiles = (await fs.readdir(excelDir)).filter((f) =>
      /(\.xlsx?)$/i.test(f),
    );

    if (!excelFiles.length) return [[], []];

    const excelPath = path.join(excelDir, excelFiles[0]);
    const workbook = new Workbook();
    await workbook.xlsx.readFile(excelPath);
    const worksheet = workbook.worksheets[0];
    // skip 3 header lines
    const rows = worksheet.getRows(0, worksheet.rowCount)?.slice(3) || [];

    const seenFoodIds = new Map<string, { row: number; id: number }>();

    for (let i = 0; i < rows.length; i++) {
      const rowValues = rows[i].values;
      let cells: any[] = [];
      if (Array.isArray(rowValues)) {
        cells = rowValues.slice(1);
      } else if (typeof rowValues === 'object') {
        cells = (rowValues as any).slice(1);
      }

      const currentRow = i + 3;
      try {
        if (cells.every((c) => c === null || c === undefined || c === ''))
          continue;

        if (!cells[0]) throw new Error(`Row ${currentRow}: Missing ID`);
        if (!cells[1]) throw new Error(`Row ${currentRow}: Missing Name`);

        const foodId = cells[0].toString();
        if (seenFoodIds.has(foodId)) {
          throw new Error(`Row ${currentRow}: Duplicate ID ${foodId}`);
        }
        seenFoodIds.set(foodId, { row: currentRow, id: Number(foodId) });

        dataBatch.push({
          ID: cells[0],
          NAME: cells[1],
          GROUP_MATERIAL: cells[2],
          ENERGY: this.extractFormularResult(cells[11]) || 0,
          WATER: cells[12],
          PROTEIN: cells[13] || 0,
          ANIMAL_PROTEIN: cells[14] || 0,
          VEGETABLE_PROTEIN: cells[15] || 0,
          FAT: cells[16] || 0,
          ANIMAL_FAT: cells[17] || 0,
          VEGETABLE_FAT: cells[18] || 0,
          STARCH_SUGAR: cells[19] || 0,
          FIBER: cells[20] || 0,
          CANXI: cells[21],
          MONO_UNSATURATED_FAT: cells[30] || 0,
          POLY_UNSATURATED_FAT: cells[31] || 0,
          TOTAL_UNSATURATED_FAT: cells[32] || 0,
          CHOLESTEROL: cells[33] || 0,
          SUGAR: cells[34] || 0,
          CREATED_DATE: new Date(),
          MODIFIED_DATE: new Date(),
          CREATED_BY: user.USER_ID,
          UPDATED_BY: user.USER_ID,
        });
      } catch (e) {
        throw new Error(e.message);
      }
    }

    return [dataBatch];
  }

  private async storeImages(imagesDir: string | null) {
    if (!imagesDir) return { images: {} };

    const files = (await fs.readdir(imagesDir)).filter((f) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f),
    );

    const uploadPromises = files.map(async (f) => {
      const p = path.join(imagesDir, f);
      const buffer = await fs.readFile(p);
      // Mock multer file
      const file: any = {
        buffer: buffer,
        originalname: f,
      };
      const name = f.split('.')[0];
      // Upload to folder 'food_images' as requested with public_id = filename
      const result = await this.cloudinaryProvider.uploadStream(
        file,
        'food_images',
        name,
      );
      return { name, url: result.secure_url || result.url };
    });

    const results = await Promise.all(uploadPromises);

    const uploaded = { images: {} };
    results.forEach((res) => {
      uploaded.images[res.name] = { url: res.url };
    });

    return uploaded;
  }

  private async keepOldDataIfNewOneNotFound(dataBatch: any[]) {
    if (!dataBatch.length) return [];
    const ids = dataBatch.map((d) => d.ID);
    const existing = await this.foodRepository.findBy({ ID: In(ids) });
    // Assuming older TypeORM or adapting. I'll use find({ where: { ID: In(ids) } }) logic if needed, but findByIds works in v2.
    // Let's use find with In operator which is safer.
    // Need import { In } from 'typeorm'

    const existById = existing.reduce(
      (acc, food) => {
        acc[food.ID] = food;
        return acc;
      },
      {} as Record<number, Food>,
    );

    const processed: any[] = [];
    for (const data of dataBatch) {
      const old = existById[data.ID];
      if (!old) {
        processed.push(data);
        continue;
      }
      const merged = { ...old };
      // Reference logic: update if new value is not null/empty
      for (const key in data) {
        const val = data[key];
        if (val !== undefined && val !== null && val !== '') {
          merged[key] = val;
        }
      }
      processed.push(merged);
    }
    return processed;
  }

  private extractFormularResult(cell: any) {
    if (!cell || cell?.result === undefined || cell?.result === null) {
      return 0;
    }
    if (typeof cell === 'object') {
      return cell.result;
    }
    return cell ?? cell.text ?? cell.value ?? 0;
  }
}
