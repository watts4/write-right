export interface StudentAnalysis {
  studentName: string;
  teachingPoints: string[];
  strengths: string[];
  standardsAddressed: string[];
}

export interface SmallGroup {
  groupName: string;
  focus: string;
  students: string[];
  suggestedActivity: string;
}

export interface AnalysisResult {
  gradeLevel: string;
  analyzedAt: string;
  students: StudentAnalysis[];
  smallGroups: SmallGroup[];
  notionPageUrl?: string;
}

export interface AnalyzeRequest {
  notionApiKey: string;
  databaseId: string;
  gradeLevel: string;
}
