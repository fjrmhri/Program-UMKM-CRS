# Program UMKM CSR Dashboard

A web dashboard built with Vite + React + Tailwind CSS for monitoring UMKM (small business) bookkeeping data within the RAPP Estate Cerenti CSR program. The app provides authentication for mitra, tools to input monitoring data, and visual insights to understand financial health trends.

## Features

- **Authentication for Mitra** – Login/sign-up flow using Firebase Authentication with phone-number-based emails.
- **Realtime data storage** – Bookkeeping records, notes, and monitoring details are stored in Firebase Realtime Database.
- **Responsive dashboard** – KPI cards, sortable history table, and contextual notes adapt to mobile & desktop viewports.
- **Guided monitoring form** – Dynamic sections with automatic calculations for omset, operational cost, and business classification (Tumbuh/Berkembang/Mandiri).
- **Visual insights** – Line chart modal to compare omset across time and spotlight cards for the latest monitoring session.
- **Personal notes** – Lightweight notebook to capture follow-ups per mitra.

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) for the SPA
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Firebase Authentication & Realtime Database](https://firebase.google.com/)
- [Recharts](https://recharts.org/) for data visualization
- [Lucide](https://lucide.dev/) for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Firebase project with Authentication and Realtime Database enabled

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file (or `.env.local`) at the project root with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Available scripts

| Command         | Description                                     |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Start Vite dev server (default http://localhost:5173) |
| `npm run build` | Build production assets                         |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`  | Run ESLint                                      |

## Project structure

```
src/
├── components/      # Auth forms, dashboard widgets, modals
├── context/         # Authentication context
├── pages/           # Top-level pages (Login, Sign Up)
├── assets/          # Static assets such as logos
├── firebase.js      # Firebase initialization
├── App.jsx          # Router + layout
└── main.jsx         # Entry point
```

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes with clear commits.
3. Run `npm run build` (and tests if added) before opening a PR.

## License

This project is distributed solely for internal CSR program operations. Contact the maintainers before reusing or distributing the source code.
