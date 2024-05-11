import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../entities';
import { Repository } from 'typeorm';
import { LectureService } from './lecture.service';
import { CreateSection } from '../dto/section/create-section-input.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly lectureService: LectureService,
  ) {}

  create(data: CreateSection[]): [Section[], number] {
    const sections: Section[] = [];
    let totalDuration = 0;
    data.map((section) => {
      const createSection = this.sectionRepository.create(section);
      createSection.lectures = this.lectureService.create(section.lectures);
      totalDuration += section.lectures.reduce((total, current) => {
        const duration = current.duration;
        return total + duration;
      }, 0);
      sections.push(createSection);
    });
    return [sections, totalDuration];
  }
}
