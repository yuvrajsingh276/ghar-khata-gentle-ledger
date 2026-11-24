import { describe, expect, it } from "vitest";

import { getDaysLeft, isDueSoon, nextCycleDate, starterItems } from "@/lib/gharkhata";

describe("GharKhata reminders and renewal dates", () => {
  it("counts records due within 30 days, but not at 31 days or already expired", () => {
    const now = new Date(2026, 10, 24);
    const sampleItem = starterItems.find((item) => item.id === "kent-ro");
    if (!sampleItem) throw new Error("Starter record is missing");
    expect(getDaysLeft("2026-12-24", now)).toBe(30);
    expect(isDueSoon({ ...sampleItem, dueDate: "2026-12-24" }, now)).toBe(true);
    expect(isDueSoon({ ...sampleItem, dueDate: "2026-12-25" }, now)).toBe(false);
    expect(isDueSoon({ ...sampleItem, dueDate: "2026-11-23" }, now)).toBe(false);
  });

  it("sets the next cycle one month later", () => {
    expect(nextCycleDate("2026-11-30", "month")).toBe("2026-12-30");
  });

  it("sets the next cycle three months later and clamps month-end dates", () => {
    expect(nextCycleDate("2026-11-30", "threeMonths")).toBe("2027-02-28");
  });

  it("sets the next cycle one year later", () => {
    expect(nextCycleDate("2026-11-30", "year")).toBe("2027-11-30");
  });

  it("does not create a next date for a one-time payment", () => {
    expect(nextCycleDate("2026-11-30", "oneTime")).toBeNull();
  });
});