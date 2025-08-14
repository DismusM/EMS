# 🛠️ EMS – Equipment Maintenance System (Monorepo)

This is a fullstack modular Equipment Maintenance System built with Turborepo, designed to support reusable frontend features and backend services in a scalable way.

---

## 📦 Folder Structure

```
EMS/
├── packages/
│   ├── web/                          ← Main frontend app (dashboard + layout)
│   ├── user-management/              ← Frontend: login, profile, auth UI
│   ├── equipment-asset-management/   ← Frontend: asset registration + views
│   ├── ui/ (optional)                ← Shared UI components
│   └── shared/ (optional)            ← Types, constants, utils

├── services/
│   ├── user-management-service/      ← Backend: login, JWT, roles, auth API
│   └── equipment-management-service/ ← Backend: CRUD APIs for assets

├── turbo.json                        ← Turborepo pipeline config
├── package.json                      ← Root dependencies
├── pnpm-workspace.yaml               ← Defines monorepo package paths
└── README.md                         ← This file
```

---

## ⚙️ Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | Next.js + TypeScript + Mantine  |
| Backend     | Express + TypeScript            |
| Database    | Cloudflare D1 (SQLite)          |
| Auth        | JWT (JSON Web Token)            |
| Tooling     | Turborepo + PNPM                |
| Dev Editor  | Cursor AI                       |

---

## 🔐 User Roles

| Role         | Description                                         |
|--------------|-----------------------------------------------------|
| Admin        | Full access to all features and user management     |
| Supervisor   | Manage work orders, assign tasks, view reports      |
| Technician   | View and complete assigned tasks                    |
| Asset Manager| Manage equipment and asset checklists               |
| Client       | View-only access to their assets and reports        |

---

## 🚀 Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the App in Development Mode

```bash
pnpm dev
```

> This command starts both frontend and backend services if configured.

---

## 🧠 Project Design Rules

- All frontend-only features go in `packages/` as reusable modules.
- All backend services go in `services/`, decoupled by domain.
- Use JWT for authentication and protect routes with role-based access control.
- The `web/` package holds the main dashboard and layout logic.

---

## 📚 Features (Planned & In Progress)

- ✅ User Authentication & Roles
- 🔧 Equipment Asset Management
- 🛠️ Work Order Management
- 📝 Configurable Checklists
- 📊 Reporting & KPIs
- 🤖 AI Predictive Maintenance (future)

---

## 🤝 Contributing

This project is designed to be beginner-friendly and scalable.
Feel free to fork, contribute, or reuse any module in your own projects.