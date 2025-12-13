// Field status types
export type FieldStatus = 'healthy' | 'attention' | 'critical';

// Plant health status
export type PlantHealthStatus = 'healthy' | 'sick' | 'observation' | 'dead';

// Watering status
export type WateringStatus = 'watered' | 'due_soon' | 'overdue' | 'critical';

// Note types
export type NoteType =
  | 'watering'
  | 'growth'
  | 'pest'
  | 'disease'
  | 'fertilizer'
  | 'weather'
  | 'work'
  | 'observation'
  | 'harvest';

// Task priority
export type TaskPriority = 'low' | 'medium' | 'high';

// Task status
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Soil types
export type SoilType = 'clay' | 'sandy' | 'loam' | 'silt' | 'peat' | 'chalk';

// User settings
export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  units: 'metric' | 'imperial';
  currency: string;
  notifications: {
    overdueWatering: boolean;
    newProblems: boolean;
    taskReminders: boolean;
    weeklyReport: boolean;
    notificationMethod: 'push' | 'email' | 'both';
  };
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    defaultView: 'grid' | 'table' | 'map';
  };
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  farmName: string;
  farmAddress?: string;
  settings: UserSettings;
  createdAt: string;
}

// Zone
export interface Zone {
  id: string;
  fieldId: string;
  name: string;
  area: number; // in m²
  soilType?: SoilType;
  characteristics?: string;
  createdAt: string;
}

// Field
export interface Field {
  id: string;
  name: string;
  area: number; // in m²
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapImage?: string;
  soilType?: SoilType;
  zones: Zone[];
  notes?: string;
  status: FieldStatus;
  createdAt: string;
  updatedAt: string;
}

// Plant type (catalog)
export interface PlantType {
  id: string;
  name: string;
  category: string;
  icon?: string;
  image?: string;
  wateringFrequencyDays: number;
  optimalTemperature?: {
    min: number;
    max: number;
  };
  growthDuration?: number; // days to harvest
  commonPests?: string[];
  commonDiseases?: string[];
  careInstructions?: string;
}

// Plant
export interface Plant {
  id: string;
  name: string;
  typeId: string;
  type: PlantType;
  fieldId: string;
  zoneId?: string;
  variety?: string;
  quantity: number;
  plantedAt: string;
  wateringFrequencyDays: number;
  lastWateredAt?: string;
  nextWateringAt?: string;
  healthStatus: PlantHealthStatus;
  wateringStatus: WateringStatus;
  seedSource?: string;
  notes?: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

// Watering log
export interface WateringLog {
  id: string;
  plantId: string;
  date: string;
  amount?: number; // in liters
  notes?: string;
  createdAt: string;
}

// Note
export interface Note {
  id: string;
  type: NoteType;
  title?: string;
  content: string;
  fieldId?: string;
  zoneId?: string;
  plantId?: string;
  photos: string[];
  tags: string[];
  weather?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  fieldId?: string;
  plantId?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  remindBefore?: number; // minutes
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity log entry
export interface ActivityLogEntry {
  id: string;
  type: 'watering' | 'planting' | 'harvest' | 'note' | 'task' | 'field' | 'plant' | 'problem';
  action: 'create' | 'update' | 'delete' | 'complete';
  description: string;
  entityId?: string;
  entityType?: 'field' | 'plant' | 'note' | 'task';
  timestamp: string;
}

// Dashboard stats
export interface DashboardStats {
  totalFields: number;
  totalPlants: number;
  plantsNeedingWater: number;
  overdueWaterings: number;
  criticalWaterings: number;
  problemPlants: number;
  tasksToday: number;
  tasksPending: number;
}

// Filter options for plants list
export interface PlantFilters {
  fieldId?: string;
  zoneId?: string;
  typeId?: string;
  healthStatus?: PlantHealthStatus;
  wateringStatus?: WateringStatus;
  searchQuery?: string;
}

// Sort options
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
