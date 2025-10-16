import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteJourneyStepUseCase } from '../../../packages/core-journey/src/use-cases/complete-journey-step.use-case';
import { CompleteStepDto } from './dtos/complete-step.dto';

@Controller('journey')
export class JourneyController {
  constructor(
    private readonly completeJourneyStepUseCase: CompleteJourneyStepUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('steps')
  async completeStep(@Req() req: any, @Body() body: CompleteStepDto) {
    const userId = req.user.sub;
    await this.completeJourneyStepUseCase.execute(userId, body.stepNumber);
    return { message: 'Step completed successfully' };
  }
}