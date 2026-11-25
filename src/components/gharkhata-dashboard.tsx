import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Car,
  Check,
  CircleAlert,
  CircleCheck,
  Clock3,
  Droplet,
  FileText,
  Home,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  ScanLine,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Volume2,
  Waves,
  ZoomIn,
  ZoomOut,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  answerHouseholdQuestion,
  formatCurrency,
  formatDate,
  getDaysLeft,
  getItemStatus,
  getProtectedValue,
  isDueSoon,
  nextCycleDate,
  starterItems,
  type Category,
  type HouseholdItem,
  type ItemStatus,
  type Language,
  type RenewalCycle,
} from "@/lib/gharkhata";

const copy = {
  en: {
    brandLine: "A little more peace of mind at home",
    homeRecords: "Home records",
    household: "Everything important, in one place.",
    dateLine: "Your household at a glance",
    scan: "Scan new bill",
    dueSoon: "Due / expiring soon",
    attentionWithin: "Needs attention within 30 days",
    protected: "Protected items",
    coveredValue: "Value protected",
    askTitle: "Ask GharKhata",
    askPlaceholder: "Ask about a bill, renewal, or service number…",
    askButton: "Ask",
    all: "All records",
    appliances: "Appliances",
    insurance: "Insurance & vehicle",
    bills: "Bills & fees",
    yourRecords: "Your records",
    recordCount: "records",
    safe: "Covered",
    due: "Due soon",
    expired: "Expired",
    paid: "Paid",
    expiresIn: "Expires in",
    dueIn: "Due in",
    days: "days",
    day: "day",
    overdueBy: "Overdue by",
    noRecords: "No records in this category yet.",
    addFirst: "Add a record",
    callService: "Call service",
    viewBill: "View bill",
    markPaid: "Mark as paid",
    listen: "Listen status",
    stopListening: "Stop listening",
    nextAction: "Next action",
    detailStatus: "Record status",
    receipt: "Receipt image",
    receiptMissing: "No bill photo has been added yet.",
    family: "Send to family on WhatsApp",
    notes: "Service / payment notes",
    notesPlaceholder: "Add a short note…",
    saveNote: "Save note",
    noNotes: "No notes yet.",
    servicePhone: "Service phone number",
    phonePlaceholder: "Add the service number",
    savePhone: "Save number",
    paymentTitle: "Mark this cycle as paid",
    paymentPrompt: "Set the next cycle, or mark it as a one-time payment.",
    plusMonth: "+1 month",
    plusThreeMonths: "+3 months",
    plusYear: "+1 year",
    oneTime: "One-time",
    scanTitle: "Add a household record",
    scanDescription: "Choose a bill photo, then enter the key details.",
    choosePhoto: "Choose bill photo",
    photoReady: "Photo ready",
    photoHint: "JPG or PNG · compressed to WebP, under 250 KB",
    name: "Item or bill name",
    namePlaceholder: "For example, water purifier warranty",
    nameHindi: "Name in Hindi (optional)",
    type: "Record type",
    purchaseDate: "Purchase / start date",
    dueDate: "Due / expiry date",
    amount: "Amount (₹)",
    saveRecord: "Save record",
    recordAdded: "Record added to this browser.",
    noteSaved: "Note saved.",
    phoneSaved: "Service number saved.",
    paymentSaved: "Payment cycle updated.",
    invalidPhoto: "Choose a JPG or PNG image.",
    photoError: "This photo could not be prepared. Try another image.",
    requiredName: "Enter a name and a due or expiry date.",
    noPhone: "Add a service number to call from this record.",
    language: "हिंदी में देखें",
    reminderWord: "Reminder",
    coverageWord: "Coverage",
    currentValue: "Record amount",
    recordsTitle: "Your household records",
    intro: "Warranties, renewals, bills, and important dates—ready when you need them.",
    reviewDetails: "View details",
    send: "Share",
    searchRecords: "Find a record",
    storageNote: "Saved privately in this browser",
    noAnswer: "I couldn’t find a matching detail in these records.",
  },
  hi: {
    brandLine: "घर में थोड़ी और निश्चिंतता",
    homeRecords: "घर के रिकॉर्ड",
    household: "घर की ज़रूरी बातें, एक जगह।",
    dateLine: "आपके घर का छोटा-सा हाल",
    scan: "नया बिल जोड़ें",
    dueSoon: "जल्द ध्यान दें",
    attentionWithin: "अगले 30 दिनों में ज़रूरी",
    protected: "सुरक्षित रिकॉर्ड",
    coveredValue: "कवरेज की कुल कीमत",
    askTitle: "घरखाता से पूछें",
    askPlaceholder: "बिल, नवीनीकरण या सेवा नंबर पूछें…",
    askButton: "पूछें",
    all: "सभी रिकॉर्ड",
    appliances: "मशीनें",
    insurance: "बीमा और गाड़ी",
    bills: "बिल और फीस",
    yourRecords: "आपके रिकॉर्ड",
    recordCount: "रिकॉर्ड",
    safe: "सुरक्षित",
    due: "जल्द ध्यान दें",
    expired: "समाप्त",
    paid: "जमा हो गया",
    expiresIn: "समाप्ति में",
    dueIn: "जमा करने में",
    days: "दिन",
    day: "दिन",
    overdueBy: "इतने दिन पहले बाकी",
    noRecords: "इस श्रेणी में अभी कोई रिकॉर्ड नहीं है।",
    addFirst: "रिकॉर्ड जोड़ें",
    callService: "सेवा पर कॉल करें",
    viewBill: "बिल देखें",
    markPaid: "जमा हो गया",
    listen: "स्थिति सुनें",
    stopListening: "सुनना बंद करें",
    nextAction: "अगला काम",
    detailStatus: "रिकॉर्ड की स्थिति",
    receipt: "बिल की तस्वीर",
    receiptMissing: "अभी बिल की तस्वीर नहीं जोड़ी गई है।",
    family: "WhatsApp पर परिवार को भेजें",
    notes: "सेवा / भुगतान के नोट",
    notesPlaceholder: "छोटा-सा नोट लिखें…",
    saveNote: "नोट सहेजें",
    noNotes: "अभी कोई नोट नहीं है।",
    servicePhone: "सेवा का फ़ोन नंबर",
    phonePlaceholder: "सेवा नंबर जोड़ें",
    savePhone: "नंबर सहेजें",
    paymentTitle: "इस बार का भुगतान दर्ज करें",
    paymentPrompt: "अगली तारीख चुनें या एक बार का भुगतान चुनें।",
    plusMonth: "+1 महीना",
    plusThreeMonths: "+3 महीने",
    plusYear: "+1 साल",
    oneTime: "एक बार",
    scanTitle: "घर का रिकॉर्ड जोड़ें",
    scanDescription: "बिल की तस्वीर चुनें और ज़रूरी जानकारी भरें।",
    choosePhoto: "बिल की तस्वीर चुनें",
    photoReady: "तस्वीर तैयार है",
    photoHint: "JPG या PNG · WebP में संपीड़ित, 250 KB से कम",
    name: "सामान या बिल का नाम",
    namePlaceholder: "जैसे, वॉटर प्यूरिफ़ायर वारंटी",
    nameHindi: "हिंदी में नाम (वैकल्पिक)",
    type: "रिकॉर्ड का प्रकार",
    purchaseDate: "खरीद / शुरू होने की तारीख",
    dueDate: "जमा / समाप्ति की तारीख",
    amount: "राशि (₹)",
    saveRecord: "रिकॉर्ड सहेजें",
    recordAdded: "रिकॉर्ड इस ब्राउज़र में जोड़ दिया गया।",
    noteSaved: "नोट सहेज दिया गया।",
    phoneSaved: "सेवा नंबर सहेज दिया गया।",
    paymentSaved: "अगली तारीख बदल दी गई।",
    invalidPhoto: "JPG या PNG तस्वीर चुनें।",
    photoError: "तस्वीर तैयार नहीं हो पाई। दूसरी तस्वीर आज़माएँ।",
    requiredName: "नाम और जमा या समाप्ति की तारीख लिखें।",
    noPhone: "इस रिकॉर्ड से कॉल करने के लिए सेवा नंबर जोड़ें।",
    language: "English",
    reminderWord: "रिमाइंडर",
    coverageWord: "कवरेज",
    currentValue: "रिकॉर्ड की राशि",
    recordsTitle: "आपके घर के रिकॉर्ड",
    intro: "वारंटी, नवीनीकरण, बिल और ज़रूरी तारीखें—जब चाहिए, तब तैयार।",
    reviewDetails: "विवरण देखें",
    send: "भेजें",
    searchRecords: "रिकॉर्ड ढूँढें",
    storageNote: "इस ब्राउज़र में निजी रूप से सहेजा गया",
    noAnswer: "इन रिकॉर्ड में इससे जुड़ी जानकारी नहीं मिली।",
  },
} satisfies Record<Language, Record<string, string>>;

