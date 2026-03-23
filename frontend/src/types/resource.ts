export const ResourceTypes = {
  LAB: 'LAB',
  HALL: 'HALL',
  EQUIPMENT: 'EQUIPMENT'
} as const;

export type ResourceType = typeof ResourceTypes[keyof typeof ResourceTypes];

export const ResourceStatuses = {
  ACTIVE: 'ACTIVE',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE'
} as const;

export type ResourceStatus = typeof ResourceStatuses[keyof typeof ResourceStatuses];

export interface ResourceDTO {
  id?: number;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  status: ResourceStatus;
  imageUrl?: string;
  description?: string;
  downloadUrl?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
