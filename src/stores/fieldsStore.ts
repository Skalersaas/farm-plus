import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Field, Zone } from '../types';

interface FieldsState {
  fields: Field[];
  selectedFieldId: string | null;
  isLoading: boolean;

  // Actions
  setFields: (fields: Field[]) => void;
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;
  selectField: (id: string | null) => void;

  // Zone actions
  addZone: (fieldId: string, zone: Zone) => void;
  updateZone: (fieldId: string, zoneId: string, updates: Partial<Zone>) => void;
  deleteZone: (fieldId: string, zoneId: string) => void;

  // Helpers
  getFieldById: (id: string) => Field | undefined;
  getFieldsCount: () => number;
}

export const useFieldsStore = create<FieldsState>()(
  persist(
    (set, get) => ({
      fields: [],
      selectedFieldId: null,
      isLoading: false,

      setFields: (fields) => set({ fields }),

      addField: (field) =>
        set((state) => ({
          fields: [...state.fields, field],
        })),

      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === id
              ? { ...field, ...updates, updatedAt: new Date().toISOString() }
              : field
          ),
        })),

      deleteField: (id) =>
        set((state) => ({
          fields: state.fields.filter((field) => field.id !== id),
          selectedFieldId:
            state.selectedFieldId === id ? null : state.selectedFieldId,
        })),

      selectField: (id) => set({ selectedFieldId: id }),

      addZone: (fieldId, zone) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === fieldId
              ? {
                  ...field,
                  zones: [...field.zones, zone],
                  updatedAt: new Date().toISOString(),
                }
              : field
          ),
        })),

      updateZone: (fieldId, zoneId, updates) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === fieldId
              ? {
                  ...field,
                  zones: field.zones.map((zone) =>
                    zone.id === zoneId ? { ...zone, ...updates } : zone
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : field
          ),
        })),

      deleteZone: (fieldId, zoneId) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === fieldId
              ? {
                  ...field,
                  zones: field.zones.filter((zone) => zone.id !== zoneId),
                  updatedAt: new Date().toISOString(),
                }
              : field
          ),
        })),

      getFieldById: (id) => get().fields.find((field) => field.id === id),

      getFieldsCount: () => get().fields.length,
    }),
    {
      name: 'farm-plus-fields',
    }
  )
);
