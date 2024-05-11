import { Expose } from 'class-transformer';

export class ProvinceOutput {
  @Expose()
  public province_id: string;

  @Expose()
  public province_name: number;

  @Expose()
  public province_type: string;

  @Expose()
  district_id: string;

  @Expose()
  district_name: string;

  @Expose()
  district_type: string;
}
