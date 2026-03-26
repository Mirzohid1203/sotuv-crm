export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Active" | "Lead" | "Former" | "Archived";
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Task {
  id: string;
  customerId?: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  createdAt?: any;
}

export type DealStage = "Lead" | "Contacted" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";

export interface Deal {
  id: string;
  customerId?: string;
  customerName?: string;
  title: string;
  value: number;
  stage: DealStage;
  dueDate: string;
  createdAt?: any;
  updatedAt?: any;
}
