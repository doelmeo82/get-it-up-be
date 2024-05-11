import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AxiosRequestYoutube {
  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  part?: string;

  @IsString()
  @IsOptional()
  playlistId?: string;

  @IsString()
  @IsOptional()
  videoId?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsOptional()
  maxResults?: number;
}
