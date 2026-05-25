export type GadgetType = 
  | 'door' 
  | 'copter' 
  | 'pocket' 
  | 'bread' 
  | 'konjac' 
  | 'light' 
  | 'machine' 
  | 'cloth';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  gadgetIcon: GadgetType;
  createdAt: string;
  timeSpent: number; // in seconds
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}

export interface UserStats {
  dorayakiEarned: number; // Used as points/currency
  totalFocusSeconds: number;
  completedSessionsCount: number;
  unlockedGadgets: string[]; // List of gadget IDs
}

export interface Gadget {
  id: string;
  name: string;
  japaneseName: string;
  description: string;
  cost: number;
  type: GadgetType;
  flavorText: string;
}
