import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from '../../shared/dtos';
import { UploadOutput, UploadVideoInput } from './dto';
import { MESSAGES } from '../../common/constants';
import { Readable } from 'stream';
@Injectable()
export class FileService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}
  s3: AWS.S3;
  onModuleInit() {
    this.s3 = new AWS.S3({
      // endpoint: this.configService.get<string>('do_endpoint'),
      s3ForcePathStyle: true,
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRECT_KEY') || '',
      },
    });
  }
  async uploadFile(
    type: string,
    identity: number | string,
    file: Express.Multer.File,
  ): Promise<BaseApiResponse<UploadOutput>> {
    if (!file)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    const uploadParams = {
      Bucket: 'get-it-up',
      Body: file.buffer,
      Key: `${type}/${identity}-${file.originalname}`,
      ACL: 'public-read',
    };

    const uploadResult = await this.s3.upload(uploadParams).promise();
    const result = plainToInstance(UploadOutput, {
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPLOAD_IMAGE_SUCCES,
      code: 200,
    };
  }

  async uploadVideo(
    data: UploadVideoInput,
    file: Express.Multer.File,
  ): Promise<BaseApiResponse<UploadOutput>> {
    if (!file)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 400,
        },
        HttpStatus.BAD_REQUEST,
      );
    const uploadParams = {
      Bucket: 'get-it-up/video',
      Body: file.buffer,
      Key: `${data.slug}.mp4`,
      ACL: 'public-read',
    };

    const uploadResult = await this.s3.upload(uploadParams).promise();
    const result = plainToInstance(UploadOutput, {
      key: uploadResult.Key,
      url: `https://s3.amazonaws.com/get-it-up/video/${data.slug}.mp4`,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.UPLOAD_IMAGE_SUCCES,
      code: 200,
    };
  }

  async getFileSize(key: string): Promise<number | undefined> {
    const data = await this.s3
      .headObject({
        Bucket: 'get-it-up/video',
        Key: key,
      })
      .promise();

    return data.ContentLength;
  }

  async getStreamFile(
    key: string,
    start?: number,
    end?: number,
  ): Promise<Readable> {
    console.log('key :>> ', key);
    const range = `bytes=${start}-${end}`;
    const res = await this.s3
      .getObject({
        Key: key,
        Bucket: 'get-it-up/video',
        Range: range,
      })
      .promise();
    const body = res.Body as Buffer;
    return Readable.from(Buffer.from(body));
  }
}
