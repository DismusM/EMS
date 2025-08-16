# 🧠 EMS – Equipment Maintenance System: Project Summary

This is a fullstack, modular Equipment Maintenance System (EMS) built using a monorepo structure. It is designed to manage equipment maintenance workflows, user roles, and service tasks with the flexibility to scale and reuse individual features in other systems.

---

## ✅ What You’re Building

You are building a fullstack Equipment Maintenance System that helps organizations:

- Manage equipment assets (e.g., generators, pumps, ACs)
- Schedule and track preventive and corrective maintenance
- Handle work orders and checklists for maintenance
- Record service history, parts, and performance
- Provide user roles like Admins, Technicians, and Clients
- Enable AI-powered predictive maintenance in the future

---

## 🧱 Folder Architecture (Monorepo with Turborepo)

### `apps/`: Frontend Applications
- `web/`: Main Next.js application with App Router
  - `app/`: App Router pages and layouts
  - `components/`: Page-specific components
  - `lib/`: Shared utilities and hooks

### `packages/`: Shared and Feature Modules
- `user-management/`: User management UI components and logic
- `equipment-asset-management/`: Equipment management UI components and logic
- `ui/`: Reusable UI components library
- `shared/`: Shared types, utilities, and configurations

### `services/`: Backend Services (Express + TypeScript)
- `user-management-service/`: Authentication and user management API
  - `src/`
    - `controllers/`: Request handlers
    - `routes/`: API route definitions
    - `middleware/`: Authentication and validation
    - `db/`: Database models and migrations
    - `utils/`: Helper functions
- `equipment-management-service/`: Equipment management API
  - `src/`
    - `controllers/`: Request handlers
    - `routes/`: API route definitions
    - `middleware/`: Authentication and validation
    - `db/`: Database models and migrations
    - `utils/`: Helper functions

Each service includes:
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

## 🎯 Core Features

### 1. User Management
- Login/logout with JWT tokens
- User profiles and role-based routing
- AuthGuard protection for frontend routes

### 2. Equipment Asset Management
- Register assets with model, serial, and location info
- Assign custodians or departments
- Track operational status (active, inactive, retired)
- Link assets with QR/barcodes
- Hierarchical parent-child structure

### 3. Maintenance Planning
- Preventive Maintenance (PM): based on time, usage, condition
- Corrective Maintenance (CM): triggered by breakdowns or reports
- Calendar view for scheduling tasks
- Assign resources (techs, parts) to tasks

### 4. Work Order Management
- Create, update, assign and track work orders
- Task breakdowns, technician time tracking
- Capture digital technician signatures

### 5. Checklist Management
- Create checklist templates for recurring procedures
- Attach dynamic checklists to work orders
- Step-by-step technician input for compliance

### 6. Reporting & Audits
- Maintenance history logs and audit trails
- Reporting on costs, technician performance, KPIs

### 7. AI-Powered Features *(Future)*
- Predictive maintenance based on sensor data
- AI-powered scheduling and part forecasting
- Anomaly detection and alerts

---

## ⚙️ Tech Stack

| Layer        | Stack                              |
|--------------|-------------------------------------|
| Frontend     | Next.js + TypeScript + Mantine      |
| Backend      | Express + TypeScript                |
| Database     | Cloudflare D1 (SQLite-compatible)   |
| Auth         | JWT                                 |
| Monorepo     | Turborepo + PNPM                    |
| Dev Editor   | Cursor AI                           |

---

## 🧠 Project Design Rules

- Frontend features go in `packages/`, backend logic in `services/`
- Dashboard lives in `packages/web`
- All routes are protected with role-based access (both frontend & backend)
- Shared components live in `ui/`, shared types in `shared/`
- Folders use `kebab-case`, files use `PascalCase` for components

---

## 👣 How to Run

```bash
pnpm install        # Install all dependencies
pnpm dev            # Run frontend + backend in dev mode
```

---

## 🧩 Reusability & Scalability

This EMS system is modular, so:
- Each feature (like User Management or Assets) can be reused in other projects
- Frontend-only packages and backend-only services can scale independently
- You can add new features (e.g., Checklists, Reports) without rewriting existing code