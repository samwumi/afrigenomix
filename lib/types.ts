// Core TypeScript types for Afrigenomix

export type Role = 'CUSTOMER' | 'COLLECTION_PARTNER' | 'LAB_PARTNER' | 'ADMIN' | 'SUPER_ADMIN';

export type CaseStatus = 
  | 'PENDING'
  | 'DOCUMENTS_SUBMITTED'
  | 'DOCUMENTS_VERIFIED'
  | 'AWAITING_COLLECTION'
  | 'COLLECTION_SCHEDULED'
  | 'COLLECTION_COMPLETED'
  | 'SAMPLE_IN_TRANSIT'
  | 'SAMPLE_RECEIVED'
  | 'TESTING_IN_PROGRESS'
  | 'QUALITY_REVIEW'
  | 'RESULT_READY'
  | 'RESULT_RELEASED'
  | 'COMPLETED'
  | 'CANCELLED';

export type TestCategory = 
  | 'PATERNITY'
  | 'MATERNITY'
  | 'SIBLING'
  | 'GRANDPARENT'
  | 'IMMIGRATION'
  | 'LEGAL'
  | 'PRENATAL'
  | 'GENETIC'
  | 'OTHER';

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  country: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION';
  capabilities: string[];
  description?: string;
  accreditations?: LaboratoryAccreditation[];
}

export interface LaboratoryAccreditation {
  id: string;
  laboratoryId: string;
  accreditationType: string;
  accreditationBody: string;
  accreditationNumber?: string;
  issuedDate?: Date;
  expiryDate?: Date;
  verified: boolean;
}

export interface TestType {
  id: string;
  name: string;
  slug: string;
  category: TestCategory;
  description?: string;
  requirements?: string;
  sampleType?: string;
  isLegal: boolean;
  chainOfCustody: boolean;
  turnaroundDays?: number;
  price?: number;
  currency?: string;
  isActive: boolean;
}

export interface Case {
  id: string;
  caseNumber: string;
  customerId: string;
  testTypeId: string;
  laboratoryId?: string;
  status: CaseStatus;
  purpose?: string;
  country: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: CustomerProfile;
  testType?: TestType;
  laboratory?: Laboratory;
  participants?: Participant[];
  documents?: Document[];
  timeline?: CaseTimeline[];
}

export interface Participant {
  id: string;
  caseId: string;
  fullName: string;
  relationship: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  phone?: string;
  email?: string;
}

export interface Document {
  id: string;
  caseId: string;
  participantId?: string;
  type: 'PASSPORT' | 'NATIONAL_ID' | 'BIRTH_CERTIFICATE' | 'IMMIGRATION_DOCUMENT' | 'COLLECTION_FORM' | 'CONSENT_FORM' | 'OTHER';
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface Appointment {
  id: string;
  caseId: string;
  collectionPartnerId?: string;
  collectionLocationId?: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export interface CaseTimeline {
  id: string;
  caseId: string;
  event: string;
  description?: string;
  performedBy?: string;
  createdAt: Date;
}

export interface Quote {
  id: string;
  caseId: string;
  amount: number;
  currency: string;
  testFee?: number;
  collectionFee?: number;
  courierFee?: number;
  otherFees?: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  validUntil?: Date;
  notes?: string;
}

export interface Payment {
  id: string;
  caseId: string;
  amount: number;
  currency: string;
  paymentReference: string;
  paymentProvider?: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  transactionDate?: Date;
}

export interface Result {
  id: string;
  caseId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'PENDING' | 'PROCESSING' | 'QUALITY_REVIEW' | 'READY' | 'RELEASED' | 'SUPERSEDED';
  uploadedAt: Date;
  releasedAt?: Date;
  releasedBy?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  author?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Test Finder Types
export interface TestFinderState {
  step: number;
  purpose?: string;
  participants?: string[];
  legalRequired?: boolean;
  country?: string;
  sameCountry?: boolean;
  chainOfCustody?: boolean;
  recommendation?: TestType;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  profile?: CustomerProfile;
  error?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  pendingActions: number;
}

export interface AdminStats extends DashboardStats {
  totalCustomers: number;
  totalLaboratories: number;
  totalCollectionPartners: number;
  revenueThisMonth: number;
  pendingPayments: number;
}
