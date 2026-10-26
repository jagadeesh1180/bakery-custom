# Bakery Custom

This project is organized into a frontend, backend, and documentation structure.

## Structure

```text
bakery-custom/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── customize.html
│   ├── track-order.html
│   ├── admin.html
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── products.js
│   │   ├── customize.js
│   │   ├── track-order.js
│   │   └── admin.js
│   └── assets/
│       └── images/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js
│   └── middleware/
│       └── errorHandler.js
├── docs/
│   ├── project-report.md
│   └── api-documentation.md
├── .gitignore
└── README.md
```

## Run frontend

Open `frontend/index.html` in a browser.

## Run backend

```bash
cd backend
npm install
npm start
```

## Notes

This is a starter project structure for a bakery custom order portal.
