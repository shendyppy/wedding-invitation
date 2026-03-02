// ============================================================
// Wedding Data — Constants
// All wedding details used across the invitation.
// ============================================================

import type { WeddingData, WishEntry } from "@/types";

export const WEDDING_DATA: WeddingData = {
  bride: {
    fullName: "Stevana Oktavia Yohans",
    photoSrc: "/assets/stevana.jpeg",
    sketchSrc: "/assets/bride-to-be.GIF",
    role: "bride",
    description: "Youngest daughter of",
    fatherName: "Mr. Benny Yohans",
    motherName: "Mrs. Puspa Dewi Anggraeni",
  },
  groom: {
    fullName: "Muchamad Zulfikar",
    photoSrc: "/assets/zulfikar.jpeg",
    sketchSrc: "/assets/grooms-to-be.GIF",
    role: "groom",
    description: "Youngest son of",
    fatherName: "Mr. Triono Usmanto",
    motherName: "Mrs. Sri Kusmiati",
  },
  weddingDate: "2026-04-11T08:30:00+07:00",
  venue: {
    name: "Villa Lagenta Lembang",
    address: "Jl. Kolonel Masturi No. 8, Kec. Lembang, Kab. Bandung Barat",
    mapsUrl: "https://maps.google.com/?q=Villa+Lagenta+Lembang",
  },
  schedule: [
    { name: "Akad Nikah", startTime: "08.30", endTime: "11.00" },
    { name: "Resepsi", startTime: "11.30", endTime: "14.00" },
  ],
  story: [
    "We first met in 2017 while attending the same university. Four years apart and from different majors, we probably would have never crossed paths — but somehow, we did.",
    "We were together from 2017 to 2020, and our journey wasn't always easy. We went through a complicated chapter that eventually led us to walk our own paths. Even so, we believed that if we were truly meant to be, we would find our way back to each other as better versions of ourselves.",
    "Three years later, after being 3,600 miles apart and completely out of contact, we reconnected. We came back more mature, more certain, and ready to build a relationship with clearer intentions and a shared future.",
    "Now, we are ready to take the next step — to begin a new chapter, to grow side by side, and to share our lives together. We're also so excited to celebrate this special day with you!",
  ],
  bankAccounts: [
    {
      bankName: "BCA",
      bankLogoSrc: "/assets/logo-bca.png",
      accountNumber: "0861063061",
      accountHolder: "Stevana Oktavia Yohans",
    },
    {
      bankName: "BNI",
      bankLogoSrc: "/assets/logo-bni.png",
      accountNumber: "0287121846",
      accountHolder: "Muchamad Zulfikar",
    },
  ],
  heroQuote: [
    "You are invited to witness the beginning of our forever.",
    "From dreams we once whispered to promises we now make —",
    'Join us as we say "I do."',
  ],
};

export const SAMPLE_WISHES: WishEntry[] = [
  {
    id: "1",
    name: "Sarah",
    attendance: "hadir",
    message:
      "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
  },
  {
    id: "2",
    name: "Ahmad",
    attendance: "hadir",
    message:
      "Barakallahu lakuma wa baraka 'alaikuma. Semoga selalu diberkahi!",
  },
  {
    id: "3",
    name: "Rina",
    attendance: "tidak_hadir",
    message: "Maaf tidak bisa hadir, tapi doa terbaik untuk kalian berdua!",
  },
];
