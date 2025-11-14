// types/engine.ts
export type EngineCategory =
  | 'Pelle'
  | 'Bulldozer'
  | 'Compacteur'
  | 'Camion'
  | 'Nacelle'
  | 'Autre';

export interface Engine {
  id: string;
  name: string;
  category: EngineCategory;
  hoursRate: number; // DA / hour
  dayRate: number; // DA / day
  transportCost: number; // DA flat
  available: boolean;
  photo?: string;
  notes?: string;
  updatedAt: string;
}
