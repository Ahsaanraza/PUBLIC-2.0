# Saer.pk Design System

This document outlines the core design language, tokens, and components used across the Saer.pk platform.

## 1. Color Palette

| Category | Color Name | Hex/Tailwind | Usage |
| :--- | :--- | :--- | :--- |
| **Brand** | Deep Navy | `#0B1A28` | Main headers, brand text, dark backgrounds. |
| **Brand** | Deep Blue | `#1a4484` | Primary buttons, icons, links, secondary branding. |
| **Brand** | Light Blue | `blue-400` | Hover states, active links, icon accents. |
| **Status** | Emerald | `#10b981` | Success states, confirmed bookings, tickets. |
| **Status** | Orange | `#f97316` | Warnings, travel advisories, layover alerts. |
| **UI** | Page BG | `#f0f2f5` | Main application background. |
| **UI** | Surface | `#ffffff` | Content cards and modules. |
| **UI** | Soft Slate | `slate-50` | Secondary sections inside cards. |

---

## 2. Typography

Balance between elegance (Serif) and readability (Sans).

- **Branding ("Saer")**: `'Eczar'`, serif (font-black, -0.06em tracking).
- **Branding ("pk")**: `'Roboto Slab'`, serif (font-extrabold, -0.02em tracking).
- **Headings**: `'Montserrat'`, sans-serif (font-black/extrabold).
- **Body**: Standard System Sans-serif (Inter, -apple-system).
- **Data/ID**: Monospace (Courier New, Consolas) for IDs and PNRs.

---

## 3. Iconography

Primary Library: **Lucide React**

- **Weight**: 2.0 (Standard) to 2.5 (Emphasis).
- **Standard Size**: `16px` (Inline), `20px` (Section Head), `28px+` (Hero).
- **Container**: Often wrapped in `rounded-full` with 10% opacity brand backgrounds (e.g., `bg-blue-50`).

---

## 4. Design Tokens

| Property | Value | Tailwind Example |
| :--- | :--- | :--- |
| **Card Radius** | 16px / 32px | `rounded-2xl` / `rounded-[2rem]` |
| **Button Radius** | 8px / Full | `rounded-lg` / `rounded-full` |
| **Shadows** | Extra Large | `shadow-xl` |
| **Brand Shadow** | Colored Shadow | `shadow-[0_10px_40px_-10px_rgba(26,68,132,0.3)]` |
| **Animations**| Fade/Slide | `animate-in fade-in slide-in-from-bottom-4` |

---

## 5. Components & Interactions

- **Cards**: Pure white background, subtle border (`border-slate-200`), and deep shadows.
- **Inputs**: High contrast focus states, often with subtle background tints.
- **Buttons**: Every interactive element must have `transition-all` and `active:scale-95`.
- **Status Badges**: Semi-transparent backgrounds with bold text (e.g., `bg-emerald-100/60 text-emerald-700`).

---

## 6. Calendars & Date Pickers

We use two primary interaction patterns for date selection to ensure high usability on both mobile and desktop.

### Mobile: Smart Step-by-Step Picker
- **Component**: `SmartDatePickerModal`
- **Pattern**: A bottom-sheet modal that guides the user through three steps: **Day** → **Month** → **Year**.
- **Visuals**: Large, touch-friendly list items (`py-3 px-4`) with an active step indicator at the top.

### Desktop: Segmented Box Picker
- **Component**: `DesktopSmartDatePicker`
- **Pattern**: Three adjacent searchable dropdowns (Day, Month, Year).
- **Behavior**: Auto-advances to the next segment upon selection.
- **Visuals**: Standard `h-11` inputs with a `CheckCircle` icon appearing once a segment is valid.

### Reusable Date Tokens
- **Standard Format**: `DD MMM YYYY` (e.g., `15 Feb 2026`).
- **Input Style**: `h-11`, `rounded-lg`, `border-slate-300`, `font-semibold`.
- **Badges**: Small uppercase tracking pills (e.g., `bg-blue-50 text-[#1a4484]`).
- **Timeline Nodes**: Vertical dashed lines (`border-dashed border-slate-200`) with circular nodes for date markers in itineraries.
