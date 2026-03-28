export interface StudentAnalysis {
  studentName: string;
  teachingPoints: string[];  // 2-3 specific, CCSS-anchored points
  strengths: string[];       // 1-2 things they're doing well
  standardsAddressed: string[]; // e.g. ["W.3.1", "L.3.2"]
}

export interface SmallGroup {
  groupName: string;
  focus: string;  // The instructional need
  students: string[];  // Student names
  suggestedActivity: string;
}

export interface AnalysisResult {
  gradeLevel: string;
  analyzedAt: string;
  students: StudentAnalysis[];
  smallGroups: SmallGroup[];
  notionPageUrl?: string;
}

export interface SetupConfig {
  notionApiKey: string;
  notionDatabaseId: string;
  gradeLevel: string;
}

export type AppScreen = 'setup' | 'analyze' | 'results';
