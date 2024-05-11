import { Expose } from "class-transformer";

export class StatisticOutput {
    @Expose()
    total: number;

    @Expose()
    publicTotal: number;

    @Expose()
    totalStudents: number;
}