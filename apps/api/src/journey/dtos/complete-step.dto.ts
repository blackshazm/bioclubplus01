import { IsInt, Max, Min } from 'class-validator';

export class CompleteStepDto {
  @IsInt()
  @Min(1)
  @Max(10)
  stepNumber: number;
}