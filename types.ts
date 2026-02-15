export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface Reservation {
  id: number;
  clientName: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  serviceId?: number;
  status: ReservationStatus;
  note?: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  start: string; // HH:mm
  end: string; // HH:mm
  isOpen: boolean;
}