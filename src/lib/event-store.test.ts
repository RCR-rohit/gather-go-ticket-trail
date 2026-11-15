import { describe, expect, it } from "vitest";
import {
  cancelBooking,
  getAdminMetrics,
  getLowInventoryEvents,
  removeEventOrArchive,
  sampleEvents,
  type Booking,
} from "@/lib/event-store";

const event = sampleEvents.find((item) => item.id === "afterglow-festival");
if (!event) throw new Error("Expected the sample festival event to exist.");

const confirmedBooking: Booking = {
  id: "BK-TEST-1",
  eventId: event.id,
  eventTitle: event.title,
  name: "Morgan Lee",
  email: "morgan@example.com",
  ticketType: "General",
  quantity: 2,
  total: 96,
  createdAt: "2026-11-08T12:00:00.000Z",
  status: "confirmed",
  paymentStatus: "paid",
};

describe("event booking rules", () => {
  it("returns cancelled ticket inventory and changes a sold-out event back to active", () => {
    const soldOutEvent = { ...event, sold: event.capacity, status: "sold_out" as const };
    const result = cancelBooking(confirmedBooking, [confirmedBooking], [soldOutEvent], "refunded");

    expect(result?.events[0]?.sold).toBe(event.capacity - confirmedBooking.quantity);
    expect(result?.events[0]?.status).toBe("active");
    expect(result?.bookings[0]?.status).toBe("cancelled");
  });

  it("counts confirmed sales and retained forfeited payments, but excludes refunded cancellations", () => {
    const refunded = { ...confirmedBooking, id: "BK-TEST-2", status: "cancelled" as const, paymentStatus: "refunded" as const };
    const forfeited = { ...confirmedBooking, id: "BK-TEST-3", status: "cancelled" as const, paymentStatus: "forfeited" as const };
    const metrics = getAdminMetrics([event], [confirmedBooking, refunded, forfeited], "2026-11-14");

    expect(metrics.confirmedBookings).toBe(1);
    expect(metrics.ticketsSold).toBe(2);
    expect(metrics.grossRevenue).toBe(192);
  });

  it("archives events with booking history and removes events without history", () => {
    const anotherEvent = { ...event, id: "unbooked-event", title: "Unbooked event" };
    const result = removeEventOrArchive(event.id, [event, anotherEvent], [confirmedBooking]);

    expect(result).toHaveLength(2);
    expect(result.find((item) => item.id === event.id)?.archived).toBe(true);
    expect(removeEventOrArchive(anotherEvent.id, [anotherEvent], [])).toEqual([]);
  });

  it("alerts only active upcoming events at five tickets or ten percent remaining", () => {
    const atFive = { ...event, id: "five-left", capacity: 100, vipCapacity: 0, sold: 95, vipSold: 0 };
    const atTenPercent = { ...event, id: "ten-percent", capacity: 100, vipCapacity: 0, sold: 90, vipSold: 0 };
    const aboveThreshold = { ...event, id: "above-threshold", capacity: 100, vipCapacity: 0, sold: 89, vipSold: 0 };

    expect(getLowInventoryEvents([atFive, atTenPercent, aboveThreshold], "2026-11-14").map((item) => item.id)).toEqual(["five-left", "ten-percent"]);
  });
});