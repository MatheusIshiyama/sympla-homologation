import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { SymplaOrderResponse, SymplaParticipantResponse } from '@/types';

const baseURL: string = 'https://api.sympla.com.br/public/v3';

export class SymplaApiClient {
  private axiosInstance: AxiosInstance;

  constructor(token: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        's_token': token,
      },
    });
  }

  private async makeRequest<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get<T>(endpoint, config);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Sympla API error: ${error.response?.status} ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  async getOrders(eventId: string, page: number = 1): Promise<SymplaOrderResponse> {
    const params: Record<string, unknown> = {
      page,
      page_size: 20,
      field_sort: 'updated_date',
      sort: 'DESC',
      status: true,
    };

    return this.makeRequest<SymplaOrderResponse>(`/events/${eventId}/orders`, { params });
  }

  async getOrderParticipants(eventId: string, orderId: string): Promise<SymplaParticipantResponse> {
    return this.makeRequest<SymplaParticipantResponse>(`/events/${eventId}/orders/${orderId}/participants`);
  }
}
