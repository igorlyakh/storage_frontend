<p align="right">🌐 <b>English</b> · <a href="README.he.md">עברית</a></p>

# 📦 Stock Assistant — Frontend

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Mantine" src="https://img.shields.io/badge/Mantine-9-339AF0?logo=mantine&logoColor=white" />
  <img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=white" />
  <img alt="i18next" src="https://img.shields.io/badge/i18next-EN%20%7C%20RU%20%7C%20HE-26A69A?logo=i18next&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-Proprietary-red" />
</p>

<p align="center"><b>Stock Assistant Frontend</b> — an internal order & inventory management system for a retail chain, connecting stores, the central warehouse, admins and drivers in a single interface.</p>

---

## 📖 Table of Contents

- [About the project](#-about-the-project)
- [Roles in the system](#-roles-in-the-system)
- [Key features](#-key-features)
- [Tech stack](#️-tech-stack)
- [Project structure](#-project-structure)
- [Screenshots](#️-screenshots)
- [Local setup](#-local-setup)
- [Available scripts](#-available-scripts)
- [Deployment](#️-deployment)
- [Related project — Backend](#-related-project--backend)
- [License](#-license)

## 📋 About the project

**Stock Assistant** is an internal web system for managing orders, inventory and warehouses for a retail chain. It replaces manual ordering and stock-tracking processes (phone calls, WhatsApp, spreadsheets) with a single digital workflow: a store orders products from the central warehouse, the warehouse processes and ships the order, and the admin gets a full real-time picture of the business — including low-stock alerts, statistics and reports.

This repository contains the **Frontend** — a **React SPA** that consumes the [Stock Assistant Backend](#-related-project--backend) API.

## 👥 Roles in the system

| Role | Description |
|---|---|
| 🏪 **STORE** | Places orders from the catalog, tracks their status, and files return requests |
| 📦 **WAREHOUSE** | Handles incoming orders, manages stock and warehouses, closes returns once received physically |
| 👑 **ADMIN** | Full access: products, users, stores, warehouses, suppliers, statistics, system settings and return approvals |
| 🚚 **DRIVER** | Scans QR codes for approved returns and picks them up from the store |

API permissions are enforced both by role (Role Guards) and by an admin's assigned **scope** (`adminScopes`) — so different admins can be limited to only the product categories assigned to them.

## ✨ Key features

**Orders**
- Store-side order creation, gated by an order-day window and a daily cutoff time defined in system settings
- Full status lifecycle: New → In progress → Sent → Completed / Backorder / Rejected
- "Write-off" orders that warehouse/admin can open directly

**Products & inventory**
- Product catalog by category and brand, with images, SKU, package type (pallet/box/pack/piece) and units per package
- Substitute products automatically suggested when an item is out of stock
- Drag & drop reordering of the product list
- Optional per-product order quantity limit

**Warehouses**
- Multiple warehouses with a configurable default warehouse
- Stock transfers between warehouses
- Per-warehouse stock view

**Returns with QR**
- Store opens a return with a photo and quantity → admin approves/rejects → driver scans the QR and picks it up → warehouse scans and closes it, automatically restocking the default warehouse
- Printable return document

**Suppliers, statistics & reports**
- Per-admin supplier management (each admin sees only their own suppliers)
- Statistics dashboards (orders and requests) with Excel export

**User, store & settings management**
- Manage users, stores, brands and categories
- System settings: order days, cutoff time, support email, maintenance mode

**Notifications**
- Toast + blinking tab title when a new order arrives at the warehouse (background polling)
- Low-stock alert modal for admins, checked once a day and on demand

**Multi-language & accessibility**
- 3 built-in languages: **English, Russian and Hebrew**, with full RTL support

## 🛠️ Tech stack

| Technology | Purpose |
|---|---|
| **React 19** + React Compiler | Application core |
| **Vite 7** | Build tool & dev server |
| **Mantine 9** (core, dates, notifications, modals, spotlight, dropzone, carousel, charts, tiptap) | UI component library |
| **Redux Toolkit + RTK Query** | State management and API calls with automatic caching |
| **redux-persist** | Persisting session/auth state across page reloads |
| **React Router 7** | Routing, with lazy-loaded pages |
| **React Hook Form + Yup** | Forms and input validation |
| **i18next / react-i18next** | Translations and multi-language support (EN/RU/HE) |
| **dnd-kit** | Drag & drop product reordering |
| **Recharts / @mantine/charts** | Charts on the statistics pages |
| **qrcode.react + html5-qrcode** | Generating and scanning QR codes for returns |
| **react-hot-toast** | Toast notifications |
| **Vercel Analytics / Speed Insights** | Production usage and performance metrics |

## 📁 Project structure

```
src/
├─ pages/           application pages (orders, products, warehouses, returns, statistics...)
├─ features/        feature-oriented logic (auth, notifications, language...)
├─ components/      reusable UI components (layout, tables, modals)
├─ store/           Redux store + RTK Query API slices
├─ i18n/            EN/RU/HE translation files
├─ utils/           shared helper functions
├─ constants/       global constants
└─ styles/          global styling (SCSS)
```

## 🖼️ Screenshots

> The screenshots below are captured from the live system (UI shown in Hebrew or English, depending on the logged-in user's language).

| | |
|---|---|
| **Login screen** <br> ![Login](screenshots/login.png) | **Dashboard — low stock alert** <br> ![Dashboard alert](screenshots/dashboard-alert.png) |
| **Dashboard in Hebrew (RTL)** <br> ![Dashboard Hebrew](screenshots/dashboard-he.png) | **Product management** <br> ![Products](screenshots/products.png) |
| **All orders** <br> ![Orders](screenshots/orders.png) | **General statistics** <br> ![Statistics](screenshots/statistics.png) |
| **Warehouse management** <br> ![Warehouses](screenshots/warehouses.png) | **Returns** <br> ![Returns](screenshots/returns.png) |

## 🚀 Local setup

**Prerequisites:** Node.js 18+, Yarn, and access to the Backend API (local or remote).

```bash
git clone https://github.com/igorlyakh/storage_frontend.git
cd storage_frontend
yarn install
yarn dev
```

The app runs on `http://localhost:5173`. In development, Vite automatically proxies `/api` and `/uploads` to the local Backend server on port `3001` (see `vite.config.js`) — no extra environment variables are needed on the frontend side.

## 📜 Available scripts

| Command | Description |
|---|---|
| `yarn dev` | Run the dev server with hot reload |
| `yarn build` | Build for production into `dist/` |
| `yarn preview` | Preview the production build locally |
| `yarn lint` | Lint the code with ESLint |

## ☁️ Deployment

The project is configured to deploy on **Vercel** (see `vercel.json`):

- `framework: vite`, built with `yarn build`, output from `dist/`
- Every request to `/api/*` and `/uploads/*` is rewritten to the Backend server
- All other routes are rewritten to `index.html` (SPA routing support)

There is also an alternative deployment mode where the Backend (NestJS) serves the built `dist/` files directly as static assets (e.g. a VPS deployment), without Vercel at all.

## 🔗 Related project — Backend

The server code (NestJS + PostgreSQL) lives in a separate repository: **[storage_backend](https://github.com/igorlyakh/storage_backend)**.

## 📄 License

This project is **proprietary** and all rights are reserved. It may not be copied, distributed, or used without prior express written permission. See [LICENSE](LICENSE) for details.
