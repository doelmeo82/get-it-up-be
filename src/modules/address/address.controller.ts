import { Controller, Get, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { BaseApiResponse } from '../../shared/dtos';
import { ProvinceOutput } from './dto';
import { Public } from '../../common';

@Controller('')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('province')
  @Public()
  async getAllProvinces(): Promise<BaseApiResponse<ProvinceOutput[]>> {
    return this.addressService.getAddress('/province');
  }

  @Get('district')
  @Public()
  async getDistrict(
    @Query('provinceId') provinceId: string,
  ): Promise<BaseApiResponse<ProvinceOutput[]>> {
    return this.addressService.getAddress('/province/district', provinceId);
  }
}
