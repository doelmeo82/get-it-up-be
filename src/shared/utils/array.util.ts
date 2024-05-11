import * as _ from 'lodash';
import { ExamRankingOutput } from '../../modules/exam/dto/exam-rank-filter.dto';
// import { Post } from "../../modules/post/entities";

export function groupRankingByUser(
  data: ExamRankingOutput[],
): _.Dictionary<ExamRankingOutput> {
  const grouped = _.groupBy(data, (data) => data.user._id);

  const result = _.mapValues(grouped, (group) => group[0]);

  return result;
}
