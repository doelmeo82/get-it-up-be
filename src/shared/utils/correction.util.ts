import { DeepPartial } from 'typeorm';
import {
  AnswerQuestionInput,
  QuestionCorrectionOutput,
  TakeExamOutput,
} from '../../modules/exam/dto';
import { Exam } from '../../modules/exam/entities';

export const correctionResult = (
  exam: Exam,
  answer: AnswerQuestionInput[],
  correction: QuestionCorrectionOutput[],
): DeepPartial<TakeExamOutput> => {
  const total = answer.length;
  const selected = answer.filter((a) => a.questionId !== 0).length;
  const numberCorrect = correction.filter((e) => e.status === true).length;
  const grade: DeepPartial<TakeExamOutput> = {
    title: exam.title,
    totalQuestions: total,
    corrects: numberCorrect,
    incorrect: selected - numberCorrect,
    selected,
    unselected: total - selected,
    score: +((numberCorrect / total) * 10).toFixed(2),
    time: exam.time,
    corrections: correction,
  };
  return grade;
};
