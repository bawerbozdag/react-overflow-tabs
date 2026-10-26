import {
    Archive,
    ChartColumn,
    FilePen,
    FileText,
    Inbox,
    LayoutDashboard,
    Package,
    Receipt,
    Send,
    Settings,
    ShieldAlert,
    ShoppingCart,
    Star,
    Tag,
    Trash2,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// icons follow the position of a label in the message lists (see messages.ts), so every language shares them
export const TAB_ICONS: LucideIcon[] = [
    LayoutDashboard,
    ChartColumn,
    FileText,
    Users,
    Package,
    ShoppingCart,
    Receipt,
    Settings,
];

export const MAILBOX_ICONS: LucideIcon[] = [Inbox, Star, FilePen, Send, Archive, ShieldAlert, Trash2, Tag];
