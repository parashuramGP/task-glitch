export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Todo' | 'In Progress' | 'Done';

/**
 * ✅ THIS is what FORMS send
 */
export type TaskInput = {
  id?: string;
  title: string;
  revenue: number;
  timeTaken: number;
  priority: Priority;
  status: Status;
  notes?: string;
};

/**
 * ✅ THIS is what STORE keeps
 */
export interface Task extends TaskInput {
  id: string;
  createdAt: string;
  completedAt?: string;
}

export interface DerivedTask extends Task {
  roi: number | null;
  priorityWeight: 3 | 2 | 1;
}

export interface Metrics {
  totalRevenue: number;
  totalTimeTaken: number;
  timeEfficiencyPct: number;
  revenuePerHour: number;
  averageROI: number;
  performanceGrade: 'Excellent' | 'Good' | 'Needs Improvement';
}
