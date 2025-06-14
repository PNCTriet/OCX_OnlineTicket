import { TicketType, Zone, EventInfo } from "../types/ticket";

export const TICKETS: TicketType[] = [
  {
    id: "farmers-nhun-nhay",
    name: "Farmers Nhún Nhảy",
    price: 599000,
    color: "#56F482",
    quantity: 0,
    sold: 50,
  },
  {
    id: "farmers-ngoi-chill",
    name: "Farmers Ngồi Chill",
    price: 499000,
    color: "#31E4EC",
    quantity: 0,
    sold: 30,
  },
  {
    id: "farmers-vip",
    name: "Farmers VIP",
    price: 899000,
    color: "#F06185",
    quantity: 0,
    sold: 20,
  },
  {
    id: "farmers-premium",
    name: "Farmers Premium",
    price: 799000,
    color: "#F2D31F",
    quantity: 0,
    sold: 25,
  },
  {
    id: "farmers-standard",
    name: "Farmers Standard",
    price: 399000,
    color: "#A780F4",
    quantity: 0,
    sold: 40,
  },
];

export const ZONES: Zone[] = [
  {
    id: "zone-1",
    name: "#1 FARMERS NHÚN NHẢY",
    color: "#56F482",
    ticketTypeId: "farmers-nhun-nhay",
    capacity: 100,
    sold: 50,
  },
  {
    id: "zone-2",
    name: "#2 FARMERS NGỒI CHILL",
    color: "#31E4EC",
    ticketTypeId: "farmers-ngoi-chill",
    capacity: 100,
    sold: 30,
  },
  {
    id: "zone-3",
    name: "#3 FARMERS VIP",
    color: "#F06185",
    ticketTypeId: "farmers-vip",
    capacity: 50,
    sold: 20,
  },
  {
    id: "zone-4",
    name: "#4 FARMERS PREMIUM",
    color: "#F2D31F",
    ticketTypeId: "farmers-premium",
    capacity: 75,
    sold: 25,
  },
  {
    id: "zone-5",
    name: "#5 FARMERS STANDARD",
    color: "#A780F4",
    ticketTypeId: "farmers-standard",
    capacity: 150,
    sold: 40,
  },
];

export const EVENT_INFO: EventInfo = {
  id: "ocx-4",
  name: "Ớt Cay Xè 4",
  time: "20:00 - 22:00",
  location: "Hồ Chí Minh",
}; 