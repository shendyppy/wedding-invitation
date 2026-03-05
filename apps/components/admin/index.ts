// ============================================================
// Admin Components — Index
// ============================================================

export { AdminSidebar } from "./AdminSidebar";
export type { AdminView } from "./AdminSidebar";

export { DashboardView } from "./DashboardView";
export type { DashboardData } from "./DashboardView";

export { GuestsView } from "./GuestsView";
export type { Guest } from "./GuestsView";

export { CreateGuestView } from "./CreateGuestView";

export { GuestFormModal } from "./GuestFormModal";
export type { GuestFormData } from "./GuestFormModal";

export { RsvpsView } from "./RsvpsView";
export type { RsvpData } from "./RsvpsView";

export { WishesView } from "./WishesView";
export type { WishData } from "./WishesView";

export { ActionLogsView } from "./ActionLogsView";
export type { ActionLogData, ActionStats } from "./ActionLogsView";

export { BulkImportView } from "./BulkImportView";

// UI components
export * from "./ui";
export { Modal, ConfirmDialog } from "./ui/modal";

// Hooks
export { useToast, Toaster } from "@/hooks/admin";
export type { Toast } from "@/hooks/admin";
