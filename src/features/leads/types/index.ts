export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LeadSource = 'website' | 'referral' | 'campaign' | 'linkedin' | 'cold-call' | 'email' | 'trade-show' | 'partner' | 'event' | 'cold-outreach';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource | null;
  created_at: string;
  updated_at: string;
}
