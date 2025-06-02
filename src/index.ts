#!/usr/bin/env node
import { question } from "zx";
import { DataService } from "./services/dataService.js";
import { ReportService } from "./services/reportService.js";
import { ReportType } from "./types/index.js";

async function main(): Promise<void> {
  const dataService = new DataService();
  const reportService = new ReportService(dataService);

  await dataService.loadData();

  console.log("Please enter the following");
  const studentId = await question("Student ID: ");
  const reportType = await question(
    "Report to generate (1 for Diagnostic, 2 for Progress, 3 for Feedback): "
  );

  const reportTypeMap: Record<string, ReportType> = {
    "1": "diagnostic",
    "2": "progress",
    "3": "feedback",
  };

  const selectedReportType = reportTypeMap[reportType];
  if (!selectedReportType) {
    console.error("Invalid report type");
    process.exit(1);
  }

  try {
    const report = await reportService.generateReport(
      studentId,
      selectedReportType
    );
    console.log("\n" + report);
  } catch (error) {
    console.error(
      "Error generating report:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}

main().catch(console.error);