const categoryValues: Array<{ value: "all" | Category; labelKey: keyof typeof copy.en }> = [
  { value: "all", labelKey: "all" },
  { value: "appliance", labelKey: "appliances" },
  { value: "insurance", labelKey: "insurance" },
  { value: "bill", labelKey: "bills" },
];

const cycleChoices: Array<{ value: RenewalCycle; labelKey: keyof typeof copy.en }> = [
  { value: "month", labelKey: "plusMonth" },
  { value: "threeMonths", labelKey: "plusThreeMonths" },
  { value: "year", labelKey: "plusYear" },
  { value: "oneTime", labelKey: "oneTime" },
];

function isHouseholdItem(value: unknown): value is HouseholdItem {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<HouseholdItem>;
  return (
    typeof record.id === "string" &&
    typeof record.nameEn === "string" &&
    typeof record.nameHi === "string" &&
    typeof record.dueDate === "string" &&
    typeof record.amount === "number" &&
    typeof record.paid === "boolean" &&
    Array.isArray(record.notes) &&
    (record.category === "appliance" || record.category === "insurance" || record.category === "bill")
  );
}

function itemName(item: HouseholdItem, language: Language): string {
  return language === "hi" && item.nameHi ? item.nameHi : item.nameEn;
}

function categoryIcon(item: HouseholdItem) {
  if (item.category === "insurance") return Car;
  if (item.category === "bill") return Zap;
  return item.brand.toLowerCase().includes("kent") ? Droplet : Waves;
}

