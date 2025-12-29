import { useCallback, useEffect, useMemo, useState } from 'react';
import { DerivedTask, Metrics, Task, Priority, Status } from '@/types';
import {
  computeAverageROI,
  computePerformanceGrade,
  computeRevenuePerHour,
  computeTimeEfficiency,
  computeTotalRevenue,
  withDerived,
  sortTasks,
} from '@/utils/logic';
import { generateSalesTasks } from '@/utils/seed';

export type TaskFormPayload = {
  id?: string;
  title: string;
  revenue: number;
  timeTaken: number;
  priority: Priority;
  status: Status;
  notes?: string;
};

interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  derivedSorted: DerivedTask[];
  metrics: Metrics;
  lastDeleted: Task | null;
  addTask: (task: TaskFormPayload) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  clearLastDeleted: () => void;
}

const INITIAL_METRICS: Metrics = {
  totalRevenue: 0,
  totalTimeTaken: 0,
  timeEfficiencyPct: 0,
  revenuePerHour: 0,
  averageROI: 0,
  performanceGrade: 'Needs Improvement',
};

export function useTasks(): UseTasksState {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<Task | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/tasks.json');
        const data = res.ok ? await res.json() : [];
        setTasks(data.length ? data : generateSalesTasks(50));
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const derivedSorted = useMemo<DerivedTask[]>(() => {
    return sortTasks(tasks.map(withDerived));
  }, [tasks]);

  const metrics = useMemo<Metrics>(() => {
    if (!tasks.length) return INITIAL_METRICS;

    const totalRevenue = computeTotalRevenue(tasks);
    const totalTimeTaken = tasks.reduce((s, t) => s + t.timeTaken, 0);
    const timeEfficiencyPct = computeTimeEfficiency(tasks);
    const revenuePerHour = computeRevenuePerHour(tasks);
    const averageROI = computeAverageROI(tasks);
    const performanceGrade = computePerformanceGrade(averageROI);

    return {
      totalRevenue,
      totalTimeTaken,
      timeEfficiencyPct,
      revenuePerHour,
      averageROI,
      performanceGrade,
    };
  }, [tasks]);

  const addTask = useCallback((payload: TaskFormPayload) => {
    const now = new Date().toISOString();

    const task: Task = {
      id: payload.id ?? crypto.randomUUID(),
      title: payload.title,
      revenue: payload.revenue,
      timeTaken: payload.timeTaken > 0 ? payload.timeTaken : 1,
      priority: payload.priority,
      status: payload.status,
      notes: payload.notes,
      createdAt: now,
      completedAt: payload.status === 'Done' ? now : undefined,
    };

    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              ...patch,
              completedAt:
                t.status !== 'Done' && patch.status === 'Done'
                  ? new Date().toISOString()
                  : t.completedAt,
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === id) || null;
      setLastDeleted(target);
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;
    setTasks(prev => [...prev, lastDeleted]);
    setLastDeleted(null);
  }, [lastDeleted]);

  const clearLastDeleted = useCallback(() => {
    setLastDeleted(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    derivedSorted,
    metrics,
    lastDeleted,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    clearLastDeleted,
  };
}
