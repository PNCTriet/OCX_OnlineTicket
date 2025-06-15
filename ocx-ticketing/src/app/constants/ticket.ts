import { TicketType, Zone, EventInfo, Seat } from "../types/ticket";

export const TICKETS: TicketType[] = [
  {
    id: "farmers-nhun-nhay",
    name: "Farmers Nhún Nhảy",
    price: 599000,
    color: "#56F482",
    quantity: 0,
    sold: 50,
    label: "Khu vực A",
  },
  {
    id: "farmers-ngoi-chill",
    name: "Farmers Ngồi Chill",
    price: 499000,
    color: "#31E4EC",
    quantity: 0,
    sold: 30,
    label: "Khu vực B",
  },
  {
    id: "farmers-vip",
    name: "Farmers VIP",
    price: 899000,
    color: "#F06185",
    quantity: 0,
    sold: 20,
    label: "Khu vực C",
  },
  {
    id: "farmers-premium",
    name: "Farmers Premium",
    price: 799000,
    color: "#F2D31F",
    quantity: 0,
    sold: 25,
    label: "Khu vực D",
  },
  {
    id: "farmers-standard",
    name: "Farmers Standard",
    price: 399000,
    color: "#A780F4",
    quantity: 0,
    sold: 40,
    label: "Khu vực E",
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
    description: "Khu vực A: Gần sân khấu, năng động",
  },
  {
    id: "zone-2",
    name: "#2 FARMERS NGỒI CHILL",
    color: "#31E4EC",
    ticketTypeId: "farmers-ngoi-chill",
    capacity: 100,
    sold: 30,
    description: "Khu vực B: Gần sân khấu, thư giãn",
  },
  {
    id: "zone-3",
    name: "#3 FARMERS VIP",
    color: "#F06185",
    ticketTypeId: "farmers-vip",
    capacity: 50,
    sold: 20,
    description: "Khu vực C: Khu vực VIP, tầm nhìn tốt",
  },
  {
    id: "zone-4",
    name: "#4 FARMERS PREMIUM",
    color: "#F2D31F",
    ticketTypeId: "farmers-premium",
    capacity: 75,
    sold: 25,
    description: "Khu vực D: Khu vực Premium, trải nghiệm đặc biệt",
  },
  {
    id: "zone-5",
    name: "#5 FARMERS STANDARD",
    color: "#A780F4",
    ticketTypeId: "farmers-standard",
    capacity: 150,
    sold: 40,
    description: "Khu vực E: Khu vực tiêu chuẩn, phù hợp mọi đối tượng",
  },
];

export const EVENT_INFO: EventInfo = {
  id: "ocx-4",
  name: "Ớt Cay Xè [Season 4]",
  time: "20:00 - 22:00",
  location: "2 Nguyễn Văn Tráng, Phường Bến Nghé, Quận 1, Hồ Chí Minh",
  avatar: "/images/ocx4_event_avatar.jpg",
  date: "T7, 14/06/2024",
};

// New layout configuration for the seat map
export const SEAT_LAYOUT_CONFIG = {
  STAGE: {
    x: 225,
    y: 20,
    width: 200,
    height: 70,
  },
  SECTIONS: [
    {
      id: 'A',
      label: 'A',
      x: 80,
      y: 100,
      width: 220,
      height: 100,
      rows: 5,
      cols: 6,
      color: "#56F482",
      ticketTypeId: "farmers-nhun-nhay",
    },
    {
      id: 'B',
      label: 'B',
      x: 350,
      y: 100,
      width: 220,
      height: 100,
      rows: 5,
      cols: 6,
      color: "#31E4EC",
      ticketTypeId: "farmers-ngoi-chill",
    },
    {
      id: 'C',
      label: 'C',
      x: 80,
      y: 220,
      width: 160,
      height: 100,
      rows: 5,
      cols: 6,
      color: "#F06185",
      ticketTypeId: "farmers-vip",
    },
    {
      id: 'D',
      label: 'D',
      x: 420,
      y: 220,
      width: 150,
      height: 100,
      rows: 5,
      cols: 6,
      color: "#F2D31F",
      ticketTypeId: "farmers-premium",
    },
    {
      id: 'E',
      label: 'E',
      x: 250,
      y: 220,
      width: 160,
      height: 100,
      rows: 6,
      cols: 5,
      color: "#A780F4",
      ticketTypeId: "farmers-standard",
    },
  ],
};

const SEAT_RADIUS = 6;
const SEAT_MARGIN = 4;

export const SEATS: Seat[] = SEAT_LAYOUT_CONFIG.SECTIONS.flatMap(section => {
  const sectionSeats: Seat[] = [];
  let seatCounter = 0;
  for (let row = 0; row < section.rows; row++) {
    for (let col = 0; col < section.cols; col++) {
      const x = section.x + col * (2 * SEAT_RADIUS + SEAT_MARGIN) + SEAT_RADIUS + SEAT_MARGIN;
      const y = section.y + row * (2 * SEAT_RADIUS + SEAT_MARGIN) + SEAT_RADIUS + SEAT_MARGIN;
      seatCounter++;
      sectionSeats.push({
        id: `${section.id}-${seatCounter}`,
        x,
        y,
        type: section.id,
        status: Math.random() < 0.1 ? 'sold' : 'available',
      });
    }
  }
  return sectionSeats;
}); 