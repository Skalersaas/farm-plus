import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Plant, PlantType, WateringLog, PlantFilters, WateringStatus } from '../types';
import { addDays, startOfDay } from 'date-fns';

interface PlantsState {
  plants: Plant[];
  plantTypes: PlantType[];
  wateringLogs: WateringLog[];
  filters: PlantFilters;
  selectedPlantId: string | null;
  isLoading: boolean;

  // Plant actions
  setPlants: (plants: Plant[]) => void;
  addPlant: (plant: Plant) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  selectPlant: (id: string | null) => void;

  // Plant types
  setPlantTypes: (types: PlantType[]) => void;
  addPlantType: (type: PlantType) => void;

  // Watering
  waterPlant: (plantId: string, notes?: string, amount?: number) => void;
  addWateringLog: (log: WateringLog) => void;
  getWateringLogs: (plantId: string) => WateringLog[];

  // Filters
  setFilters: (filters: PlantFilters) => void;
  clearFilters: () => void;

  // Helpers
  getPlantById: (id: string) => Plant | undefined;
  getPlantsByField: (fieldId: string) => Plant[];
  getPlantsByZone: (zoneId: string) => Plant[];
  getPlantsCount: () => number;
  getPlantsNeedingWater: () => Plant[];
  getOverdueWaterings: () => Plant[];
  getCriticalWaterings: () => Plant[];
  updateWateringStatuses: () => void;
}

const calculateWateringStatus = (plant: Plant): WateringStatus => {
  if (!plant.lastWateredAt) {
    return 'critical';
  }

  const today = startOfDay(new Date());
  const nextWatering = plant.nextWateringAt
    ? new Date(plant.nextWateringAt)
    : addDays(new Date(plant.lastWateredAt), plant.wateringFrequencyDays);

  const daysUntilWatering = Math.ceil(
    (nextWatering.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilWatering < -2) {
    return 'critical';
  } else if (daysUntilWatering < 0) {
    return 'overdue';
  } else if (daysUntilWatering <= 1) {
    return 'due_soon';
  }
  return 'watered';
};

export const usePlantsStore = create<PlantsState>()(
  persist(
    (set, get) => ({
      plants: [],
      plantTypes: [],
      wateringLogs: [],
      filters: {},
      selectedPlantId: null,
      isLoading: false,

      setPlants: (plants) => set({ plants }),

      addPlant: (plant) =>
        set((state) => ({
          plants: [...state.plants, plant],
        })),

      updatePlant: (id, updates) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id
              ? { ...plant, ...updates, updatedAt: new Date().toISOString() }
              : plant
          ),
        })),

      deletePlant: (id) =>
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
          wateringLogs: state.wateringLogs.filter((log) => log.plantId !== id),
          selectedPlantId:
            state.selectedPlantId === id ? null : state.selectedPlantId,
        })),

      selectPlant: (id) => set({ selectedPlantId: id }),

      setPlantTypes: (types) => set({ plantTypes: types }),

      addPlantType: (type) =>
        set((state) => ({
          plantTypes: [...state.plantTypes, type],
        })),

      waterPlant: (plantId, notes, amount) => {
        const now = new Date().toISOString();
        const plant = get().getPlantById(plantId);

        if (!plant) return;

        const nextWateringAt = addDays(
          new Date(),
          plant.wateringFrequencyDays
        ).toISOString();

        // Add watering log
        const log: WateringLog = {
          id: `wl-${Date.now()}`,
          plantId,
          date: now,
          amount,
          notes,
          createdAt: now,
        };

        set((state) => ({
          plants: state.plants.map((p) =>
            p.id === plantId
              ? {
                  ...p,
                  lastWateredAt: now,
                  nextWateringAt,
                  wateringStatus: 'watered',
                  updatedAt: now,
                }
              : p
          ),
          wateringLogs: [...state.wateringLogs, log],
        }));
      },

      addWateringLog: (log) =>
        set((state) => ({
          wateringLogs: [...state.wateringLogs, log],
        })),

      getWateringLogs: (plantId) =>
        get().wateringLogs.filter((log) => log.plantId === plantId),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      clearFilters: () => set({ filters: {} }),

      getPlantById: (id) => get().plants.find((plant) => plant.id === id),

      getPlantsByField: (fieldId) =>
        get().plants.filter((plant) => plant.fieldId === fieldId),

      getPlantsByZone: (zoneId) =>
        get().plants.filter((plant) => plant.zoneId === zoneId),

      getPlantsCount: () => get().plants.length,

      getPlantsNeedingWater: () =>
        get().plants.filter(
          (plant) =>
            plant.wateringStatus === 'due_soon' ||
            plant.wateringStatus === 'overdue' ||
            plant.wateringStatus === 'critical'
        ),

      getOverdueWaterings: () =>
        get().plants.filter((plant) => plant.wateringStatus === 'overdue'),

      getCriticalWaterings: () =>
        get().plants.filter((plant) => plant.wateringStatus === 'critical'),

      updateWateringStatuses: () =>
        set((state) => ({
          plants: state.plants.map((plant) => ({
            ...plant,
            wateringStatus: calculateWateringStatus(plant),
          })),
        })),
    }),
    {
      name: 'farm-plus-plants',
    }
  )
);
