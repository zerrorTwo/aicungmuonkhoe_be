import { Injectable, Logger } from '@nestjs/common';
import { Tips } from 'src/entities/tips.entity';
import { TipRepository } from 'src/repositories/tip.repository';

@Injectable()
export class TipsService {
  private readonly logger = new Logger(TipsService.name);

  constructor(private readonly _tipsRepository: TipRepository) {}

  async getAllTips(): Promise<Tips[]> {
    return this._tipsRepository.getAll();
  }
}
