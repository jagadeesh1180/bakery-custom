# Bakery Custom Order Portal

A full-stack bakery website where customers can browse available products, submit custom cake orders, and track orders using a unique tracking ID.

**Repository:** https://github.com/jagadeesh1180/bakery-custom

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [End-to-end workflow](#end-to-end-workflow)
- [Project structure](#project-structure)
- [Database design](#database-design)
- [API reference](#api-reference)
- [Run locally](#run-locally)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security and limitations](#security-and-limitations)

## Features

- Browse products marked as available in MongoDB.
- Display product names, descriptions/categories, prices, and optional images.
- Submit custom orders with contact details, product type, flavor, occasion, and special instructions.
- Generate a unique tracking ID when an order is saved.
- Look up an order's status and basic details using its tracking ID.
- Separate static frontend and API backend deployments.

**Current limitation:** The admin page is currently a placeholder. An authenticated admin dashboard and order-status management interface are not implemented.

## Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Product catalogue, custom-order form, order tracking |
| Backend | Node.js, Express.js | HTTP API, validation, and request handling |
| Database | MongoDB Atlas | Stores product and order documents |
| ODM | Mongoose | Database schemas, validation, and queries |
| Frontend hosting | Vercel | Publishes static frontend files |
| Backend hosting | Render | Runs the Express API |
| Source control | Git, GitHub | Stores code and tracks changes |

## Architecture

```text
Customer browser
   | loads HTML, CSS and JavaScript
   v
Frontend on Vercel
   | HTTPS requests to /api/...
   v
Express API on Render
   | Mongoose queries and writes
   v
MongoDB Atlas
   |-- products collection
   `-- orders collection
```

The browser does not connect directly to MongoDB. It calls the backend API, and the backend uses the private MONGODB_URI environment variable to connect to Atlas.

## End-to-end workflow

### 1. Website loads

Vercel serves the static files from the frontend directory. The file frontend/config.js defines the backend base URL in window.BAKERY_API_BASE_URL. Frontend JavaScript uses that value to send requests to the API.

### 2. Product catalogue loads

1. The products page runs frontend/js/products.js.
2. The browser sends GET /api/products to the Render backend.
3. backend/routes/productRoutes.js queries the Product model for documents where available is true.
4. Mongoose reads products from MongoDB Atlas and sorts them by category and name.
5. The API returns JSON in the format { "products": [...] }.
6. The frontend renders the name, description or category, price, and image if a valid image URL exists.

**Adding a product:** Insert a document into the Atlas products collection in the database specified by MONGODB_URI. The required fields are name, category, and numeric price. Optional fields are description, image, and available. Set available to true for the product to appear in the public catalogue. An empty image field means the product renders without an image.

### 3. Customer submits a custom order

1. The customer fills out frontend/customize.html.
2. frontend/js/customize.js collects the form values and sends a JSON POST request to /api/orders.
3. The backend validates the required fields: customerName, phone, productType, and flavor.
4. The Mongoose Order model saves the order in MongoDB Atlas.
5. The schema generates a unique tracking ID and defaults the status to pending. Creation and update timestamps are added automatically.
6. The API returns a success message and tracking ID, which the frontend displays to the customer.
7. The customer should save the tracking ID for later use.

If validation or database access fails, the frontend displays an error message.

### 4. Customer tracks an order

1. The customer enters the tracking ID on frontend/track-order.html.
2. frontend/js/track-order.js sends GET /api/orders/track/:trackingId.
3. The backend normalizes the ID to uppercase and searches the orders collection.
4. If found, the API returns the tracking ID, product type, flavor, status, and creation time. If no order matches, it returns a not-found response.
5. The frontend displays the result.

### 5. Code changes are deployed

1. Code is committed to the GitHub repository.
2. If the Vercel and Render services are connected to the repository and configured for automatic deployment, new commits can trigger deployments.
3. Vercel serves the frontend; the frontend calls the Render URL configured in frontend/config.js.
4. Render reads MONGODB_URI and FRONTEND_URL from its environment variables.
5. The backend connects to MongoDB Atlas before it starts accepting requests.

Always verify the latest deployment status and logs in Vercel and Render; a GitHub commit alone does not prove that deployment succeeded.

## Project structure

```text
bakery-custom/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── customize.html
│   ├── track-order.html
│   ├── admin.html
│   ├── config.js
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── products.js
│   │   ├── customize.js
│   │   ├── track-order.js
│   │   └── admin.js
│   └── assets/images/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/db.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   └── middleware/errorHandler.js
├── docs/
│   ├── project-report.md
│   └── api-documentation.md
└── README.md
```

## Database design

The configured deployment currently uses a database named test. The database name is determined by the MongoDB connection URI, so confirm it when setting up another environment.

### Product

| Field | Type | Purpose |
|---|---|---|
| name | String, required | Product name |
| description | String, optional | Product details; defaults to empty |
| category | String, required | Category, such as Cakes or Cookies |
| price | Number, required, minimum 0 | Product price |
| image | String, optional | Publicly accessible image URL |
| available | Boolean, defaults to true | Controls catalogue visibility |
| createdAt / updatedAt | Date | Automatically generated timestamps |

### Order

| Field | Type | Purpose |
|---|---|---|
| trackingId | String, unique | Generated order lookup ID |
| customerName | String, required | Customer name |
| phone | String, required | Contact number |
| email | String, optional | Contact email |
| productType | String, required | Requested product |
| flavor | String, required | Requested flavor |
| occasion | String, optional | Event or occasion |
| instructions | String, optional | Special instructions |
| status | String | Defaults to pending |
| createdAt / updatedAt | Date | Automatically generated timestamps |

Allowed order status values are pending, confirmed, preparing, ready, completed, and cancelled. The current public API creates orders and reads tracking information; it does not provide an admin API to update status.

## API reference

**Production base URL:** https://bakery-custom-api.onrender.com

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | Check that the API is running |
| GET | /api/health | Check API status and database connection |
| GET | /api/products | List available products |
| GET | /api/products/:id | Get one available product by MongoDB ObjectId |
| POST | /api/orders | Create a custom order |
| GET | /api/orders/track/:trackingId | Find an order by tracking ID |

### Example order request

POST /api/orders with a JSON body:

```json
{
  "customerName": "Example Customer",
  "phone": "9000000000",
  "email": "customer@example.com",
  "productType": "Birthday Cake",
  "flavor": "Chocolate",
  "occasion": "Birthday",
  "instructions": "Please write Happy Birthday on the cake."
}
```

Example response (tracking ID and timestamp are generated by the server):

```json
{
  "message": "Order saved successfully",
  "trackingId": "A1B2C3D4E5F6",
  "order": {
    "trackingId": "A1B2C3D4E5F6",
    "customerName": "Example Customer",
    "productType": "Birthday Cake",
    "flavor": "Chocolate",
    "status": "pending",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

## Run locally

### Prerequisites

- Node.js and npm
- Git
- A MongoDB Atlas cluster or another accessible MongoDB deployment

### 1. Clone the repository

```bash
git clone https://github.com/jagadeesh1180/bakery-custom.git
cd bakery-custom
```

### 2. Install and configure the backend

```bash
cd backend
npm install
```

Create backend/.env with your own values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/test?retryWrites=true&w=majority
FRONTEND_URL=http://127.0.0.1:5500,http://localhost:5500
```

Replace the URI placeholders with your Atlas connection details. URL-encode special characters in credentials if needed. Configure Atlas database access and network access to allow the backend connection. Never commit real credentials to GitHub.

Start the API:

```bash
npm start
```

The backend starts after connecting to MongoDB. With the example port, check http://localhost:5000/ and http://localhost:5000/api/health.

### 3. Run the frontend

The frontend is static HTML, CSS, and JavaScript. Set frontend/config.js to use the local API while developing:

```js
window.BAKERY_API_BASE_URL = 'http://localhost:5000';
```

Serve the frontend directory using a local static server, such as VS Code Live Server. Add the exact origin shown in your browser to FRONTEND_URL in backend/.env, then restart the backend. If the local server uses another port, update FRONTEND_URL to match it.

Before deploying the frontend, make sure frontend/config.js points to the production Render backend URL.

## Deployment

### Backend on Render

1. Connect the GitHub repository to a Render Web Service.
2. If using a monorepo setup, set the service root directory to backend.
3. Use npm install as the build command and npm start as the start command.
4. Configure these environment variables:
   - MONGODB_URI: the Atlas connection URI, including the intended database name.
   - FRONTEND_URL: the exact production frontend origin, for example https://your-project.vercel.app. Multiple origins can be comma-separated.
   - NODE_ENV: production (recommended).
   - PORT: Render supplies the port; the code has a fallback for local use.
5. Deploy and inspect logs. Confirm that MongoDB connects and the API starts successfully.

### Frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Configure the project root/output settings to serve the static site from frontend; exact settings depend on the Vercel project configuration.
3. Verify frontend/config.js points to the deployed Render API.
4. Deploy and test the product catalogue, order form, and tracking page.
5. For future changes, verify the deployment reaches Ready and hard-refresh the website.

### MongoDB Atlas

1. Create a database user with appropriate access.
2. Configure Atlas network access for the backend.
3. Add product documents to the products collection.
4. Orders are inserted into the orders collection when customers submit the form.
5. Keep the connection URI in Render environment variables, never in frontend JavaScript.

## Troubleshooting

| Problem | What to check |
|---|---|
| Products cannot load | Check /api/health, Render status/logs, the frontend API URL, CORS settings, and browser network errors. |
| Product list is empty | Verify the database name in MONGODB_URI, confirm documents exist in products, and ensure available is true. |
| Product image is blank | Check that image contains a valid, publicly accessible URL. Empty image values are intentionally not rendered. Test the URL directly in a browser. |
| Order submission fails | Check required fields, Render logs, Atlas connectivity, and the browser network response. |
| Tracking ID is not found | Use the exact ID shown after successful submission. |
| Browser shows a CORS error | Ensure FRONTEND_URL exactly matches the deployed frontend origin, including https and hostname, with no page path. Restart or redeploy the backend after changes. |
| Latest code is not visible | Confirm the GitHub commit and Vercel/Render deployment status, then hard-refresh the browser. |

## Security and limitations

- Never commit .env files, database credentials, or private keys.
- Keep MONGODB_URI on the backend; it must not be included in frontend JavaScript.
- Use a least-privilege MongoDB database user and configure network access deliberately.
- The current tracking endpoint returns order details based on a tracking ID without customer authentication. Treat IDs as private; consider adding verification before using this with real customer data.
- The admin page is not protected by authentication because admin functionality is not implemented yet.
- No automated test suite is currently described in this repository.

## Future improvements

- Build an authenticated admin dashboard to review orders and update status.
- Add API rate limiting and stronger input validation.
- Add automated backend and frontend tests.
- Add order confirmation notifications and payment integration if needed.
- Add image fallbacks and image upload/storage management.
- Improve accessibility and error reporting.

## License

No license file is currently documented. Add a LICENSE file if you intend to publish the project for reuse.
