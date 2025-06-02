import {
  Student,
  Assessment,
  Question,
  AssessmentResponse,
} from "../types/index.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export class DataService {
  private students: Student[] = [];
  private assessments: Assessment[] = [];
  private questions: Question[] = [];
  private responses: AssessmentResponse[] = [];

  async loadData(): Promise<void> {
    const dataDir = join(process.cwd(), "data");

    this.students = JSON.parse(
      await readFile(join(dataDir, "students.json"), "utf-8")
    );
    this.assessments = JSON.parse(
      await readFile(join(dataDir, "assessments.json"), "utf-8")
    );
    this.questions = JSON.parse(
      await readFile(join(dataDir, "questions.json"), "utf-8")
    );
    const rawResponses = JSON.parse(
      await readFile(join(dataDir, "student-responses.json"), "utf-8")
    );
    // Normalize responses
    this.responses = rawResponses
      .filter((r: any) => r.completed)
      .map((r: any) => ({
        id: r.id,
        assessment: r.assessmentId,
        student: r.student.id,
        completed: r.completed,
        responses: r.responses,
      }));
  }

  getStudent(id: string): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

  getAssessment(id: string): Assessment | undefined {
    return this.assessments.find((a) => a.id === id);
  }

  getQuestion(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id);
  }

  getStudentResponses(studentId: string): AssessmentResponse[] {
    return this.responses.filter(
      (r) => r.student === studentId && r.completed !== null
    );
  }

  getCompletedAssessments(studentId: string): AssessmentResponse[] {
    return this.responses.filter(
      (r) => r.student === studentId && r.completed !== null
    );
  }
}
