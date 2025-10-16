export class Journey {
  id!: string;
  userId!: string;
  totalProgress: number = 0;

  step1Completed: boolean = false;
  step2Completed: boolean = false;
  step3Completed: boolean = false;
  step4Completed: boolean = false;
  step5Completed: boolean = false;
  step6Completed: boolean = false;
  step7Completed: boolean = false;
  step8Completed: boolean = false;
  step9Completed: boolean = false;
  step10Completed: boolean = false;

  public updateProgress(): void {
    const steps = [
      this.step1Completed,
      this.step2Completed,
      this.step3Completed,
      this.step4Completed,
      this.step5Completed,
      this.step6Completed,
      this.step7Completed,
      this.step8Completed,
      this.step9Completed,
      this.step10Completed,
    ];

    this.totalProgress = steps.filter(Boolean).length;
  }
}