function statusClass(status: ItemStatus): string {
  if (status === "due") return "bg-due-soft text-due";
  if (status === "expired") return "bg-expired-soft text-expired";
  return "bg-safe-soft text-safe";
}

function statusLabel(status: ItemStatus, language: Language): string {
  return copy[language][status];
}

function spokenStatus(item: HouseholdItem, language: Language, now: Date): string {
  const t = copy[language];
  const status = getItemStatus(item, now);
  const daysLeft = getDaysLeft(item.dueDate, now);
  const dateLine = daysLeft < 0
    ? `${t.overdueBy} ${Math.abs(daysLeft)} ${t.days}`
    : `${item.category === "appliance" ? t.expiresIn : t.dueIn} ${daysLeft} ${daysLeft === 1 ? t.day : t.days}`;
  const nextAction = status === "due"
    ? item.category === "bill" ? t.markPaid : t.nextAction
    : status === "expired" ? t.reviewDetails : t.listen;
  return `${itemName(item, language)}. ${statusLabel(status, language)}. ${dateLine}. ${t.nextAction}: ${nextAction}.`;
}

async function compressReceipt(file: File): Promise<{ dataUrl: string; bytes: number }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    let width = Math.min(image.naturalWidth, 1400);
    let height = Math.round((image.naturalHeight / image.naturalWidth) * width);
    let quality = 0.82;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");

    while (width >= 320) {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Image compression failed"));
        }, "image/webp", quality);
      });
      if (blob.type !== "image/webp") throw new Error("WebP is unavailable in this browser");
      if (blob.size <= 250 * 1024) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Image could not be read"));
          reader.onerror = () => reject(reader.error ?? new Error("Image could not be read"));
          reader.readAsDataURL(blob);
        });
        return { dataUrl, bytes: blob.size };
      }
      if (quality > 0.42) quality = Math.max(0.38, quality - 0.12);
      else {
        width = Math.floor(width * 0.84);
        height = Math.round((image.naturalHeight / image.naturalWidth) * width);
        quality = 0.7;
      }
    }
    throw new Error("Image is too large to compress safely");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function formatBytes(bytes: number, language: Language): string {
  const amount = Math.max(1, Math.round(bytes / 1024));
  return `${amount} KB`;
}

