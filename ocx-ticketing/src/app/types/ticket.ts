export type TicketType = {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  sold: number;
  label?: string;
};

export type Zone = {
  id: string;
  name: string;
  color: string;
  ticketTypeId: string;
  capacity: number;
  sold: number;
  description?: string;
};

export type Seat = {
  id: string;
  x: number;
  y: number;
  type: string; // e.g., 'A', 'B', 'VIP', corresponds to a zone
  status: 'available' | 'selected' | 'sold';
};

export type EventInfo = {
  id: string;
  name: string;
  time: string;
  location: string;
  avatar?: string;
  date?: string;
}; 