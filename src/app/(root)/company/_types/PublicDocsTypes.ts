// Base interface for document attachments
export interface IPublicDocumentAttachment {
  name: string;
  downloadUrl: string | null;
}

// Base interface for individual documents
export interface IDocument {
  formId?: string;
  fileName: string;
  documentCategory: string;
  filingDate: string;
  financialYear: string;
  sizeKB?: number;
  numberOfPages?: number;
  downloadUrl?: string;
  attachments?: IPublicDocumentAttachment[];
  attachmentLabel?: string;
  fileType?: string;
}

// Interface for zip file information
export interface IZipFile {
  filename: string;
  blob_url: string;
  createdAt: string;
  total_size_bytes: number;
  successful_files: number;
}

// Interface for download status
export interface IDownloadStatus {
  jobStatus?:
    | 'pending'
    | 'challan_paid'
    | 'challan_skipped'
    | 'downloading_docs'
    | 'documents_downloaded'
    | 'no_docs_found';
  documentDownloadStatus?: 'pending' | 'in_progress' | 'success';
  totalDocuments?: number;
  downloadedDocuments?: number;
  pendingDocuments?: number;
  downloadStatusLastUpdated?: string;
  downloadCompletedAt?: string;
  completionPercentage?: number;
  completedAt?: string;
  challanDownloadUrl?: string | null;
  challanPaidAt?: string;
  totalZipFiles?: number;
  zipCompletedAt?: string;
  zipFiles?: IZipFile[];
}

// Interface for the standard document collections
export interface IPublicDocument {
  message: string;
  v2_documents?: IDocument[];
  v2_paid_documents?: IDocument[];
  v3_documents?: IDocument[];
  v3_paid_documents?: IDocument[];
  downloadStatus?: IDownloadStatus;
  last_updated?: string;
  lastUpdated?: string;
}

// Combined response interface that handles both completed and processing states
export interface IPublicDocumentsResponse {
  success: boolean;
  message: string;
  data: IPublicDocument;
}
