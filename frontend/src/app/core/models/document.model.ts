export interface DocumentItem {
  id: string;
  _id?: string;
  userId: string;
  originalName: string;
  storedFileId: string;
  size: number;
  mimeType: string;
  extension: string;
  checksum: string;
  categoryId?: string | null;
  categoryName?: string;
  description?: string;
  uploadDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DocumentListResponse {
  status: string;
  data: {
    documents: DocumentItem[];
    pagination: PaginationMeta;
  };
}

export interface DashboardStats {
  activeFilesCount: number;
  totalDocuments: number;
  documentsThisMonth: number;
  categoryCount: number;
  maxAllowedFiles: number;
  remainingFilesCount: number;
  totalSizeBytes: number;
  totalSizeMB: string;
  categoryBreakdown: Array<{
    categoryId: string | null;
    categoryName: string;
    count: number;
  }>;
  recentUploads: DocumentItem[];
}
