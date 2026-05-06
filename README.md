# LeadFlow CRM

A Lead Management CRM built with React 19, TypeScript, Redux Toolkit Query, and Tailwind CSS. Manage your sales pipeline across five stages with a searchable list view and a drag-and-drop Kanban board.

---

## How to Run

The app requires two processes running simultaneously — the mock API server and the Vite dev server.

### 1. Start the Mock API Server

```bash
cd mock-server
npm install
node server.js
```

The mock server starts on **http://localhost:4000** and serves all lead data in-memory. It resets on restart, so seed data is always fresh.

> **Optional environment variables:**
> - `MOCK_LATENCY_MS=300` — adds 300ms artificial delay to every request (useful for testing loading states)
> - `MOCK_FAILURE_RATE=0.1` — randomly fails 10% of requests with a 500 error (chaos mode)

### 2. Start the Frontend

Open a second terminal at the project root:

```bash
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**. Vite proxies all `/api/*` requests to the mock server at port 4000 automatically — no CORS issues, no extra configuration needed.

### Available Scripts

| Location | Command | Description |
|---|---|---|
| `mock-server/` | `node server.js` | Start the API server |
| `mock-server/` | `node --watch server.js` | Start with auto-reload on file changes |
| `mock-server/` | `node generate.js` | Regenerate the seed data file |
| root | `npm run dev` | Start the Vite dev server |
| root | `npm run build` | Build for production |
| root | `npm run preview` | Preview the production build locally |

---

## Project Overview

LeadFlow lets sales teams track leads through a defined pipeline without the overhead of a full enterprise CRM. Every lead has a status that moves in one direction only — there is no going back, and terminal states are locked.

**Pipeline stages:**

```
NEW → CONTACTED → QUALIFIED → CONVERTED
                            ↘
                             LOST  (reachable from any stage)
```

---

## Features

### List View (`/leads/list`)
- Paginated, searchable table of all leads
- Filter by one or more statuses simultaneously
- Expand any row inline to preview full details without navigating away
- Advance a lead's status directly from the table
- Bulk-select rows and perform batch actions
- Create, edit, and delete leads via modal forms

### Board View (`/leads/board`)
- Kanban board with one column per pipeline stage
- Drag and drop cards across columns to update status
- Status transitions are validated — you can only drop a card in a valid next stage
- Drag triggers an optimistic UI update backed by an API call
- Same search and filter controls as the list view

### Lead Detail Page (`/leads/:id`)
- Full contact information — name, email, phone, source, timestamps
- Status badge with available transition actions
- Edit and delete from the detail page
- Back navigation to wherever you came from

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| State & Data Fetching | Redux Toolkit Query (RTK Query) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI |
| Drag and Drop | @hello-pangea/dnd |
| Notifications | Sonner |
| Icons | Lucide React |
| Mock Backend | Express (Node.js) |

---

## Architecture

### Data Fetching — RTK Query

All server communication goes through RTK Query (`src/features/leads/api/leadsApi.ts`). It handles caching, loading and error states, and automatic cache invalidation after mutations. There is no manual `useEffect` data fetching anywhere in the codebase. The store is minimal — a single API slice with no extra reducers.

```
src/store/index.ts  →  configureStore({ leadsApi.reducer })
```

### Mock Backend

The mock server (`mock-server/server.js`) exposes a standard REST API:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/leads` | Fetch all leads |
| `GET` | `/leads/:id` | Fetch a single lead |
| `POST` | `/leads` | Create a new lead |
| `PATCH` | `/leads/:id` | Update a lead (including status) |
| `DELETE` | `/leads/:id` | Delete a lead |

Swapping in a real backend only requires changing the `baseUrl` in `leadsApi.ts`. The Vite proxy config in `vite.config.ts` handles routing `/api/*` to the server, so no changes are needed in components.

### Status Transition Rules

Transition rules are defined once in `src/features/leads/constants/index.ts` and enforced everywhere — in the list view, board view, detail page, and on the server:

```ts
const VALID_TRANSITIONS = {
  NEW:       ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED',  'LOST'],
  QUALIFIED: ['CONVERTED',  'LOST'],
  CONVERTED: [],   // terminal
  LOST:      [],   // terminal
};
```

### Custom Hooks

Each view owns its UI state through a dedicated hook:

- `useListView` — manages search, filters, pagination, selection, modals, and inline expansion for the list view
- `useBoardView` — manages search, filters, drag state, and column grouping for the board view
- `useLeadDetail` — manages loading, edit/delete modal state for the detail page

This keeps components focused purely on rendering and makes the logic independently readable.

### Folder Structure

```
src/
├── App.tsx                        # Route definitions
├── features/
│   ├── leads/                     # Core domain
│   │   ├── api/leadsApi.ts        # RTK Query API slice
│   │   ├── components/            # Shared CRM components
│   │   ├── constants/             # Status config, transition rules
│   │   ├── hooks/                 # useLeadDetail
│   │   └── types/                 # Lead, LeadStatus, LeadSource
│   ├── list-view/                 # List view feature
│   │   ├── components/LeadsPage.tsx
│   │   ├── components/BulkActionBar.tsx
│   │   └── hooks/useListView.ts
│   ├── board-view/                # Board view feature
│   │   ├── components/BoardPage.tsx
│   │   ├── components/BoardColumn.tsx
│   │   ├── components/LeadCard.tsx
│   │   └── hooks/useBoardView.ts
│   └── home/                      # Landing page
├── store/index.ts                 # Redux store
└── ui/                            # Shared Radix UI components
mock-server/
├── server.js                      # Express API server
├── seed.json                      # Seed lead data
└── generate.js                    # Seed data generator
```

---

## Lead Data Shape

```ts
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  source: 'website' | 'referral' | 'campaign' | 'linkedin' | 'cold-call'
        | 'email' | 'trade-show' | 'partner' | 'event' | 'cold-outreach' | null;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}
```
