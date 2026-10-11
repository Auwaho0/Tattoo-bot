import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { BookingCreate, BookingResponse } from './model/types';

export const bookingKeys = {
  all: ['bookings'] as const,
  create: () => [...bookingKeys.all, 'create'] as const,
};

export const createBooking = async (
  data: BookingCreate,
): Promise<BookingResponse> => {
  const { data: res } = await apiClient.post<BookingResponse>('/api/note', data);
  return res;
};

export const useCreateBookingMutation = () =>
  useMutation({
    mutationKey: bookingKeys.create(),
    mutationFn: createBooking,
    retry: 1,
  });