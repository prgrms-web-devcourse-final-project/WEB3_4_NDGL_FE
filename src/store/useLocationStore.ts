import { LocationType } from '@/types/post.type';
import { create } from 'zustand';

type LocationStoreType = {
  locations: LocationType[];
  addLocation: (location: LocationType) => void;
  setLocations: (locations: LocationType[]) => void;
  clearLocations: () => void;
};

export const useLocationStore = create<LocationStoreType>((set) => ({
  locations: [],

  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),

  setLocations: (locations) => set({ locations }),

  clearLocations: () => set({ locations: [] }),
}));
