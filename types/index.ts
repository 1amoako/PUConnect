export type ExpertStatus = 'none' | 'pending' | 'approved';

export interface AdOrRequest {
  id: string;
  type: "skill" | "request";
  title: string;
  author: string;
  price?: string;
  image: string;
  description: string;
  status?: "pending" | "approved" | "rejected";
}

export interface UserProfile {
  name: string;
  handle: string;
  role?: "admin" | "user";
  joined: string;
  avatar?: string;
  expertStatus: ExpertStatus;
  expertProfile?: {
    description: string;
    skills: string[];
  };
  pendingExpertData?: {
    description: string;
    skills: string[];
  };
  contact?: string;
  ads: AdOrRequest[];
  requests: AdOrRequest[];
}
