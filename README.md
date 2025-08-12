# 🛠️ EMS – Equipment Maintenance System (Monorepo)

A fullstack, modular Equipment Maintenance System built using a Turborepo monorepo structure. Designed for managing equipment maintenance workflows, user roles, and service tasks with flexibility, scalability, and reusability in mind.

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

## ✅ Project Summary

The EMS helps organizations:

- Manage equipment assets (generators, pumps, AC units, etc.)
- Schedule and track preventive and corrective maintenance
- Handle work orders and dynamic checklists
- Record service history, parts usage, and performance metrics
- Provide role-based user access (Admin, Supervisor, Technician, Asset Manager, Client)
- Support future AI-powered predictive maintenance

---

## 🧱 Folder Architecture Details

### `packages/` – Frontend Feature Modules (Next.js + Mantine)
- `web/`: Main dashboard UI (sidebar, layout, auth)
- `user-management/`: Login, signup, profile UI
- `equipment-asset-management/`: Asset forms, views
- `ui/`: (Optional) Reusable UI components
- `shared/`: (Optional) Shared types, utils

### `services/` – Backend Feature Services (Express + TypeScript)
- `user-management-service/`: Auth APIs, JWT, user data
- `equipment-management-service/`: Asset APIs, DB logic

**Each service includes:**
- `api/`: Routes like `/auth/login`, `/assets`
- `models/`: Database models (e.g., `User.ts`)
- `services/`: Core business logic (e.g., `authService.ts`)
- `middleware/`: Role checks, error handling

---

## 🔐 User Roles

| Role           | Permissions                                            |
|----------------|--------------------------------------------------------|
| Admin          | Full control over all modules and user management      |
| Supervisor     | Work orders, scheduling, team reporting                |
| Technician     | View & update assigned tasks only                      |
| Asset Manager  | Manage and update equipment and locations              |
| Client         | View-only access to assets and work order history      |

---

## 👤 Role Access Journeys

### 1. **Admin**
- **Access:** Full system control (users, roles, assets, checklists, settings, reports)
- **Journey:** Logs in → sees dashboard → manages users → creates checklist templates → oversees calendars and reports

### 2. **Supervisor**
- **Access:** Work orders, scheduling, reports (no user/role management)
- **Journey:** Logs in → sees performance dashboard → assigns work orders → checks task progress → views KPIs

### 3. **Technician**
- **Access:** Assigned work orders, checklists, time/parts logging
- **Journey:** Logs in → views assigned tasks → executes checklists → logs time/parts → marks complete

### 4. **Asset Manager**
- **Access:** CRUD on equipment assets, assign custodians/locations
- **Journey:** Logs in → views asset list → registers/updates assets → assigns to custodian/location

### 5. **Client**
- **Access:** View-only assets and work orders
- **Journey:** Logs in → sees assets/service history → tracks ongoing/completed maintenance → downloads reports

---

## 🧠 Summary Table – Role Permissions

| Role           | Users | Assets | Work Orders | Checklists | Reports | Settings |
|----------------|-------|--------|-------------|------------|---------|----------|
| Admin          | ✅ CRUD | ✅ CRUD | ✅ Full     | ✅ Full     | ✅ Full  | ✅ All    |
| Supervisor     | ❌     | ✅ View | ✅ Assign   | ✅ Assign   | ✅ View  | ❌        |
| Technician     | ❌     | ✅ View | ✅ Update   | ✅ Execute  | ❌       | ❌        |
| Asset Manager  | ❌     | ✅ CRUD | ❌          | ✅ Attach   | ❌       | ❌        |
| Client         | ❌     | ✅ View | ✅ View     | ❌          | ✅ View  | ❌        |

---

## 🎯 Core Features

### 1. User Management
- JWT login/logout
- User profiles & role-based routing
- AuthGuard for frontend routes

### 2. Equipment Asset Management
- Asset registration with model, serial, location
- Custodian/department assignment
- Operational status tracking
- QR/barcode linking
- Parent-child hierarchy

### 3. Maintenance Planning
- Preventive (PM) & Corrective (CM) maintenance
- Calendar scheduling
- Resource assignment

### 4. Work Order Management
- Create/update/assign work orders
- Task breakdowns
- Time tracking
- Technician signatures

### 5. Checklist Management
- Template creation
- Attach checklists to work orders
- Step-by-step execution

### 6. Reporting & Audits
- History logs & audit trails
- Cost, performance, KPI reports

### 7. AI Features *(Future)*
- Predictive maintenance
- AI scheduling
- Anomaly detection

---

## ⚙️ Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | Next.js + TypeScript + Mantine  |
| Backend     | Express + TypeScript            |
| Database    | Cloudflare D1 (SQLite)          |
| Auth        | JWT                              |
| Tooling     | Turborepo + PNPM                 |
| Dev Editor  | Cursor AI                        |

---

## 🧠 Design Rules

- All frontend-only features in `packages/`
- Backend services in `services/` by domain
- Dashboard lives in `packages/web`
- Role-based access control across frontend & backend
- Shared UI → `ui/`, shared types → `shared/`
- Use `kebab-case` for folders, `PascalCase` for components

---

## 🚀 Development Setup

```bash
pnpm install   # Install dependencies
pnpm dev       # Start frontend & backend in dev mode
```

---

## 🧩 Reusability & Scalability

- Each feature (frontend package or backend service) is independently reusable
- New features can be added without breaking existing ones
- Suitable for multi-project adoption
