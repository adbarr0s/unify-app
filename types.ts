
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DOC_ASSISTANT = 'DOC_ASSISTANT',
  RESOURCE_HUB = 'RESOURCE_HUB',
  VOICE_BUDDY = 'VOICE_BUDDY',
  COMMUNITY_MAP = 'COMMUNITY_MAP',
  BUREAUCRACY_GUIDE = 'BUREAUCRACY_GUIDE',
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  MY_DOCUMENTS = 'MY_DOCUMENTS'
}

export interface Resource {
  title: string;
  uri: string;
}

export interface MapPlace {
  title: string;
  uri: string;
}

export interface StepGuide {
  title: string;
  steps: {
    label: string;
    description: string;
    completed: boolean;
  }[];
  officialLinks: Resource[];
}

export interface StoredDocument {
  id: string;
  name: string;
  category: string;
  date: string;
  mimeType: string;
  data: string; // Base64 string
}
