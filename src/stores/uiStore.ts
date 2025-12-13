import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityLogEntry, Task, Note } from '../types';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Activity log
  activityLog: ActivityLogEntry[];
  addActivity: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  clearActivityLog: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTasksForToday: () => Task[];
  getPendingTasks: () => Task[];
  getOverdueTasks: () => Task[];

  // Notes
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesByPlant: (plantId: string) => Note[];
  getNotesByField: (fieldId: string) => Note[];

  // Modal states
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;

  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) => set({ theme }),

      // Activity log
      activityLog: [],
      addActivity: (entry) =>
        set((state) => ({
          activityLog: [
            {
              ...entry,
              id: `act-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
            ...state.activityLog,
          ].slice(0, 100), // Keep last 100 entries
        })),
      clearActivityLog: () => set({ activityLog: [] }),

      // Tasks
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: 'completed',
                  completedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),
      getTasksForToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(
          (task) =>
            task.dueDate.startsWith(today) && task.status !== 'completed'
        );
      },
      getPendingTasks: () =>
        get().tasks.filter((task) => task.status === 'pending'),
      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(
          (task) =>
            task.status !== 'completed' && new Date(task.dueDate) < now
        );
      },

      // Notes
      notes: [],
      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      getNotesByPlant: (plantId) =>
        get().notes.filter((note) => note.plantId === plantId),
      getNotesByField: (fieldId) =>
        get().notes.filter((note) => note.fieldId === fieldId),

      // Modal states
      activeModal: null,
      modalData: null,
      openModal: (modalId, data) =>
        set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Toast notifications
      toasts: [],
      addToast: (type, message) => {
        const id = `toast-${Date.now()}`;
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }));
        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 5000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
    }),
    {
      name: 'farm-plus-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        tasks: state.tasks,
        notes: state.notes,
        activityLog: state.activityLog,
      }),
    }
  )
);
