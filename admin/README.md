# TamZen Custom Admin Panel

A custom, clean, beginner-friendly admin application built with Next.js 15 and Tailwind CSS for managing the TamZen jewelry boutique.

## Features
- **Modern Light Dashboard**: Designed specifically for non-technical boutique owners without Medusa's complex setting clutter.
- **Secure Admin Authentication**: Authenticates with Medusa's `/auth/user/emailpass` API and uses secure HTTP-only cookies.
- **Essential Screens**:
  - **Dashboard Overview**: Key metrics (Products, Orders, Revenue, Categories) and recent activity.
  - **Products**: Simple product table with live search, category filtering, instant delete, and status badges.
  - **Single-Page "Add Product"**: One simple form for Title, Description, EUR Price, Category, Stock, Image uploads, and Published toggle. Automatically assigns sales channels behind the scenes so items appear on the storefront immediately.
  - **Edit Product**: Modify price, stock, category, images, or status.
  - **Categories**: Create, edit, and delete store categories.
  - **Orders**: View order details, line items, delivery addresses, and update fulfillment status.
  - **Settings**: Store identity, contact details, and backend connectivity status.

## Running Locally

```bash
cd admin
npm install
npm run dev
```

The admin portal will be running at [http://localhost:7001](http://localhost:7001).

### Default Credentials
- **Email**: `admin@tamzen.shop`
- **Password**: `supersecret`
