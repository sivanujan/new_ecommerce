# TamZen Custom Admin Dashboard

A bespoke, dark-luxury admin management application built for the **TamZen** jewelry atelier. Completely replaces the complex default Medusa admin with an intuitive, beginner-friendly experience tailored for boutique store owners.

---

## 🎨 Design System & Aesthetics

- **Luxury Palette**: Dark obsidian background (`#0A0A0C` page, `#121217`/`#181820` card surfaces), rich metallic gold accents (`#D4AF37`), warm cream typography (`#F5F0E8`), and muted silver-grey subtext (`#9CA3AF`).
- **Typography**: Editorial serif headings (`font-serif`) for luxury branding paired with clean modern sans-serif (`Inter`) for data scannability.
- **Jargon-Free UI**: Plain English labels designed for artisans and boutique managers (e.g. *Live on Store / Hidden Draft* instead of *Published / Draft*, *Stock Quantity* instead of *Inventory Levels*, *Collections* instead of *Sales Channels / Tax Regions*).
- **Interactive Polish**: Toast notifications (`useToast`), custom confirmation dialogs, skeleton loaders, and responsive layouts across desktop, tablet, and mobile (collapsible sidebar + mobile tab bar).

---

## 🏗️ Architecture & Security

- **Independent Next.js App**: Runs isolated in `/admin` on port **7001**, preserving all existing Medusa backend routes, storefront, cart, checkout, and payment flows intact.
- **Server-Side API Proxying**: All Medusa Admin API requests route through server actions and server-side route handlers (`/api/auth/login`, `/api/upload`, `src/lib/actions.ts`). Admin JWT tokens and secrets are stored in secure `httpOnly` cookies and **never** exposed to the client browser.
- **Medusa v2 Compatibility**: Fully wired to Medusa v2 `/admin` endpoints (products, categories, orders, customers, uploads, stores, users).

---

## 🚀 How to Run the Admin App

### 1. Ensure Medusa Backend is Running
The admin app talks directly to the local Medusa backend at `http://localhost:9000`:

```bash
cd medusa
npx medusa develop --no-lint
```

### 2. Start the Admin Dashboard App
In a separate terminal:

```bash
cd admin
npm install
npm run dev
```

The custom admin dashboard is available at:
👉 **[http://localhost:7001](http://localhost:7001)**

---

## 🔑 Default Credentials & Creating Admin Users

### Default Demo Credentials
- **Email**: `admin@tamzen.shop`
- **Password**: `supersecret`

*(A one-click "Use Demo Admin Credentials" autofill button is also available directly on the login page for convenience).*

### How to Create a New Admin User
To provision a brand-new administrator with Medusa's CLI:

```bash
cd medusa
npx medusa user --email yourname@tamzen.shop --password YourStrongPassword123
```

The newly created user will immediately be able to sign in at `http://localhost:7001/login`.

---

## 📱 Feature Overview by Screen

### 1. Login (`/login`)
- Centered luxury card with embossed TamZen jewelry branding.
- Email and password inputs with a reveal/hide password toggle.
- Friendly inline error feedback for invalid credentials.
- One-click demo credentials autofill button.

### 2. Dashboard Overview (`/`)
- **4 Stat Cards**: Revenue this month (€ EUR), Total Orders, Live Catalog Pieces, and Registered Collectors.
- **Interactive 30-Day Sales Chart**: Custom SVG spline curve with golden gradient fill, hover points, and tooltip showing daily volume and order counts.
- **Recent Customer Orders Table**: Live view of recent orders with status pills and direct management links.
- **Low-Stock Inventory Alerts**: Automatic detection of pieces with stock $\le 25$, warning indicators, and one-click restocking links.

### 3. Products Management (`/products`, `/products/new`, `/products/[id]/edit`)
- **Catalog Table**: High-resolution image thumbnails, piece name, collection, price in EUR, live stock count, status badges (*Live / Hidden*), live search, category filter, and pagination.
- **Unified Add/Edit Page**:
  - Name and rich description.
  - Selling price in EUR and optional compare-at original price (for sales discounts).
  - Category selector and studio stock count.
  - Drag-and-drop multi-image upload with thumbnail reordering (move left/right) and cover badge.
  - Live / Hidden toggle switch.
  - Expandable options section (*"+ Add Options"* for ring sizes, chain lengths, metal finishes).
  - **Zero-Configuration Behind the Scenes**: Automatically attaches to the default sales channel, EUR price list, and inventory so newly created items appear **immediately** on the live customer storefront (`http://localhost:8000/fr/store`).
  - Delete with custom confirmation modal.

### 4. Categories & Collections (`/categories`)
- List of boutique categories with live product count badges (*"14 Pieces"*).
- Optional banner image upload and description.
- Add and edit modal with full form validation and instant updates.
- Delete category with confirmation modal (safely detaches without deleting pieces).

### 5. Orders & Fulfillment (`/orders`, `/orders/[id]`)
- **Orders List**: Filter tabs (*All, Processing, Shipped, Delivered, Cancelled*), live customer search, and financial totals in EUR.
- **Order Details View**:
  - Item list with thumbnails, options, quantities, and line totals.
  - Collector contact details (name, email, phone).
  - Full shipping address destination.
  - Financial breakdown (subtotal, shipping, taxes, total EUR).
  - **One-Click Actions**:
    - **Mark as Shipped**: Opens modal to enter optional carrier tracking number (DHL, FedEx, La Poste).
    - **Mark as Delivered**: Instantly updates order to completed status.
    - **Cancel Order**: Confirmation modal to cancel an order safely.

### 6. Customer Directory (`/customers`)
- Directory of registered collectors and client checkout accounts.
- Metrics per customer: orders count, lifetime spend (€ EUR), and account date.
- **Customer Profile Drawer**: Full contact information, lifetime value, and order history with direct links to past orders.

### 7. Boutique Settings (`/settings`)
- **Boutique Identity**: Edit store brand name and customer contact email (saved to Medusa store API).
- **Change Admin Password**: Secure password update form verifying current password and enforcing minimum length.
- **System Health Monitor**: Live status cards for Medusa Backend (`http://localhost:9000`), Storefront (`http://localhost:8000/fr`), and Admin App.
