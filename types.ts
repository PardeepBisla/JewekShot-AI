
export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  lastEdited: string;
  renderCount: number;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface PhotoshootConfig {
  jewelryImages: string[]; // Array of base64 strings for multiple angles
  placement: string;
  style: string;
  prompt: string;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  CREATE = 'CREATE',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}
