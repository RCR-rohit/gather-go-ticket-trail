import { z } from "zod";

export const EVENT_STORAGE_KEY = "afterglow-events-v1";
export const BOOKING_STORAGE_KEY = "afterglow-bookings-v1";
export const TICKET_LIMIT = 8;
export const LOW_INVENTORY_THRESHOLD = 12;

export type EventCategory = "Music" | "Arts" | "Food" | "Ideas";
export type TicketType = "General" | "VIP";
export type EventStatus = "active" | "sold_out" | "cancelled";
export type BookingStatus = "confirmed" | "cancelled";
export type PaymentStatus = "paid" | "refunded" | "forfeited";

export interface EventListing {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  city: string;
  description: string;
  price: number;
  vipPrice: number;
  capacity: number;
  vipCapacity: number;
  sold: number;
  vipSold: number;
  imagePosition: string;
  featured?: boolean;
  status: EventStatus;
  archived: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  ticketType: TicketType;
  quantity: number;
  total: number;
  createdAt: string;
  demo?: boolean;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}

export const sampleEvents: EventListing[] = [
  {
    id: "afterglow-festival",
    title: "Afterglow Festival",
    category: "Music",
    date: "2026-12-05",
    time: "6:30 PM",
    venue: "Harbor Park",
    city: "Brooklyn, NY",
    description: "A night of live music, open-air dancing, and the last light over the water. Three stages, independent food makers, and a lineup worth staying up for.",
    price: 48,
    vipPrice: 96,
    capacity: 480,
    vipCapacity: 42,
    sold: 331,
    vipSold: 35,
    imagePosition: "0% 100%",
    featured: true,
    status: "active",
    archived: false,
  },
  {
    id: "blue-note-sessions",
    title: "Blue Note Sessions",
    category: "Music",
    date: "2026-11-28",
    time: "8:00 PM",
    venue: "The Lantern Room",
    city: "Manhattan, NY",
    description: "An up-close jazz session in a candlelit room. Settle in for a night of warm brass, deep grooves, and a stellar house trio.",
    price: 32,
    vipPrice: 68,
    capacity: 190,
    vipCapacity: 30,
    sold: 112,
    vipSold: 25,
    status: "active",
    archived: false,
    imagePosition: "0% 0%",
  },
  {
    id: "open-studio-night",
    title: "Open Studio Night",
    category: "Arts",
    date: "2026-12-12",
    time: "5:00 PM",
    venue: "Foundry Gallery",
    city: "Brooklyn, NY",
    description: "Meet the artists, wander through the newest collection, and discover the work happening in Brooklyn studios right now.",
    price: 18,
    vipPrice: 40,
    capacity: 160,
    vipCapacity: 28,
    sold: 93,
    vipSold: 18,
    status: "active",
    archived: false,
    imagePosition: "100% 0%",
  },
  {
    id: "city-table-market",
    title: "The City Table",
    category: "Food",
    date: "2026-12-19",
    time: "12:00 PM",
    venue: "Pier 6 Greenway",
    city: "Brooklyn, NY",
    description: "A winter gathering for people who love good food. Meet local growers, taste your way through the city, and stay awhile.",
    price: 24,
    vipPrice: 54,
    capacity: 220,
    vipCapacity: 35,
    sold: 128,
    vipSold: 22,
    status: "active",
    archived: false,
    imagePosition: "0% 100%",
  },
  {
    id: "future-in-progress",
    title: "Future, In Progress",
    category: "Ideas",
    date: "2027-01-16",
    time: "9:00 AM",
    venue: "The Glasshouse",
    city: "Manhattan, NY",
    description: "A one-day gathering of makers, thinkers, and people building what comes next. Bright ideas, thoughtful conversations, excellent coffee.",
    price: 65,
    vipPrice: 140,
    capacity: 290,
    vipCapacity: 38,
    sold: 222,
    vipSold: 28,
    status: "active",
    archived: false,
    imagePosition: "100% 100%",
  },
  {
    id: "midwinter-melodies",
    title: "Midwinter Melodies",
    category: "Music",
    date: "2027-02-06",
    time: "7:30 PM",
    venue: "Union Hall",
    city: "Brooklyn, NY",
    description: "A folk-inspired winter concert with a candlelit stage and a listening-room feel. Come in from the cold and stay for the encore.",
    price: 36,
    vipPrice: 74,
    capacity: 250,
    vipCapacity: 30,
    sold: 174,
    vipSold: 19,
    status: "active",
    archived: false,
    imagePosition: "0% 0%",
  },
];

const bookingSchema = z.object({
  eventId: z.string().trim().min(1, "Choose an event."),
  name: z.string().trim().min(2, "Enter your full name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer."),
  ticketType: z.enum(["General", "VIP"]),
  quantity: z.number().int("Choose a whole number of tickets.").min(1, "Choose at least one ticket.").max(TICKET_LIMIT, `Choose no more than ${TICKET_LIMIT} tickets.`),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function validateBooking(input: unknown): { success: true; data: BookingInput } | { success: false; errors: Partial<Record<keyof BookingInput, string>> } {
  const parsed = bookingSchema.safeParse(input);
  if (parsed.success) return { success: true, data: parsed.data };
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in bookingSchema.shape) {
      errors[field as keyof BookingInput] ??= issue.message;
    }
  }
  return { success: false, errors };
}

export function canBook(event: EventListing, ticketType: TicketType, quantity: number): boolean {
  const remaining = ticketType === "VIP" ? event.vipCapacity - event.vipSold : event.capacity - event.sold;
  return event.status === "active" && !event.archived && Number.isInteger(quantity) && quantity >= 1 && quantity <= TICKET_LIMIT && quantity <= remaining;
}

