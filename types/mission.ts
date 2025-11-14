// types/mission.ts
export interface Mission {
  id: string;
  engineId: string;
  client: string;
  start?: string; // ISO
  end?: string; // ISO
  hours?: number;
  total?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}
