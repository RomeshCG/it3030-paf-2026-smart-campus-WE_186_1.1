import axios from 'axios';
import { type ResourceDTO, type PageResponse } from '../types/resource';

const API_URL = 'http://localhost:8080/api/resources';

export const getResources = async (params: {
  page?: number;
  size?: number;
  type?: string;
  status?: string;
  capacity?: number;
  sortBy?: string;
  sortDir?: string;
}) => {
  const { data } = await axios.get<PageResponse<ResourceDTO>>(API_URL, { params });
  return data;
};

export const getResourceById = async (id: number) => {
  const { data } = await axios.get<ResourceDTO>(`${API_URL}/${id}`);
  return data;
};

export const createResource = async (resource: ResourceDTO) => {
  const { data } = await axios.post<ResourceDTO>(API_URL, resource);
  return data;
};

export const updateResource = async (id: number, resource: ResourceDTO) => {
  const { data } = await axios.put<ResourceDTO>(`${API_URL}/${id}`, resource);
  return data;
};

export const deleteResource = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