function todayISO(): string {
  const today = new Date();
  const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function GharKhataDashboard() {
  const [language, setLanguage] = useState<Language>("en");
  const [items, setItems] = useState<HouseholdItem[]>(starterItems);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<HouseholdItem | null>(null);
  const [paymentItem, setPaymentItem] = useState<HouseholdItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [servicePhone, setServicePhone] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [scanName, setScanName] = useState("");
  const [scanNameHi, setScanNameHi] = useState("");
  const [scanCategory, setScanCategory] = useState<Category>("bill");
  const [scanDueDate, setScanDueDate] = useState("");
  const [scanPurchaseDate, setScanPurchaseDate] = useState("");
  const [scanAmount, setScanAmount] = useState("");
  const [scanPhone, setScanPhone] = useState("");
  const [receiptDataUrl, setReceiptDataUrl] = useState("");
  const [receiptSize, setReceiptSize] = useState<number | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [scanBusy, setScanBusy] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = copy[language];
  const now = new Date();

  useEffect(() => {
    try {
      const savedItems = window.localStorage.getItem("gharkhata:items");
      const parsed: unknown = savedItems ? JSON.parse(savedItems) : null;
      if (Array.isArray(parsed) && parsed.every(isHouseholdItem)) setItems(parsed);
      const savedLanguage = window.localStorage.getItem("gharkhata:language");
      if (savedLanguage === "en" || savedLanguage === "hi") setLanguage(savedLanguage);
    } catch {
      setItems(starterItems);
    }
    setItemsLoaded(true);
  }, []);

  useEffect(() => {
    if (itemsLoaded) window.localStorage.setItem("gharkhata:items", JSON.stringify(items));
  }, [items, itemsLoaded]);

  useEffect(() => {
    window.localStorage.setItem("gharkhata:language", language);
    document.documentElement.lang = language;
  }, [language]);

  const dueCount = useMemo(() => items.filter((item) => isDueSoon(item, now)).length, [items, now]);
  const protectedItems = useMemo(
    () => items.filter((item) => item.category !== "bill" && getItemStatus(item, now) !== "expired"),
    [items, now],
  );
  const protectedValue = useMemo(() => getProtectedValue(items, now), [items, now]);
  const visibleItems = useMemo(() => {
    const byCategory = filter === "all" ? items : items.filter((item) => item.category === filter);
    const query = searchText.trim().toLocaleLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((item) => `${item.nameEn} ${item.nameHi} ${item.brand} ${item.typeEn}`.toLocaleLowerCase().includes(query));
  }, [filter, items, searchText]);

  function updateItem(itemId: string, updater: (item: HouseholdItem) => HouseholdItem) {
    setItems((current) => current.map((item) => item.id === itemId ? updater(item) : item));
    setDetailItem((current) => current?.id === itemId ? updater(current) : current);
  }

  function toggleLanguage() {
    setLanguage((current) => current === "en" ? "hi" : "en");
  }

  function speak(item: HouseholdItem) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setAnnouncement(language === "hi" ? "इस ब्राउज़र में आवाज़ उपलब्ध नहीं है।" : "Read-aloud is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenStatus(item, language, new Date()));
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  }

  function openDetails(item: HouseholdItem) {
    setNoteText("");
    setServicePhone(item.supportPhone ?? "");
    setZoomed(false);
    setDetailItem(item);
  }

  function askQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setAnswer(answerHouseholdQuestion(question, items, language, new Date()));
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detailItem || !noteText.trim()) return;
    const note = { id: crypto.randomUUID(), text: noteText.trim(), createdAt: new Date().toISOString() };
    updateItem(detailItem.id, (item) => ({ ...item, notes: [note, ...item.notes] }));
    setNoteText("");
    setAnnouncement(t.noteSaved);
  }

  function saveServicePhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detailItem) return;
    const normalized = servicePhone.replace(/[^\d+]/g, "");
    if (normalized.replace(/\D/g, "").length < 7) {
      setAnnouncement(t.noPhone);
      return;
    }
    updateItem(detailItem.id, (item) => ({ ...item, supportPhone: normalized }));
    setAnnouncement(t.phoneSaved);
  }

  function applyRenewal(cycle: RenewalCycle) {
    if (!paymentItem) return;
    const today = todayISO();
    const cycleBase = paymentItem.dueDate < today ? today : paymentItem.dueDate;
    const nextDate = nextCycleDate(cycleBase, cycle);
    const logText = nextDate
      ? `${t.paid} · ${formatDate(today, language)} · ${formatDate(nextDate, language)}`
      : `${t.paid} · ${formatDate(today, language)}`;
    const note = { id: crypto.randomUUID(), text: logText, createdAt: new Date().toISOString() };
    updateItem(paymentItem.id, (item) => ({
      ...item,
      dueDate: nextDate ?? item.dueDate,
      paid: nextDate === null,
      notes: [note, ...item.notes],
    }));
    setPaymentItem(null);
    setDetailItem(null);
    setAnnouncement(t.paymentSaved);
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setPhotoError(t.invalidPhoto);
      return;
    }
    setPhotoError("");
    setScanBusy(true);
    try {
      const result = await compressReceipt(file);
      setReceiptDataUrl(result.dataUrl);
      setReceiptSize(result.bytes);
      if (!scanName) setScanName(file.name.replace(/\.[^.]+$/, ""));
    } catch {
      setPhotoError(t.photoError);
    } finally {
      setScanBusy(false);
    }
  }

  function resetScan() {
    setScanName("");
    setScanNameHi("");
    setScanCategory("bill");
    setScanDueDate("");
    setScanPurchaseDate("");
    setScanAmount("");
    setScanPhone("");
    setReceiptDataUrl("");
    setReceiptSize(null);
    setPhotoError("");
  }

  function saveScannedRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!scanName.trim() || !scanDueDate) {
      setPhotoError(t.requiredName);
      return;
    }
    const displayName = scanName.trim();
    const newItem: HouseholdItem = {
      id: crypto.randomUUID(),
      nameEn: displayName,
      nameHi: scanNameHi.trim() || displayName,
      brand: displayName.split(" ")[0] ?? displayName,
      category: scanCategory,
      typeEn: scanCategory === "appliance" ? "Warranty" : scanCategory === "insurance" ? "Insurance renewal" : "Bill or fee",
      typeHi: scanCategory === "appliance" ? "वारंटी" : scanCategory === "insurance" ? "बीमा नवीनीकरण" : "बिल या फीस",
      purchaseDate: scanPurchaseDate || todayISO(),
      dueDate: scanDueDate,
      totalDays: Math.max(1, getDaysLeft(scanDueDate, new Date())),
      amount: Number(scanAmount) || 0,
      ...(scanPhone.trim() ? { supportPhone: scanPhone.trim() } : {}),
      summaryEn: "New household record added.",
      summaryHi: "घर का नया रिकॉर्ड जोड़ा गया।",
      ...(receiptDataUrl ? { receiptDataUrl } : {}),
      paid: false,
      notes: [],
    };
    setItems((current) => [newItem, ...current]);
    setScanOpen(false);
    resetScan();
    setAnnouncement(t.recordAdded);
  }

  const categoryTabs = categoryValues.map(({ value, labelKey }) => ({
    value,
    label: t[labelKey],
    count: value === "all" ? items.length : items.filter((item) => item.category === value).length,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Home aria-hidden="true" className="size-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-extrabold">GharKhata <span className="font-devanagari">घरखाता</span></p>
              <p className="hidden text-base text-muted-foreground sm:block">{t.brandLine}</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="lg" onClick={toggleLanguage} className="h-12 shrink-0 text-base">
            <span className="font-devanagari">{t.language}</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-base font-semibold text-primary">
              <Home aria-hidden="true" className="size-5" /> {t.homeRecords}
            </p>
            <h1 className={`max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl ${language === "hi" ? "font-devanagari" : ""}`}>
              {t.household}
            </h1>
            <p className={`mt-2 text-lg text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>{t.dateLine}</p>
          </div>
          <p className="flex items-center gap-2 text-base text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-5" />
            {formatDate(todayISO(), language)}
          </p>
        </div>

        <section aria-label={t.dateLine} className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary bg-primary text-primary-foreground shadow-none">
            <CardContent className="flex h-full min-h-40 flex-col items-start justify-between gap-5 p-5">
              <div>
                <p className="text-base font-medium opacity-90">{language === "en" ? "Keep a new record" : "नया रिकॉर्ड जोड़ें"}</p>
                <p className={`mt-1 text-2xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{t.scan}</p>
              </div>
              <Button type="button" onClick={() => setScanOpen(true)} variant="secondary" size="lg" className="h-12 w-full justify-between text-base">
                <span className="flex items-center gap-2"><ScanLine aria-hidden="true" className="size-5" />{t.scan}</span>
                <ArrowUpRight aria-hidden="true" className="size-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-due-soft shadow-none">
            <CardContent className="flex min-h-40 items-center justify-between gap-4 p-5">
              <div>
                <p className={`max-w-52 text-lg font-semibold text-due ${language === "hi" ? "font-devanagari" : ""}`}>{t.dueSoon}</p>
                <p className={`mt-1 text-base text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>{t.attentionWithin}</p>
              </div>
              <p className="text-5xl font-extrabold leading-none text-due" aria-label={`${dueCount} ${t.dueSoon}`}>{dueCount}</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-none">
            <CardContent className="flex min-h-40 items-center justify-between gap-4 p-5">
              <div>
                <p className={`text-lg font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>{t.protected}</p>
                <p className="mt-1 text-base text-muted-foreground">{protectedItems.length} {t.recordCount}</p>
                <p className="mt-2 text-base font-semibold text-safe">{t.coveredValue}</p>
              </div>
              <div className="text-right">
                <div className="ml-auto flex size-12 items-center justify-center rounded-md bg-safe-soft text-safe">
                  <ShieldCheck aria-hidden="true" className="size-6" />
                </div>
                <p className="mt-3 whitespace-nowrap text-2xl font-extrabold">{formatCurrency(protectedValue, language)}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-7 border-y border-border py-6" aria-labelledby="ask-title">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <h2 id="ask-title" className={`text-xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{t.askTitle}</h2>
          </div>
          <form onSubmit={askQuestion} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={t.askPlaceholder}
                aria-label={t.askPlaceholder}
                className={`h-14 pl-12 text-base ${language === "hi" ? "font-devanagari" : ""}`}
              />
            </div>
            <Button type="submit" size="lg" className="h-14 min-w-28 text-base">
              <Search aria-hidden="true" className="size-5" /> {t.askButton}
            </Button>
          </form>
          {answer && <p aria-live="polite" className={`mt-3 border-l-4 border-primary pl-4 text-lg ${language === "hi" ? "font-devanagari" : ""}`}>{answer}</p>}
        </section>

        <section className="pt-7" aria-labelledby="records-title">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="records-title" className={`text-2xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{t.recordsTitle}</h2>
              <p className={`mt-1 text-base text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>{t.intro}</p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={t.searchRecords}
                aria-label={t.searchRecords}
                className="h-12 pl-12 text-base"
              />
            </div>
          </div>

          <Tabs value={filter} onValueChange={(value) => {
            if (value === "all" || value === "appliance" || value === "insurance" || value === "bill") setFilter(value);
          }}>
            <TabsList className="mb-5 h-auto w-full justify-start gap-1 overflow-x-auto rounded-md bg-transparent p-0">
              {categoryTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className={`min-h-12 shrink-0 gap-2 rounded-md border border-transparent px-4 text-base data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-none ${language === "hi" ? "font-devanagari" : ""}`}>
                  {tab.label}<span className="rounded-full bg-muted px-2 py-0.5 text-base text-muted-foreground">{tab.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {visibleItems.length === 0 ? (
            <div className="border-y border-border py-12 text-center">
              <p className={`text-lg text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>{t.noRecords}</p>
              <Button type="button" variant="outline" size="lg" onClick={() => setScanOpen(true)} className="mt-4 h-12 text-base">
                <Plus aria-hidden="true" className="size-5" /> {t.addFirst}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleItems.map((item) => {
                const Icon = categoryIcon(item);
                const status = getItemStatus(item, now);
                const daysLeft = getDaysLeft(item.dueDate, now);
                const progress = Math.max(0, Math.min(100, ((item.totalDays - daysLeft) / Math.max(1, item.totalDays)) * 100));
                const dateLead = daysLeft < 0 ? t.overdueBy : item.category === "appliance" ? t.expiresIn : t.dueIn;
                const dateAmount = daysLeft < 0 ? Math.abs(daysLeft) : daysLeft;
                return (
                  <Card key={item.id} className="overflow-hidden border-border bg-card shadow-none transition-colors hover:border-primary/40">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className={`flex size-12 shrink-0 items-center justify-center rounded-md ${statusClass(status)}`}>
                            <Icon aria-hidden="true" className="size-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-muted-foreground">{item.brand} · {language === "hi" ? item.typeHi : item.typeEn}</p>
                            <CardTitle className={`mt-1 break-words text-xl font-bold leading-snug ${language === "hi" ? "font-devanagari" : ""}`}>
                              {itemName(item, language)}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge className={`shrink-0 border-transparent px-3 py-1 text-base font-semibold ${statusClass(status)}`}>
                          {statusLabel(status, language)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className={`text-base leading-relaxed text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                        {language === "hi" ? item.summaryHi : item.summaryEn}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-base">
                          <span className="flex items-center gap-2 text-muted-foreground"><Clock3 aria-hidden="true" className="size-5" />{dateLead} {dateAmount} {dateAmount === 1 ? t.day : t.days}</span>
                          <span className="font-semibold">{formatDate(item.dueDate, language)}</span>
                        </div>
                        <Progress value={progress} aria-label={`${statusLabel(status, language)} ${progress.toFixed(0)}%`} className="h-2 bg-muted [&>div]:bg-primary" />
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-base text-muted-foreground">{item.category === "insurance" ? t.coverageWord : t.currentValue}</span>
                        <span className="text-xl font-bold">{formatCurrency(item.category === "insurance" ? item.amount : item.amount, language)}</span>
                      </div>
                      <div className="mt-auto grid grid-cols-2 gap-3 pt-1">
                        {item.category === "appliance" ? (
                          <Button type="button" variant="outline" size="lg" onClick={() => openDetails(item)} className="h-12 min-w-0 text-base">
                            <Phone aria-hidden="true" className="size-5" /> <span className="truncate">{t.callService}</span>
                          </Button>
                        ) : (
                          <Button type="button" variant="outline" size="lg" onClick={() => { setPaymentItem(item); setDetailItem(null); }} className="h-12 min-w-0 text-base">
                            <CircleCheck aria-hidden="true" className="size-5" /> <span className="truncate">{t.markPaid}</span>
                          </Button>
                        )}
                        <Button type="button" variant="secondary" size="lg" onClick={() => openDetails(item)} className="h-12 min-w-0 text-base">
                          <FileText aria-hidden="true" className="size-5" /> <span className="truncate">{t.viewBill}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-8 flex items-center justify-center gap-2 text-base text-muted-foreground">
          <Shield aria-hidden="true" className="size-5 text-safe" /> {t.storageNote}
        </p>
      </main>

      <p className="sr-only" aria-live="polite">{announcement}</p>

      <Dialog open={scanOpen} onOpenChange={(open) => { setScanOpen(open); if (!open) resetScan(); }}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto [&>button:last-child]:flex [&>button:last-child]:h-12 [&>button:last-child]:w-12 [&>button:last-child]:items-center [&>button:last-child]:justify-center">
          <DialogHeader className="pr-12 text-left">
            <DialogTitle className={`text-2xl ${language === "hi" ? "font-devanagari" : ""}`}>{t.scanTitle}</DialogTitle>
            <DialogDescription className={`text-base ${language === "hi" ? "font-devanagari" : ""}`}>{t.scanDescription}</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveScannedRecord} className="space-y-5">
            <div className="rounded-md border border-dashed border-border bg-muted/40 p-4">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className="sr-only" aria-label={t.choosePhoto} />
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-md bg-card text-primary"><ScanLine aria-hidden="true" className="size-6" /></div>
                  <div>
                    <p className={`text-base font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>{receiptDataUrl ? t.photoReady : t.receipt}</p>
                    <p className="text-base text-muted-foreground">{receiptSize ? `${formatBytes(receiptSize, language)} · WebP` : t.photoHint}</p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="lg" onClick={() => fileInputRef.current?.click()} disabled={scanBusy} className="h-12 text-base">
                  <Plus aria-hidden="true" className="size-5" /> {scanBusy ? (language === "hi" ? "तैयार हो रहा है…" : "Preparing…") : t.choosePhoto}
                </Button>
              </div>
              {receiptDataUrl && <img src={receiptDataUrl} alt={t.receipt} className="mt-4 max-h-60 w-full rounded-md border border-border bg-card object-contain" />}
              {photoError && <p role="alert" className="mt-3 text-base text-expired">{photoError}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-base font-semibold sm:col-span-2">
                {t.name}
                <Input value={scanName} onChange={(event) => setScanName(event.target.value)} placeholder={t.namePlaceholder} className="h-12 text-base font-normal" />
              </label>
              <label className={`space-y-2 text-base font-semibold sm:col-span-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                {t.nameHindi}
                <Input value={scanNameHi} onChange={(event) => setScanNameHi(event.target.value)} placeholder="" className="h-12 text-base font-normal" />
              </label>
              <fieldset className="space-y-2 sm:col-span-2">
                <legend className="mb-2 text-base font-semibold">{t.type}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {(["appliance", "insurance", "bill"] as const).map((category) => {
                    const label = category === "appliance" ? t.appliances : category === "insurance" ? t.insurance : t.bills;
                    return (
                      <Button key={category} type="button" variant={scanCategory === category ? "default" : "outline"} onClick={() => setScanCategory(category)} className="h-12 px-2 text-base">
                        <span className="truncate">{label}</span>
                      </Button>
                    );
                  })}
                </div>
              </fieldset>
              <label className="space-y-2 text-base font-semibold">
                {t.purchaseDate}
                <Input type="date" value={scanPurchaseDate} onChange={(event) => setScanPurchaseDate(event.target.value)} className="h-12 text-base font-normal" />
              </label>
              <label className="space-y-2 text-base font-semibold">
                {t.dueDate}
                <Input required type="date" value={scanDueDate} onChange={(event) => setScanDueDate(event.target.value)} className="h-12 text-base font-normal" />
              </label>
              <label className="space-y-2 text-base font-semibold">
                {t.amount}
                <Input type="number" min="0" step="1" value={scanAmount} onChange={(event) => setScanAmount(event.target.value)} className="h-12 text-base font-normal" />
              </label>
              <label className="space-y-2 text-base font-semibold">
                {t.servicePhone}
                <Input type="tel" value={scanPhone} onChange={(event) => setScanPhone(event.target.value)} placeholder={t.phonePlaceholder} className="h-12 text-base font-normal" />
              </label>
            </div>
            <Button type="submit" size="lg" disabled={scanBusy} className="h-14 w-full text-lg font-bold">
              <Check aria-hidden="true" className="size-5" /> {t.saveRecord}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailItem !== null} onOpenChange={(open) => { if (!open) setDetailItem(null); }}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto [&>button:last-child]:flex [&>button:last-child]:h-12 [&>button:last-child]:w-12 [&>button:last-child]:items-center [&>button:last-child]:justify-center">
          {detailItem && (() => {
            const status = getItemStatus(detailItem, new Date());
            const daysLeft = getDaysLeft(detailItem.dueDate, new Date());
            const shareText = `${itemName(detailItem, language)} · ${statusLabel(status, language)} · ${formatDate(detailItem.dueDate, language)} · ${formatCurrency(detailItem.amount, language)}`;
            const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            return (
              <div className="space-y-5">
                <DialogHeader className="pr-12 text-left">
                  <p className="text-base font-semibold text-muted-foreground">{detailItem.brand} · {language === "hi" ? detailItem.typeHi : detailItem.typeEn}</p>
                  <DialogTitle className={`text-2xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{itemName(detailItem, language)}</DialogTitle>
                  <DialogDescription className="text-base">{language === "hi" ? detailItem.summaryHi : detailItem.summaryEn}</DialogDescription>
                </DialogHeader>
                <div className={`flex flex-col gap-3 rounded-md p-4 sm:flex-row sm:items-center sm:justify-between ${statusClass(status)}`}>
                  <div>
                    <p className="text-base font-semibold">{t.detailStatus}</p>
                    <p className={`mt-1 text-xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{statusLabel(status, language)} · {daysLeft < 0 ? `${t.overdueBy} ${Math.abs(daysLeft)} ${t.days}` : `${daysLeft} ${t.days}`}</p>
                    <p className="mt-1 text-base">{formatDate(detailItem.dueDate, language)}</p>
                  </div>
                  <Button type="button" variant="outline" size="lg" onClick={() => speak(detailItem)} className="h-12 shrink-0 text-base">
                    <Volume2 aria-hidden="true" className="size-5" /> {t.listen}
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {detailItem.category === "appliance" && detailItem.supportPhone ? (
                    <Button asChild size="lg" className="h-12 text-base">
                      <a href={`tel:${detailItem.supportPhone}`}><Phone aria-hidden="true" className="size-5" /> {t.callService}</a>
                    </Button>
                  ) : detailItem.category === "appliance" ? (
                    <form onSubmit={saveServicePhone} className="flex gap-2 sm:col-span-2">
                      <Input type="tel" value={servicePhone} onChange={(event) => setServicePhone(event.target.value)} placeholder={t.phonePlaceholder} aria-label={t.servicePhone} className="h-12 text-base" />
                      <Button type="submit" variant="outline" size="lg" className="h-12 shrink-0 text-base"><Phone aria-hidden="true" className="size-5" />{t.savePhone}</Button>
                    </form>
                  ) : (
                    <Button type="button" onClick={() => { setPaymentItem(detailItem); setDetailItem(null); }} size="lg" className="h-12 text-base">
                      <CircleCheck aria-hidden="true" className="size-5" /> {t.markPaid}
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg" className="h-12 text-base">
                    <a href={shareUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" className="size-5" /> {t.family}</a>
                  </Button>
                </div>

                <section aria-labelledby="receipt-title">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 id="receipt-title" className="text-lg font-bold">{t.receipt}</h3>
                    {detailItem.receiptDataUrl && (
                      <Button type="button" variant="outline" size="lg" onClick={() => setZoomed((current) => !current)} className="h-12 text-base">
                        {zoomed ? <ZoomOut aria-hidden="true" className="size-5" /> : <ZoomIn aria-hidden="true" className="size-5" />}
                        {zoomed ? (language === "hi" ? "छोटा करें" : "Zoom out") : (language === "hi" ? "बड़ा करें" : "Zoom in")}
                      </Button>
                    )}
                  </div>
                  {detailItem.receiptDataUrl ? (
                    <div className="max-h-96 overflow-auto rounded-md border border-border bg-muted p-3">
                      <img src={detailItem.receiptDataUrl} alt={`${itemName(detailItem, language)} ${t.receipt}`} className={`mx-auto max-h-80 w-full object-contain transition-transform ${zoomed ? "scale-150" : "scale-100"}`} />
                    </div>
                  ) : (
                    <div className="flex min-h-24 items-center gap-3 rounded-md border border-border bg-muted/40 p-4">
                      <Receipt aria-hidden="true" className="size-6 shrink-0 text-muted-foreground" />
                      <p className={`text-base text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>{t.receiptMissing}</p>
                    </div>
                  )}
                </section>

                <section aria-labelledby="notes-title" className="border-t border-border pt-4">
                  <h3 id="notes-title" className={`mb-3 text-lg font-bold ${language === "hi" ? "font-devanagari" : ""}`}>{t.notes}</h3>
                  <form onSubmit={addNote} className="flex flex-col gap-3 sm:flex-row">
                    <Textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder={t.notesPlaceholder} aria-label={t.notesPlaceholder} className="min-h-12 text-base" />
                    <Button type="submit" variant="outline" size="lg" disabled={!noteText.trim()} className="h-12 shrink-0 text-base"><Check aria-hidden="true" className="size-5" />{t.saveNote}</Button>
                  </form>
                  {detailItem.notes.length === 0 ? (
                    <p className="mt-3 text-base text-muted-foreground">{t.noNotes}</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-border">
                      {detailItem.notes.map((note) => (
                        <li key={note.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <p className="text-base">{note.text}</p>
                          <time className="shrink-0 text-base text-muted-foreground" dateTime={note.createdAt}>{new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", { dateStyle: "medium" }).format(new Date(note.createdAt))}</time>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={paymentItem !== null} onOpenChange={(open) => { if (!open) setPaymentItem(null); }}>
        <DialogContent className="max-w-xl [&>button:last-child]:flex [&>button:last-child]:h-12 [&>button:last-child]:w-12 [&>button:last-child]:items-center [&>button:last-child]:justify-center">
          <DialogHeader className="pr-12 text-left">
            <DialogTitle className={`text-2xl ${language === "hi" ? "font-devanagari" : ""}`}>{t.paymentTitle}</DialogTitle>
            <DialogDescription className="text-base">{paymentItem ? itemName(paymentItem, language) : ""}. {t.paymentPrompt}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {cycleChoices.map(({ value, labelKey }) => (
              <Button key={value} type="button" variant={value === "oneTime" ? "outline" : "secondary"} size="lg" onClick={() => applyRenewal(value)} className="h-14 text-base font-semibold">
                {value === "oneTime" ? <Check aria-hidden="true" className="size-5" /> : <CalendarDays aria-hidden="true" className="size-5" />}
                {t[labelKey]}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}