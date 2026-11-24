export type Language = "en" | "hi";
export type Category = "appliance" | "insurance" | "bill";
export type ItemStatus = "safe" | "due" | "expired" | "paid";
export type RenewalCycle = "month" | "threeMonths" | "year" | "oneTime";

export interface ItemNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface HouseholdItem {
  id: string;
  nameEn: string;
  nameHi: string;
  brand: string;
  category: Category;
  typeEn: string;
  typeHi: string;
  purchaseDate: string;
  dueDate: string;
  totalDays: number;
  amount: number;
  coveredValue?: number;
  supportPhone?: string;
  summaryEn: string;
  summaryHi: string;
  receiptDataUrl?: string;
  paid: boolean;
  notes: ItemNote[];
}

export const starterItems: HouseholdItem[] = [
  {
    id: "kent-ro",
    nameEn: "Kent Grand+ RO",
    nameHi: "केंट ग्रैंड+ आरओ",
    brand: "KENT",
    category: "appliance",
    typeEn: "Water purifier warranty",
    typeHi: "वॉटर प्यूरिफ़ायर वारंटी",
    purchaseDate: "2026-04-12",
    dueDate: "2027-04-12",
    totalDays: 365,
    amount: 18500,
    coveredValue: 18500,
    summaryEn: "Annual service and filter coverage are on record.",
    summaryHi: "सालाना सर्विस और फ़िल्टर कवरेज दर्ज है।",
    paid: false,
    notes: [],
  },
  {
    id: "hdfc-car",
    nameEn: "HDFC ERGO Car Insurance",
    nameHi: "एचडीएफ़सी एर्गो कार बीमा",
    brand: "HDFC ERGO",
    category: "insurance",
    typeEn: "Car insurance renewal",
    typeHi: "कार बीमा नवीनीकरण",
    purchaseDate: "2025-12-08",
    dueDate: "2026-12-08",
    totalDays: 365,
    amount: 12400,
    coveredValue: 650000,
    summaryEn: "Renew before the policy ends to keep cover uninterrupted.",
    summaryHi: "बीमा जारी रखने के लिए पॉलिसी समाप्त होने से पहले नवीनीकरण करें।",
    paid: false,
    notes: [],
  },
  {
    id: "jvvnl-electricity",
    nameEn: "JVVNL Electricity Bill",
    nameHi: "जेडीवीवीएनएल बिजली बिल",
    brand: "JVVNL",
    category: "bill",
    typeEn: "Monthly electricity bill",
    typeHi: "मासिक बिजली बिल",
    purchaseDate: "2026-11-01",
    dueDate: "2026-11-30",
    totalDays: 30,
    amount: 2340,
    summaryEn: "November electricity bill is ready for payment.",
    summaryHi: "नवंबर का बिजली बिल भुगतान के लिए तैयार है।",
    paid: false,
    notes: [],
  },
  {
    id: "lg-washer",
    nameEn: "LG Washing Machine",
    nameHi: "एलजी वॉशिंग मशीन",
    brand: "LG",
    category: "appliance",
    typeEn: "Washing machine warranty",
    typeHi: "वॉशिंग मशीन वारंटी",
    purchaseDate: "2025-03-12",
    dueDate: "2027-03-12",
    totalDays: 730,
    amount: 31990,
    coveredValue: 31990,
    summaryEn: "Motor and parts warranty are listed in this record.",
    summaryHi: "इस रिकॉर्ड में मोटर और पार्ट्स की वारंटी दर्ज है।",
    paid: false,
    notes: [],
  },
];

export function getDaysLeft(date: string, now = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(`${date}T00:00:00`);
  return Math.round((dueDate.getTime() - today.getTime()) / 86_400_000);
}

export function getItemStatus(item: HouseholdItem, now = new Date()): ItemStatus {
  if (item.paid) return "paid";
  const daysLeft = getDaysLeft(item.dueDate, now);
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "due";
  return "safe";
}

export function isDueSoon(item: HouseholdItem, now = new Date()): boolean {
  return !item.paid && getDaysLeft(item.dueDate, now) >= 0 && getDaysLeft(item.dueDate, now) <= 30;
}

export function getProtectedValue(items: HouseholdItem[], now = new Date()): number {
  return items.reduce((total, item) => {
    if (item.category === "bill" || getItemStatus(item, now) === "expired") return total;
    return total + (item.coveredValue ?? item.amount);
  }, 0);
}

export function formatCurrency(amount: number, language: Language): string {
  return new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string, language: Language): string {
  const localDate = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(localDate);
}

export function nextCycleDate(date: string, cycle: RenewalCycle): string | null {
  if (cycle === "oneTime") return null;
  const months = cycle === "month" ? 1 : cycle === "threeMonths" ? 3 : 12;
  const [yearText, monthText, dayText] = date.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  const day = Number(dayText);
  const targetMonthIndex = month + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = targetMonthIndex % 12;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

export function answerHouseholdQuestion(
  question: string,
  items: HouseholdItem[],
  language: Language,
  now = new Date(),
): string {
  const query = question.toLocaleLowerCase();
  const wantsPhone = /phone|helpline|service|support|number|नंबर|हेल्पलाइन|सर्विस|सहायता/.test(query);
  if (wantsPhone) {
    const item = items.find((record) => `${record.nameEn} ${record.brand}`.toLocaleLowerCase().includes("lg"));
    if (item?.supportPhone) return language === "hi" ? `${item.brand} सेवा नंबर: ${item.supportPhone}` : `${item.brand} service number: ${item.supportPhone}`;
    return language === "hi"
      ? "इस रिकॉर्ड में अभी सेवा नंबर नहीं जोड़ा गया है।"
      : "A service phone number has not been added to this record yet.";
  }

  const upcoming = items.filter((item) => isDueSoon(item, now)).sort((a, b) => getDaysLeft(a.dueDate, now) - getDaysLeft(b.dueDate, now));
  if (upcoming.length > 0) {
    const names = upcoming.map((item) => language === "hi" ? item.nameHi : item.nameEn).join(language === "hi" ? " और " : " and ");
    return language === "hi"
      ? `${upcoming.length} रिकॉर्ड पर अगले 30 दिनों में ध्यान दें: ${names}।`
      : `${upcoming.length} records need attention within 30 days: ${names}.`;
  }
  return language === "hi"
    ? "अभी अगले 30 दिनों में कोई बिल या नवीनीकरण नहीं है।"
    : "Nothing is due or expiring in the next 30 days.";
}