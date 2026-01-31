
export interface Participant {
  id: string;
  name: string;
}

export interface Prize {
  id: string;
  name: string;
  weight: number;
}

export interface SpinResult {
  winner: Participant;
  prize: Prize;
  message: string;
}

export type TabType = 'wheel' | 'settings';