export function readStoredEvents(value: string | null): EventListing[] {
  if (!value) return sampleEvents;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return sampleEvents;
    const events = parsed.filter((item): item is EventListing => {
      if (!item || typeof item !== "object") return false;
      const event = item as Partial<EventListing>;
      return typeof event.id === "string" && typeof event.title === "string" && typeof event.sold === "number" && typeof event.vipSold === "number" && typeof event.capacity === "number" && typeof event.vipCapacity === "number";
    });
    return events.map((event) => ({
      ...event,
      status: event.status === "sold_out" || event.status === "cancelled" ? event.status : "active",
      archived: event.archived === true,
    }));
  } catch {
    return sampleEvents;
  }
}

const sampleBookings: Booking[] = [
  { id: "BK-7842", eventId: "afterglow-festival", eventTitle: "Afterglow Festival", name: "Alex Morgan", email: "alex.morgan@example.com", ticketType: "General", quantity: 2, total: 96, createdAt: "2026-11-07T16:45:00.000Z", demo: true, status: "confirmed", paymentStatus: "paid" },
  { id: "BK-7841", eventId: "blue-note-sessions", eventTitle: "Blue Note Sessions", name: "Jamie Rivera", email: "jamie.rivera@example.com", ticketType: "VIP", quantity: 1, total: 68, createdAt: "2026-11-07T14:20:00.000Z", demo: true, status: "confirmed", paymentStatus: "paid" },
  { id: "BK-7840", eventId: "open-studio-night", eventTitle: "Open Studio Night", name: "Taylor Reed", email: "taylor.reed@example.com", ticketType: "General", quantity: 3, total: 54, createdAt: "2026-11-06T18:05:00.000Z", demo: true, status: "confirmed", paymentStatus: "paid" },
];

export function readStoredBookings(value: string | null): Booking[] {
  if (!value) return sampleBookings;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return sampleBookings;
    return parsed.filter((item): item is Booking => Boolean(item && typeof item === "object" && typeof item.id === "string" && typeof item.eventId === "string" && typeof item.eventTitle === "string" && typeof item.name === "string" && typeof item.email === "string" && (item.ticketType === "General" || item.ticketType === "VIP") && Number.isInteger(item.quantity) && Number.isFinite(item.total) && typeof item.createdAt === "string"))
      .map((booking) => ({
        ...booking,
        status: booking.status === "cancelled" ? "cancelled" : "confirmed",
        paymentStatus: booking.paymentStatus === "refunded" || booking.paymentStatus === "forfeited" ? booking.paymentStatus : "paid",
      }));
  } catch {
    return sampleBookings;
  }
}

export function formatEventDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", options ?? { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function getEventById(eventId: string, events: EventListing[] = sampleEvents): EventListing | undefined {
  return events.find((event) => event.id === eventId);
}


export function getEventAvailability(event: EventListing): number {
  return Math.max(0, event.capacity - event.sold) + Math.max(0, event.vipCapacity - event.vipSold);
}

export function getLowInventoryEvents(events: EventListing[], today: string): EventListing[] {
  return events.filter((event) => {
    if (event.archived || event.status !== "active" || event.date < today) return false;
    const capacity = event.capacity + event.vipCapacity;
    const remaining = getEventAvailability(event);
    return remaining <= 5 || (capacity > 0 && remaining / capacity <= 0.1);
  });
}

export function getAdminMetrics(events: EventListing[], bookings: Booking[], today: string) {
  const confirmed = bookings.filter((booking) => booking.status === "confirmed");
  const revenue = bookings.filter((booking) => booking.status === "confirmed" || (booking.status === "cancelled" && booking.paymentStatus === "forfeited"));
  return {
    activeEvents: events.filter((event) => !event.archived && event.status === "active" && event.date >= today).length,
    confirmedBookings: confirmed.length,
    ticketsSold: confirmed.reduce((sum, booking) => sum + booking.quantity, 0),
    grossRevenue: revenue.reduce((sum, booking) => sum + booking.total, 0),
  };
}

export function cancelBooking(booking: Booking, bookings: Booking[], events: EventListing[], paymentStatus: "refunded" | "forfeited"): { bookings: Booking[]; events: EventListing[] } | undefined {
  if (booking.status !== "confirmed") return undefined;
  const event = events.find((item) => item.id === booking.eventId);
  if (!event) return undefined;
  const cancelledBooking: Booking = { ...booking, status: "cancelled", paymentStatus };
  const updatedEvents = events.map((item) => {
    if (item.id !== event.id) return item;
    const inventory = booking.ticketType === "VIP"
      ? { ...item, vipSold: Math.max(0, item.vipSold - booking.quantity) }
      : { ...item, sold: Math.max(0, item.sold - booking.quantity) };
    return inventory.status === "sold_out" && getEventAvailability(inventory) > 0
      ? { ...inventory, status: "active" as const }
      : inventory;
  });
  return { bookings: bookings.map((item) => item.id === booking.id ? cancelledBooking : item), events: updatedEvents };
}

export function removeEventOrArchive(eventId: string, events: EventListing[], bookings: Booking[]): EventListing[] {
  const hasBookingHistory = bookings.some((booking) => booking.eventId === eventId);
  return events.flatMap((event) => {
    if (event.id !== eventId) return [event];
    if (hasBookingHistory) return [{ ...event, archived: true }];
    return [];
  });
}
