

# Plan: Add Chrome Extension Download Section

Since Chrome doesn't allow direct extension installation from websites, we'll add a section that:
1. Provides a download link for the extension files
2. Shows clear installation instructions
3. Links to Chrome Web Store (placeholder for when published)

## Changes

### 1. Create Extension Banner Component
**File:** `src/components/ExtensionBanner.tsx`

A compact banner/card component that:
- Uses the existing black + yellow design system
- Shows Chrome icon and extension name
- Has two buttons:
  - "Get Extension" → Links to Chrome Web Store (placeholder URL for now)
  - "Manual Install" → Opens a modal with step-by-step instructions
- Displays key benefits (validate while browsing, right-click to analyze)

### 2. Update Index Page
**File:** `src/pages/Index.tsx`

- Add the `ExtensionBanner` component below the header
- Keep it subtle but visible (not overshadowing the main validator)

### 3. Create Installation Instructions Modal (Optional)
**File:** `src/components/ExtensionInstallModal.tsx`

A dialog that shows:
1. Download the extension folder
2. Go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" and select folder

## Technical Notes

- The extension files in `chrome-extension/` are **not served by the web app** - they need to be downloaded separately or hosted as a ZIP
- For production, you would publish to Chrome Web Store and use that URL
- The "Download" button could link to a GitHub release or hosted ZIP file

## UI Placement

```
┌─────────────────────────────────────┐
│         Header (existing)            │
├─────────────────────────────────────┤
│   🧩 Get the Chrome Extension        │  ← NEW: Extension banner
│   [Chrome Web Store] [How to Install]│
├─────────────────────────────────────┤
│         Validator Form               │
│         (existing)                   │
└─────────────────────────────────────┘
```

