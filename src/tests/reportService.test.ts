import { ReportService } from "../services/reportService.js";
import { DataService } from "../services/dataService.js";

describe("ReportService", () => {
  let dataService: DataService;
  let reportService: ReportService;

  beforeEach(async () => {
    dataService = new DataService();
    await dataService.loadData();
    reportService = new ReportService(dataService);
  });

  it("should generate diagnostic report with correct details", async () => {
    const report = await reportService.generateReport("student1", "diagnostic");
    expect(report).toContain(
      "Tony Stark recently completed Numeracy assessment on 16th December 2021 10:46 AM"
    );
    expect(report).toContain(
      "He got 15 questions right out of 16. Details by strand given below:"
    );
    expect(report).toMatch(/Number and Algebra: \d+ out of \d+ correct/);
    expect(report).toMatch(/Measurement and Geometry: \d+ out of \d+ correct/);
    expect(report).toMatch(
      /Statistics and Probability: \d+ out of \d+ correct/
    );
  });

  it("should generate progress report with correct details", async () => {
    const report = await reportService.generateReport("student1", "progress");
    expect(report).toContain(
      "Tony Stark has completed Numeracy assessment 3 times in total. Date and raw score given below:"
    );
    expect(report).toContain(
      "Date: 16th December 2019, Raw Score: 6 out of 16"
    );
    expect(report).toContain(
      "Date: 16th December 2020, Raw Score: 10 out of 16"
    );
    expect(report).toContain(
      "Date: 16th December 2021, Raw Score: 15 out of 16"
    );
    expect(report).toContain(
      "Tony Stark got 9 more correct in the recent completed assessment than the oldest"
    );
  });

  it("should generate feedback report", async () => {
    const report = await reportService.generateReport("student1", "feedback");
    expect(report).toContain("Tony Stark");
    expect(report).toContain("recently completed");
    expect(report).toContain("Feedback for wrong answers");
  });

  it("should handle non-existent student", async () => {
    await expect(
      reportService.generateReport("nonexistent", "diagnostic")
    ).rejects.toThrow("Student not found");
  });
});
