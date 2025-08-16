# 🔐 EMS User Roles & Access Journeys

This document defines the different user roles supported in the Equipment Maintenance System (EMS), what they can access, and their typical usage journey across the app.

---

## 👤 1. Admin

### 🔓 Access
- Full access to all frontend features and backend services
- Can manage users, roles, assets, checklists, and settings
- Can view all reports and assign work orders

### 🛣️ Journey
1. Logs in to the system via the login screen
2. Lands on the dashboard showing system-wide stats
3. Navigates to "User Management" to view or edit users
4. Registers new technicians, supervisors, asset managers, or clients
5. Creates checklist templates for future use
6. Oversees maintenance calendars and reviews reports

---

## 🧑‍💼 2. Supervisor

### 🔓 Access
- Manage work orders, assign tasks, schedule maintenance
- View reports and technician performance
- Cannot manage users or roles

### 🛣️ Journey
1. Logs in and views dashboard for team performance
2. Goes to "Work Orders" and assigns tasks to technicians
3. Checks progress on scheduled PM and CM tasks
4. Views reports for task completion and technician KPIs

---

## 🔧 3. Technician

### 🔓 Access
- View assigned work orders
- Execute maintenance checklists
- Log time spent and parts used
- Sign off completed work

### 🛣️ Journey
1. Logs in to see tasks assigned to them
2. Clicks into a work order to see required steps
3. Completes checklists step-by-step, logs time, signs off
4. Marks work order as complete

---

## 🧾 4. Asset Manager

### 🔓 Access
- Manage all equipment records
- Add, update, retire equipment assets
- Assign assets to custodians or locations

### 🛣️ Journey
1. Logs in and views "Asset List"
2. Registers a new generator with full details
3. Updates status on equipment (e.g., "Under Maintenance")
4. Assigns asset to a custodian or department

---

## 👁️ 5. Client

### 🔓 Access
- View-only access to assigned assets and work orders
- Cannot create, edit, or assign anything

### 🛣️ Journey
1. Logs in and sees their assets and service history
2. Can view status of ongoing or completed maintenance
3. Receives read-only reports for their own assets

---

## 🧠 Summary Table

| Role           | Users | Assets | Work Orders | Checklists | Reports | Settings |
|----------------|-------|--------|-------------|------------|---------|----------|
| Admin          | ✅ CRUD | ✅ CRUD | ✅ Full     | ✅ Full     | ✅ Full  | ✅ All    |
| Supervisor     | ❌     | ✅ View | ✅ Assign   | ✅ Assign   | ✅ View  | ❌        |
| Technician     | ❌     | ✅ View | ✅ Update   | ✅ Execute  | ❌       | ❌        |
| Asset Manager  | ❌     | ✅ CRUD | ❌          | ✅ Attach   | ❌       | ❌        |
| Client         | ❌     | ✅ View | ✅ View     | ❌          | ✅ View  | ❌        |