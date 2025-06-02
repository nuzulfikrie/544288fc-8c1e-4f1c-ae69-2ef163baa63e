import { DataService } from "../services/dataService.js";

describe("DataService", () => {
  let dataService: DataService;

  beforeEach(() => {
    dataService = new DataService();
  });

  it("should load data successfully", async () => {
    await expect(dataService.loadData()).resolves.not.toThrow();
  });

  it("should get student by id", async () => {
    await dataService.loadData();
    const student = dataService.getStudent("student1");
    expect(student).toBeDefined();
    expect(student?.id).toBe("student1");
  });

  it("should get completed assessments for student", async () => {
    await dataService.loadData();
    const assessments = dataService.getCompletedAssessments("student1");
    expect(assessments).toBeDefined();
    expect(Array.isArray(assessments)).toBe(true);
    expect(assessments.every((a) => a.completed !== null)).toBe(true);
    // There should be at least 3 completed assessments for student1
    expect(assessments.length).toBeGreaterThanOrEqual(3);
  });
});
