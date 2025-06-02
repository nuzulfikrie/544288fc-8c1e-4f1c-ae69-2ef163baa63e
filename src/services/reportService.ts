import { DataService } from "./dataService.js";
import { ReportType, Student, AssessmentResponse } from "../types/index.js";
import { format, parse } from "date-fns";

export class ReportService {
  constructor(private dataService: DataService) {}

  private parseDate(dateStr: string): Date {
    return parse(dateStr, "dd/MM/yyyy HH:mm:ss", new Date());
  }

  async generateReport(
    studentId: string,
    reportType: ReportType
  ): Promise<string> {
    const student = this.dataService.getStudent(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    switch (reportType) {
      case "diagnostic":
        return this.generateDiagnosticReport(student);
      case "progress":
        return this.generateProgressReport(student);
      case "feedback":
        return this.generateFeedbackReport(student);
      default:
        throw new Error("Invalid report type");
    }
  }

  private generateDiagnosticReport(student: Student): string {
    const latestResponse = this.getLatestCompletedAssessment(student.id);
    if (!latestResponse) {
      return `${student.firstName} ${student.lastName} has no completed assessments.`;
    }

    const assessment = this.dataService.getAssessment(
      latestResponse.assessment
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const strandResults = this.calculateStrandResults(latestResponse);
    const totalCorrect = Object.values(strandResults).reduce(
      (sum, { correct }) => sum + correct,
      0
    );
    const totalQuestions = Object.values(strandResults).reduce(
      (sum, { total }) => sum + total,
      0
    );

    let report = `${student.firstName} ${student.lastName} recently completed ${
      assessment.name
    } assessment on ${format(
      this.parseDate(latestResponse.completed!),
      "do MMMM yyyy h:mm a"
    )}\n`;
    report += `He got ${totalCorrect} questions right out of ${totalQuestions}. Details by strand given below:\n\n`;

    for (const [strand, { correct, total }] of Object.entries(strandResults)) {
      report += `${strand}: ${correct} out of ${total} correct\n`;
    }

    return report;
  }

  private generateProgressReport(student: Student): string {
    const completedAssessments = this.dataService.getCompletedAssessments(
      student.id
    );
    if (completedAssessments.length === 0) {
      return `${student.firstName} ${student.lastName} has no completed assessments.`;
    }

    const assessment = this.dataService.getAssessment(
      completedAssessments[0].assessment
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const sortedAssessments = completedAssessments.sort(
      (a, b) =>
        this.parseDate(a.completed!).getTime() -
        this.parseDate(b.completed!).getTime()
    );

    let report = `${student.firstName} ${student.lastName} has completed ${assessment.name} assessment ${completedAssessments.length} times in total. Date and raw score given below:\n\n`;

    for (const response of sortedAssessments) {
      const totalQuestions = response.responses.length;
      const correctAnswers = this.countCorrectAnswers(response);
      report += `Date: ${format(
        this.parseDate(response.completed!),
        "do MMMM yyyy"
      )}, Raw Score: ${correctAnswers} out of ${totalQuestions}\n`;
    }

    const oldestScore = this.countCorrectAnswers(sortedAssessments[0]);
    const latestScore = this.countCorrectAnswers(
      sortedAssessments[sortedAssessments.length - 1]
    );
    const improvement = latestScore - oldestScore;

    report += `\n${student.firstName} ${student.lastName} got ${improvement} more correct in the recent completed assessment than the oldest`;

    return report;
  }

  private generateFeedbackReport(student: Student): string {
    const latestResponse = this.getLatestCompletedAssessment(student.id);
    if (!latestResponse) {
      return `${student.firstName} ${student.lastName} has no completed assessments.`;
    }

    const assessment = this.dataService.getAssessment(
      latestResponse.assessment
    );
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const totalQuestions = latestResponse.responses.length;
    const correctAnswers = this.countCorrectAnswers(latestResponse);

    let report = `${student.firstName} ${student.lastName} recently completed ${
      assessment.name
    } assessment on ${format(
      this.parseDate(latestResponse.completed!),
      "do MMMM yyyy h:mm a"
    )}\n`;
    report += `He got ${correctAnswers} questions right out of ${totalQuestions}. Feedback for wrong answers given below\n\n`;

    for (const response of latestResponse.responses) {
      const question = this.dataService.getQuestion(response.questionId);
      if (!question) continue;

      const correctOption = question.config.options.find(
        (opt) => opt.id === question.config.key
      );
      if (!correctOption) continue;

      if (response.response !== question.config.key) {
        report += `Question: ${question.id}\n`;
        report += `Your answer: ${response.response}\n`;
        report += `Right answer: ${question.config.key}\n`;
        report += `Hint: ${question.hint}\n\n`;
      }
    }

    return report;
  }

  private getLatestCompletedAssessment(
    studentId: string
  ): AssessmentResponse | undefined {
    const completedAssessments =
      this.dataService.getCompletedAssessments(studentId);
    return completedAssessments.sort(
      (a, b) =>
        this.parseDate(b.completed!).getTime() -
        this.parseDate(a.completed!).getTime()
    )[0];
  }

  private calculateStrandResults(
    assessmentResponse: AssessmentResponse
  ): Record<string, { correct: number; total: number }> {
    const strandResults: Record<string, { correct: number; total: number }> =
      {};

    for (const response of assessmentResponse.responses) {
      const question = this.dataService.getQuestion(response.questionId);
      if (!question) continue;

      if (!strandResults[question.strand]) {
        strandResults[question.strand] = { correct: 0, total: 0 };
      }

      strandResults[question.strand].total++;
      if (response.response === question.config.key) {
        strandResults[question.strand].correct++;
      }
    }

    return strandResults;
  }

  private countCorrectAnswers(response: AssessmentResponse): number {
    return response.responses.reduce((count, resp) => {
      const question = this.dataService.getQuestion(resp.questionId);
      return (
        count + (question && resp.response === question.config.key ? 1 : 0)
      );
    }, 0);
  }
}
