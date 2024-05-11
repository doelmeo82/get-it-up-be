import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { MESSAGES } from '../../../common/constants';
import { FileService } from '../../../modules/files/files.service';
import { RequestContext } from '../../../shared/request-context/request-context.dto';
import { Lecture } from '../entities';
import { LectureQuizzService } from './lecture-quizz.service';
import { CreateLecture } from '../dto/lecture/create-lecture-input.dto';
import { LectureOutput } from '../dto/lecture/lecture-output.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    private readonly fileService: FileService,
    private readonly lectureQuizzServivce: LectureQuizzService,
  ) {}

  create(data: CreateLecture[]): Lecture[] {
    const lectures: Lecture[] = [];
    data.map((lecture) => {
      const createLecture = this.lectureRepository.create(lecture);
      createLecture.quizzs = this.lectureQuizzServivce.create(lecture.quizzs);
      lectures.push(createLecture);
    });
    return lectures;
  }

  async getLectureById(lectureId: number): Promise<LectureOutput> {
    const lecture = await this.lectureRepository.findOne({
      where: { _id: lectureId },
    });

    return plainToInstance(LectureOutput, lecture, {
      excludeExtraneousValues: true,
    });
  }

  async getAll(): Promise<LectureOutput[]> {
    const data = await this.lectureRepository.find({});

    return plainToInstance(LectureOutput, data, {
      excludeExtraneousValues: true,
    });
  }

  async getLectureVideo(
    ctx: RequestContext,
    slug: string,
    res: Response,
  ): Promise<void> {
    const key = `${slug}.mp4`;
    const filesize = await this.fileService.getFileSize(key);
    if (!filesize)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );

    const range = ctx.range;
    if (range) {
      const parts = range.replace('bytes=', '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : filesize - 1;

      const chunkSize = end - start + 1;
      const head = {
        'Content-Range': `bytes ${start}-${end}/${filesize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      const stream = await this.fileService.getStreamFile(key, start, end);
      res.writeHead(206, head);
      stream.pipe(res);
    } else {
      const stream = await this.fileService.getStreamFile(key, 0, filesize - 1);
      const head = {
        'Content-Range': filesize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      stream.pipe(res);
    }
  }
}
