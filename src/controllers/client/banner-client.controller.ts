import { Controller, Get } from '@nestjs/common';
import { BannerService } from 'src/services/banner.service';
import { ApiResponse } from 'src/dtos/api-response.dto';

@Controller('client/banners')
export class BannerClientController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getActiveBanners() {
    const banners = await this.bannerService.getActiveBanners();
    return new ApiResponse(true, 'Get active banners success', banners);
  }
}
