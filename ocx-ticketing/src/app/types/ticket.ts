export type Ticket = {
  id: string;
  name: string;
  price: number;
  color: string;
  sold: number;
  label?: string;
  status: "not-yet-on-sale" | "available" | "sold-out";
  quantity: number;
};

export type TicketType = {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  sold: number;
  label?: string;
  status: 'not-yet-on-sale' | 'available' | 'sold-out';
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
  date: string;
  time: string;
  location: string;
  avatar?: string;
}; 