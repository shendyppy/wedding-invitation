// ============================================================
// Types — Shared TypeScript interfaces
// ============================================================

/** Orientation for dividers and layout helpers */
export type Orientation = "horizontal" | "vertical";

/** Button visual variants */
export type ButtonVariant = "primary" | "outline" | "icon";

/** Button sizes */
export type ButtonSize = "sm" | "md" | "lg";

/** Typography semantic variants */
export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "script"
  | "script-lg";

/** Tag override for Typography */
export type TypographyTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label";

/** Countdown timer values */
export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** RSVP attendance status */
export type AttendanceStatus = "hadir" | "tidak_hadir" | "";

/** RSVP form data */
export interface RsvpFormData {
  name: string;
  guestCount: string;
  attendance: AttendanceStatus;
  message: string;
}

/** Wish/message entry */
export interface WishEntry {
  id: string;
  name: string;
  attendance: AttendanceStatus;
  message: string;
}

/** Bank account info for wedding gift */
export interface BankAccount {
  bankName: string;
  bankLogoSrc: string;
  accountNumber: string;
  accountHolder: string;
}

/** Event schedule item */
export interface EventSchedule {
  name: string;
  startTime: string;
  endTime: string;
}

/** Couple person profile */
export interface CoupleProfile {
  fullName: string;
  photoSrc: string;
  sketchSrc: string;
  role: "bride" | "groom";
  description: string;
  fatherName: string;
  motherName: string;
}

/** Wedding event data */
export interface WeddingData {
  bride: CoupleProfile;
  groom: CoupleProfile;
  weddingDate: string; // ISO date string
  venue: {
    name: string;
    address: string;
    mapsUrl: string;
  };
  schedule: EventSchedule[];
  story: string[];
  bankAccounts: BankAccount[];
  heroQuote: string[];
}
