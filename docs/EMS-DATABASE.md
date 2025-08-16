# 🗄️ EMS Database & Hosting Strategy

This document explains the current database setup for EMS, the long-term plan to use **Cloudflare D1** (SQLite-compatible serverless DB), and the best practices Windsurf should always follow when handling database logic.

---

## 📌 Current Database Setup
- **Technology:** SQLite (local development)  
- **Migration Tool:** Drizzle ORM + migrations  
- **Location:** Each backend service (`user-management-service`, `equipment-management-service`) has its own `drizzle/` folder and `drizzle.config.ts`.  
- **State:**  
  - `dev.db` for local development  
  - `schema.ts` defines tables & relationships  
  - Migration scripts (`migrate.ts`, `seed.ts`) included  

---

## ☁️ Future Hosting Plan
- **Hosting:** Cloudflare Workers for backend services  
- **Database:** Cloudflare D1 (SQLite-compatible, but cloud-hosted & scalable)  
- **Advantages:**  
  - No server maintenance  
  - Edge-distributed (low latency)  
  - Compatible with Drizzle ORM (smooth migration)  
- **Migration Path:**  
  1. Develop locally with SQLite (`dev.db`)  
  2. Use Drizzle migrations to keep schemas in sync  
  3. Deploy to D1 by pointing Drizzle to Cloudflare environment bindings  
  4. Maintain a single source of truth for schema (`schema.ts`)  

---

## ✅ Best Practices for Database Management
Windsurf should always follow these principles:  

### 1. **Schema Management**
- All schema changes must be defined in `schema.ts`.  
- Generate migrations with Drizzle CLI — never manually edit `dev.db`.  
- Use version-controlled migrations under `drizzle/` folder.  

### 2. **CRUD Safety**
- Always implement **Create, Read, Update, Delete (CRUD)** operations with:  
  - Validation (using `zod` schemas from `packages/shared/validation/`)  
  - Role-based restrictions (e.g., only Admin can delete a user)  
- Confirm destructive actions (delete, retire) with a confirmation modal in UI.  

### 3. **Data Isolation & Multi-User Safety**
- Always include **`userId` scoping** in queries to prevent cross-user data leakage.  
- Example:  
  ```ts
  const tasks = db.select().from(tasks).where(eq(tasks.userId, req.user.id));
  ```  

### 4. **Audit & Soft Deletes**
- For assets and users:  
  - Use a `status` column (`active`, `inactive`, `retired`) instead of hard deletes.  
  - Keep audit fields: `createdAt`, `updatedAt`, `retiredAt`.  

### 5. **Error Handling**
- Backend: Always wrap DB ops in `try/catch` and return friendly error messages.  
- Frontend: Show toasts/alerts instead of raw error dumps.  

### 6. **Security**
- Never expose raw SQL or IDs in frontend.  
- Use UUIDs for asset/user IDs where possible.  
- Restrict queries based on role. Example:  
  - Client → can only read their own assets.  
  - Technician → can only update assigned work orders.  
  - Admin → full access.  

---

## 📖 Example: User Lifecycle in DB
1. **Add User** → Insert row with `status = 'pending'`.  
2. **Approve User** → Update `status = 'active'`, assign role.  
3. **Edit User** → Update fields in row (email, name, role).  
4. **Deactivate User** → `status = 'inactive'` (kept for records).  
5. **Delete User** (Admin only) → Soft delete recommended (status update).  

---

## 📖 Example: Asset Lifecycle in DB
1. **Add Asset** → Insert with metadata, custodian, QR code reference.  
2. **Edit Asset** → Update info, location, custodian.  
3. **Retire Asset** → `status = 'retired'` but record preserved.  
4. **Delete Asset** (rare, Admin only) → Soft delete recommended.  
5. **QR Code Binding** → QR encodes asset ID → resolved to asset details page.  

---

## 🔮 Long-Term Database Evolution
- Short term: SQLite for local dev  
- Medium term: Migrate schema + migrations to Cloudflare D1  
- Long term: Add support for **edge caching** + **replicated reads** to scale  

---

📌 **Reminder for Windsurf:**  
When editing backend code, **never hardcode DB logic** outside services.  
Always:  
- Use Drizzle ORM  
- Use migrations for schema updates  
- Follow CRUD + validation rules  
- Respect user roles in queries  
