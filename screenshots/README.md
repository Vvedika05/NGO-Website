# GiveTrack Lab 2 — Screenshot Capture Instructions

As per academic submission guidelines, do not fabricate screenshots. Follow these exact steps in Google Chrome (Reference Browser) to capture the required screenshots:

### 1. Desktop View (`01_desktop_view.png`)
1. Open `index.html` in Google Chrome on a desktop/laptop display (minimum 1200px width).
2. Ensure normal zoom (100%).
3. Press `F12` to open DevTools, press `Ctrl+Shift+P`, type `Capture full size screenshot`, and save as `01_desktop_view.png`.

### 2. Mobile View at 320px (`02_mobile_320px.png`)
1. In Google Chrome, press `F12` and toggle the Device Toolbar (`Ctrl+Shift+M`).
2. Set dimensions to `320px` width × `800px` height.
3. Observe how:
   - `<picture>` loads the close-up portrait `assets/campaign-mobile.jpg` instead of the wide landscape image.
   - The navigation collapses into a pure CSS accessible hamburger drawer.
   - The layout shifts to a single column with touch-friendly spacing.
4. Capture screenshot via DevTools (`Ctrl+Shift+P` -> `Capture full size screenshot`) and save as `02_mobile_320px.png`.

### 3. Dark Mode View (`03_dark_mode.png`)
1. In DevTools, open the **Rendering** tab (`Esc` -> three dots menu -> More tools -> Rendering).
2. Under **Emulate CSS media feature prefers-color-scheme**, select `prefers-color-scheme: dark`.
3. Notice the automatic dark theme palette transition: deep teal-black canvas (`#061B19`), card surfaces (`#0D302D`), borders (`#1C544F`), crisp near-white headings (`#EDFBF9`), and preserved financial numbers.
4. Capture and save as `03_dark_mode.png`.

### 4. Video Playback & WebVTT Captions (`04_video_playing.png`)
1. In Google Chrome, navigate to the **Campaign Impact Video** section.
2. Play `assets/campaign-impact.mp4` and ensure the native WebVTT captions track is enabled.
3. Observe the custom `::cue` subtitle styling: deep teal semi-transparent backdrop, crisp white font, rounded corners.
4. Capture and save as `04_video_playing.png`.

### 5. Print Preview (`05_print_preview.png`)
1. On `index.html`, press `Ctrl+P` (or in DevTools Rendering tab, select **Emulate CSS media type: print**).
2. Set destination to "Save as PDF" or inspect the A4 Print Preview.
3. Observe Challenge C2 in action:
   - Header navigation, buttons, video, volunteer selector, hero marketing, and submission forms are hidden.
   - Clean, formal A4 Financial Transparency Report with GiveTrack branding, reconciliation formula, metrics, and ledger.
   - Supporting voucher hyperlinks print their full destination URLs via `a[href$=".pdf"]::after { content: " (" attr(href) ")"; }`.
4. Take a screenshot of the print preview and save as `05_print_preview.png`.

### 6. 200% Zoom Reflow (`06_zoom_200_percent.png`)
1. In Google Chrome, set browser zoom to 200% (or in DevTools, set viewport width to 640px at 2.0x device scale).
2. Observe how the layout smoothly reflows into a single column with zero horizontal document scrollbar (`scrollWidth === docWidth`).
3. Capture full-page screenshot via DevTools (`Ctrl+Shift+P` -> `Capture full size screenshot`) and save as `06_zoom_200_percent.png`.

### 7. High-Contrast Mode (`07_high_contrast.png`)
1. In DevTools, open the **Rendering** tab and locate **Emulate CSS media feature prefers-contrast**.
2. Select `prefers-contrast: more`.
3. Observe how the entire platform transitions into a dedicated high-contrast mode:
   - All cards, form controls, tables, and buttons feature stark, solid 2px black borders.
   - Text contrast is maximized (`#000000` text on pure `#FFFFFF` surfaces, or `#FFFFFF` on `#000000`).
   - Distinct from dark mode: high-contrast enforces stark boundaries and removes soft tints.
4. Capture screenshot via DevTools and save as `07_high_contrast.png`.

### 8. Donation Pledge Modal (`08_donation_modal.png`)
1. In Google Chrome, click the "Make a Donation" or "Support Flagship Campaign" action button.
2. The URL hash transitions to `#simulate-donation`, triggering the pure CSS `:target` modal overlay.
3. Observe the professional, honest donation interface with demo pledge inputs and clear non-profit disclaimers.

### 9. Voucher Details Modal & PDF Download (`09_voucher_modal.png`)
1. In the Expense Verification Ledger, click any expense ID or voucher reference link (e.g., `EXP-CFSP-01` or `INV-BLR-8841`).
2. The URL hash transitions to `#voucher-01` or `#voucher-05`, opening the dedicated Expense Voucher Details modal.
3. Observe the high-contrast readable typography:
   - Primary text / values: `#F8FAFC` near-white in dark mode, `#0F172A` in light mode.
   - Field labels: `#CBD5E1` light grey in dark mode, `#475569` in light mode.
   - Amount: `#2DD4BF` bright turquoise/mint in dark mode, `#0D9488` in light mode.
   - Status badge: readable dark green `#065F46` on light mint `#D1FAE5`.
   - Audit notes: readable white/light mint `#EDFBF9` in dark mode, dark slate `#334155` in light mode.
4. Test the **"Download Voucher PDF"** action: downloads the authentic single-page A4 document from `assets/vouchers/` with the GiveTrack logo, formal stationery, and non-profit verification notes.
5. Screenshots captured:
   - `09_voucher_modal.png` / `09_voucher_modal_dark.png`: Dark mode modal.
   - `09_voucher_modal_light.png`: Light mode modal.
   - `09_voucher_modal_mobile.png`: Mobile viewport view.

### 10. Volunteer Shift Selected State (`10_volunteer_shift_selected.png`)
1. In the Volunteer Section, click any open volunteer shift radio card (e.g. "Ration Kit Assembly").
2. Observe the pure CSS `:has()` shift response: the card highlights with active accent border, and the confirmation panel displays high-contrast orientation guidelines, reporting addresses, and induction guidelines.


