# Equipment Maintenance System (EMS)

A modern, full-stack equipment maintenance and asset management system built with Next.js, TypeScript, and a microservices architecture.

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: Next.js 14 with TypeScript and Mantine UI
- **Backend Services**: Express.js microservices
- **Database**: SQLite with Drizzle ORM
- **Package Management**: pnpm with workspaces

## 📁 Project Structure

```
EMS/
├── apps/
│   └── web/                 # Next.js frontend application
├── packages/
│   ├── shared/             # Shared types and utilities
│   ├── ui/                 # Shared UI components
│   ├── user-management/    # User management package
│   └── equipment-asset-management/  # Asset management package
├── services/
│   ├── user-management-service/     # User & auth microservice
│   └── equipment-management-service/ # Equipment microservice
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EMS
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   ```bash
   # Seed the user management database
   cd services/user-management-service
   pnpm run db:seed
   cd ../..
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start user management service
   cd services/user-management-service
   pnpm run dev

   # Terminal 2: Start web application
   cd apps/web
   pnpm run dev
   ```

5. **Access the application**
   - Web App: http://localhost:3000
   - User API: http://localhost:3001

## 🔐 Authentication & User Management

The system uses JWT-based authentication with role-based access control (RBAC) and admin approval workflow for new users.

### Default Users

After seeding, you can log in with:

- **Admin**: admin@ems-demo.com / password123
- **Asset Manager**: sarah.wilson@ems-demo.com / password123
- **Supervisor**: mike.johnson@ems-demo.com / password123
- **Technician**: john.smith@ems-demo.com / password123
- **Client**: robert.brown@ems-demo.com / password123

### User Roles & Permissions

- **Administrator**: Full system access, user management, approve/reject registrations
- **Asset Manager**: Asset management, reporting, view all assets
- **Supervisor**: Team oversight, maintenance scheduling, view team assets
- **Technician**: Equipment maintenance, work orders, update asset status
- **Client**: View assigned assets, submit maintenance requests

### Registration Process

1. New users register via the signup form with contact details
2. Account is created with "pending" status
3. Admin receives notification and reviews the registration
4. Admin approves/rejects the account
5. User receives notification and can log in if approved

## 🏭 Asset Management

### Features
- **Asset Catalog**: Complete listing with search and filtering
- **Asset Details**: Comprehensive information including specifications, maintenance history
- **QR Code Integration**: Generate and download QR codes for quick asset access
- **Asset Status Tracking**: Real-time status updates (Active, In Repair, Inactive)
- **Location Management**: Track asset locations across facilities

### Asset Information
- Basic details (name, model, serial number)
- Manufacturer and purchase information
- Warranty and maintenance schedules
- Assigned technicians
- Cost and category classification
- High-resolution images

## 🎨 UI/UX Design

### Theme & Branding
- **Primary Color**: #1E88E5 (EMS Blue)
- **Design System**: Mantine UI components
- **Typography**: Inter font family
- **Responsive**: Mobile-first design approach

### Key Pages
- **Landing Page**: Modern hero section with feature highlights
- **Dashboard**: Role-based overview with quick actions
- **Asset Listing**: Grid/list view with advanced filtering
- **Asset Details**: Comprehensive asset information with QR codes
- **User Management**: Admin interface for user approval and role management

## 🛠️ Development

### Available Scripts

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
