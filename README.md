# Chikenpedia: Premium Fried Chicken E-Commerce

Chikenpedia is a high-performance, full-stack e-commerce platform designed for a premium fried chicken company. Built with a modern glassmorphic aesthetic and a robust containerized architecture, it delivers a cinematic shopping experience from browsing to checkout.

![Professional Hero Section](./frontend/public/images/hero.png)

## Features

- **Cinematic Frontend**: A beautifully crafted Next.js storefront featuring high-resolution food photography, smooth fadeInUp animations, and a responsive glassmorphism UI.
- **Dynamic Shopping Cart**: A functional side-drawer cart system with real-time total calculations and quantity management.
- **Dual-Database Architecture**:
  - **PostgreSQL**: Stores relational product data, inventory, and menu details.
  - **MongoDB**: Handles semi-structured order data and transaction logs for high scalability.
- **Admin Control Panel**: A dedicated administrative dashboard for real-time monitoring of metrics, product inventory management, and live order tracking.
- **Full Docker Integration**: Orchestrated with Docker Compose for seamless one-command deployment of the entire stack (Frontend, Backend, Postgres, Mongo, and pgAdmin).
- **Integrated DB Management**: Built-in **pgAdmin4** service for easy PostgreSQL visualization and management.

## Technology Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), TypeScript, Vanilla CSS.
- **Backend**: [Node.js](https://nodejs.org/), Express.
- **Databases**: [PostgreSQL](https://www.postgresql.org/), [MongoDB](https://www.mongodb.com/).
- **DevOps**: [Docker](https://www.docker.com/), Docker Compose.

## Project Structure

```text
henpedia/
├── frontend/        # Next.js Storefront
├── backend/         # Express API & Admin UI
├── pgadmin/         # pgAdmin Configurations
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker & Docker Compose installed on your machine.

### Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chikenpedia.git
   cd chikenpedia
   ```
2. Start the full stack:
   ```bash
   docker compose up --build -d
   ```
3. Access the services:
   - **Storefront**: [http://localhost:7503](http://localhost:7503)
   - **Admin Dashboard**: [http://localhost:8080/admin/](http://localhost:8080/admin/)
   - **pgAdmin**: [http://localhost:5051](http://localhost:5051) (`admin@admin.com` / `admin123`)

## Development

The backend automatically initializes the PostgreSQL schema and seeds the initial menu items on first run. Orders placed on the frontend are transmitted to the backend and persisted in the MongoDB `orders` collection.

---
*Crafted for fried chicken lovers everywhere.*
