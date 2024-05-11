import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseApiResponse } from 'src/shared/dtos';
import { ApiService } from '../../shared/providers';
import { ProvinceOutput } from './dto';
import { plainToInstance } from 'class-transformer';
import { MESSAGES } from 'src/common/constants';
import { AddressInput } from './dto';
import { Address } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  PATH = '/province';
  DOMAIN = 'https://vapi.vnappmob.com/api';
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly api: ApiService,
    private readonly config: ConfigService,
  ) {}

  async getAddress(
    path: string,
    provinceId?: string,
  ): Promise<BaseApiResponse<ProvinceOutput[]>> {
    const domain = this.config.get<string>('vnProvinceDomain') || this.DOMAIN;
    const provinces: ProvinceOutput[] = (
      await this.api.get(domain, path, provinceId)
    ).results;
    const result = plainToInstance(ProvinceOutput, provinces, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async createAddress(data: AddressInput): Promise<Address> {
    const createdAddress = this.addressRepository.create(data);
    return this.addressRepository.save(createdAddress);
  }
}
