export type TicketType = {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  sold: number;
};

export type Zone = {
  id: string;
  name: string;
  color: string;
  ticketTypeId: string;
  capacity: number;
  sold: number;
};

export type EventInfo = {
  id: string;
  name: string;
  time: string;
  location: string;
}; 