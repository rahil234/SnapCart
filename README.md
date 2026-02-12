# SnapCart

SnapCart is a quick delivery website for groceries and foods, designed to provide users with a seamless shopping
experience. It focuses on efficiency, scalability, and user satisfaction.

---

### Desktop View

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px;">
  <img src="docs/img.png" alt="Image Description" style="border-radius: 10px;">
</div>

### Mobile View

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px;">
  <img src="docs/IMG_2.jpg" alt="Image Description" style="width: 300px; border-radius: 10px;">
</div>

---

## Features ✨

- **Quick Delivery**: Lightning-fast grocery and food deliveries.
- **Variants Management**: Easily manage product variants on a single product page.
- **Role-Based Access Control**: Admin, seller, and customer roles with tailored functionalities.
- **Secure Authentication**: Includes OTP verification for enhanced security.
- **Banner Management**: Manage promotional banners to enhance user engagement.
- **Cart System**: Efficient and scalable cart system using a dedicated collection for better performance.

---

## Tech Stack 🛠

**Frontend**:

- React
- React Router (for routing)
- Redux (for state management)
- Tailwind CSS (for styling)
- Shadcn UI (for UI components)

**Backend**:

- Node.js
- Nest.js (for building the API)
- PostgreSQL (for database)
- Redis

## Project Structure 📂

This Project follows [Turborepo](https://turborepo.dev/docs).

```bash
snapcart/
  │
  ├── apps /
  │   ├── web / (React application)
  │   └── api / (Nest.js backend)
  ├── docker-compose.yml
  └── README.md
```

---

## Installation 🚀

### Prerequisites

- Node.js (v22 or higher)
- Postgres (v15 or higher)
- Docker & Docker Compose

### Clone the repository

```bash
git clone https://github.com/rahil234/snapcart.git
cd snapcart
```

## Docker Deployment 🐳

To deploy the entire application using Docker, ensure docker-compose.yaml is configured correctly, then run:

```bash

docker compose up

```

---

## API Documentation 🌐

Full API documentation is available via Swagger UI:

**Live API Docs**: [https://api.snapcart.live/api/docs](https://api.snapcart.live/api/docs)

---

Contact 📧

For inquiries, please contact:
Rahil Sardar
Email: rahilsardar234@gmail.com