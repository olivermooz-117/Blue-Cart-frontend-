## 1. Project Overview

BlueCart Marketplace is a web application that helps users compare product prices across multiple online stores including Amazon, AliExpress, and eBay. The application uses a smart scoring system called Marginal Benefit (MB) and Cost-Benefit (CB) to rank products based on price, customer ratings, and payment safety.

**Live Application:** [https://blue-cart-frontend.vercel.app](https://blue-cart-frontend.vercel.app)

**Backend API:** [https://blue-cart-backend-ynqy.onrender.com](https://blue-cart-backend-ynqy.onrender.com)

---

## 2. Features

| Feature | Description |
|---------|-------------|
| Product Search | Search for products across multiple e-commerce platforms simultaneously |
| Smart Ranking | Products are ranked using MB/CB scores that consider price, ratings, and payment trust |
| Custom Filters | Users can adjust importance of price, rating, and payment safety using sliders |
| User Accounts | Register and login to save search history |
| Search History | View past searches when logged in |
| Mobile Ready | The application works on phones, tablets, and computers |
| Installable | Can be installed as a mobile app on supported devices |

---

## 3. Technology Stack

| Component | Technology Used |
|-----------|-----------------|
| User Interface | React 19 |
| Build Tool | Vite 8 |
| State Management | Redux Toolkit |
| Navigation | React Router v7 |
| HTTP Requests | Axios |
| Styling | CSS |
| Testing | Vitest and Testing Library |
| Progressive Web App | Vite PWA Plugin and Workbox |
| Hosting | Vercel |

---

## 4. System Requirements

Before you begin, ensure you have the following installed:

- Node.js version 20 or higher
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- A web browser (Chrome recommended)

---

## 5. Installation Instructions

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/olivermooz-117/Blue-Cart-frontend
cd Blue-Cart-frontend
Step 2: Install Dependencies
Install all required packages:

bash
npm install
Step 3: Set Up Environment Variables
Create a .env file in the project root:

bash
cp .env.example .env
Open the .env file and set the API URL:

text
VITE_API_URL=http://localhost:5000
Note: If you are connecting to the live backend, use:

text
VITE_API_URL=https://blue-cart-backend-ynqy.onrender.com
Step 4: Start the Development Server
Run the application locally:

bash
npm run dev
The application will open at http://localhost:5173

6. Running Tests
To run the test suite:

bash
npm test
To run tests with coverage report:

bash
npm run test:coverage
The frontend includes 35 passing tests covering:

Redux state management

Component rendering

Page navigation

User interactions

7. Building for Production
To create a production build:

bash
npm run build
The build files will be in the dist folder.

To preview the production build locally:

bash
npm run preview
