# SnapCart 🛒

SnapCart is a quick delivery website for groceries and foods, designed to provide users with a seamless shopping experience. It focuses on efficiency, scalability, and user satisfaction.

---

![img.png](img.png)

## Features ✨

- **Quick Delivery**: Lightning-fast grocery and food deliveries.
- **Variants Management**: Easily manage product variants on a single product page.
- **Role-Based Access Control**: Admin, seller, and user roles with tailored functionalities.
- **Secure Authentication**: Includes OTP verification for enhanced security.
- **Banner Management**: Manage promotional banners to enhance user engagement.
- **Cart System**: Efficient and scalable cart system using a dedicated collection for better performance.

---

## Tech Stack 🛠

**Frontend**:
- React
- Redux (for state management)
- Tailwind CSS (for styling)

**Backend**:
- Node.js
- Express.js
- MongoDB

**Other Tools**:
- TypeScript (strong typing)
- Axios (API communication)
- Docker (containerization for deployment)
- Nginx (reverse proxy)

---

## Installation 🚀

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Community version 7.0 or higher)
- Docker & Docker Compose

### Clone the repository
```bash
git clone https://github.com/<your-username>/snapcart.git
cd snapcart
```

## Docker Deployment 🐳

To deploy the entire application using Docker, ensure docker-compose.yml is configured correctly, then run:

```bash

docker-compose up --build

```

## API Endpoints 🌐

### Authentication

	•	POST /api/auth/signup - User signup
	•	POST /api/auth/login - User login
	•	POST /api/auth/verify-otp - OTP verification

### Products

	•	GET /api/products - Fetch all products
	•	POST /api/products - Add a new product (Admin only)

### Variants

	•	GET /api/variants/:productId - Fetch variants of a product
	•	POST /api/variants - Add variants to a product

### Cart

	•	GET /api/cart - Fetch cart items
	•	POST /api/cart - Add items to cart


## Project Structure 📂

```bash
snapcart/
  │
  ├── backend/         # Server-side code
  ├── frontend/        # Client-side code
  ├── shared/          # Shared types for backend and frontend
  ├── docker-compose.yml
  └── README.md        # Project documentation
```


## Contributing 🤝

Contributions are welcome! Follow these steps to contribute:
1.	Fork the repository.
2.	Create a new branch: git checkout -b feature/your-feature-name.
3.	Commit your changes: git commit -m "Add your feature".
4.	Push to the branch: git push origin feature/your-feature-name.
5.	Open a pull request.

## License 📜

This project is licensed under the MIT License. See the LICENSE file for details.

Contact 📧

For inquiries, please contact:
Rahil Sardar
Email: rahil.sardar@example.com