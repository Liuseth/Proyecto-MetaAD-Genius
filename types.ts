
export enum AdObjective {
  CLICKS = 'CLICKS',
  LEADS = 'LEADS'
}

export interface AdCopy {
  headline: string;
  primaryText: string;
  description: string;
  callToAction: string;
}

export interface SegmentationStrategy {
  audienceName: string;
  ageRange: string;
  locations: string[];
  interests: string[];
  behaviors: string[];
  detailedTargetingSummary: string;
  stockFindings?: string[];
}

export interface Campaign {
  id: string;
  clientName: string;
  url: string;
  objective: AdObjective;
  status: 'draft' | 'ready' | 'active';
  creativeUrl?: string;
  creativeType: 'image' | 'video';
  copy?: AdCopy;
  strategy?: SegmentationStrategy;
  sources?: { title: string; uri: string }[];
}

export type AppView = 'dashboard' | 'strategy-lab' | 'new-campaign';
