export interface Schedule {
  days: number[];
  startTime: string;
  endTime: string;
  enabled?: boolean;
}

export interface CustomBlockPage {
  title: string;
  message: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
}

export interface Settings {
  blockedSites: string[];
  schedules: Schedule[];
  customBlockPage: CustomBlockPage;
  isEnabled?: boolean;
}

export interface Message {
  type: 'GET_SETTINGS' | 'UPDATE_SETTINGS';
  settings?: Settings;
}
