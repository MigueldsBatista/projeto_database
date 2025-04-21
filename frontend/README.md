# Hospital Santa Joana - Frontend Application

## Overview
This repository contains the frontend web application for Hospital Santa Joana's patient service portal. The application provides hospitalized patients with a convenient way to order meals, view their invoices, track orders, and manage their profiles.

## Directory Structure
```
frontend/
├── css/             # Stylesheet files
├── js/              # JavaScript files
├── img/             # Image assets
├── index.html       # Entry point
├── dashboard.html   # Patient dashboard
├── menu.html        # Food menu
├── cart.html        # Shopping cart
├── orders.html      # Order history
├── order-details.html  # Order details
├── invoice.html     # Patient invoice
├── profile.html     # User profile
└── login.html       # Authentication page
```

## JavaScript Modules

### utils.js
The core utility library that provides common functions used throughout the application:

- **Toast Notifications**: `showToast()` for displaying temporary notifications
- **Formatting Utilities**: 
  - `formatCurrency()` for Brazilian currency display
  - `formatDate()`, `formatDateTime()`, and `formatRelativeDate()` for date formatting
- **Order Status Utilities**: 
  - `getStatusText()` converts status codes to readable text
  - `getStatusClass()` provides appropriate CSS classes based on status
- **Cart Badge**: `updateCartBadge()` updates the cart count indicators

These utility functions are designed to be reusable across all pages to maintain consistency and reduce code duplication.

### app.js
The main application controller that:

- Initializes the application state (`appState`)
- Manages user authentication via `checkAuth()`
- Loads and stores user data (profile, orders, invoices, room info)
- Provides global navigation and UI functionality
- Handles data fetching from the backend API
- Dispatches events when data is loaded

The app uses a central state management approach, loading data once and making it available across all pages.

### dashboard.js
Controls the patient dashboard interface:

- Displays user information, room details, and a summary of the invoice
- Shows recent orders with their status
- Provides quick access to food categories and key functions
- Implements event listeners for various dashboard actions

### menu.js
Handles the food menu display and ordering:

- Fetches and displays product categories and items
- Implements filtering by category and search functionality
- Provides "add to cart" functionality
- Falls back to offline data if API is unavailable

### cart.js
Manages the shopping cart functionality:

- Displays items added to the cart
- Allows quantity adjustments and item removal
- Calculates subtotal, service fee, and total
- Processes checkout and order submission to the API

### orders.js
Displays the patient's order history:

- Shows all orders with their status
- Enables filtering orders by status (pending, in progress, delivered, cancelled)
- Provides navigation to detailed order views

### order-details.js
Shows detailed information about a specific order:

- Displays order items, quantities, and prices
- Shows order status using standardized status pills
- Calculates and displays order total
- Provides options to contact support or reorder

### profile.js
Manages user profile information:

- Displays user details (name, room, contact info)
- Allows updating personal information
- Handles profile picture upload and display
- Provides password change functionality

### login.js
Handles user authentication:

- Processes login form submission
- Authenticates against the backend API
- Stores user data in localStorage
- Redirects to appropriate dashboard based on user role

### invoice.js
Displays the patient's invoice information:

- Shows invoice total and payment status
- Lists charged items grouped by date
- Provides download and payment options

## CSS Styles

### styles.css
The main stylesheet containing:

- CSS variables for consistent theming (colors, spacing, fonts)
- Base styles and layout components
- Screen container and navigation styling
- Common UI elements like cards, buttons, and headers

### components.css
Reusable UI components including:

- Button variants (primary, secondary, icon buttons)
- Form elements (inputs, labels)
- Cards and badges
- Toast notifications
- Modal dialogs
- Other shared UI components

### dashboard.css
Specific styles for the dashboard interface:

- Welcome card and summary sections
- Category menu items
- Recent orders list
- Status pills and indicators

### orders.css
Styles for the order listings:

- Order card layouts
- Filter tab styling
- Status indicators with appropriate colors
- Empty state displays

### order-details.css
Styling for the detailed order view:

- Order header and status
- Item listings with quantities and prices
- Order summaries and totals
- Status timeline indicators

### cart.css
Shopping cart specific styles:

- Cart item display
- Quantity controls
- Summary section
- Empty cart messaging

### profile.css
User profile page styling:

- Profile header with picture
- Information sections
- Form styles for editing profile data

### invoice.css
Invoice display styling:

- Invoice summary card
- Itemized listings by date
- Payment information section

## How It Works
1. **Authentication**: Users log in via `login.html`, which stores credentials in localStorage
2. **Data Loading**: `app.js` loads core user data on application start
3. **Navigation**: Bottom navigation bar allows movement between main sections
4. **Ordering Flow**:
   - Browse items in `menu.html`
   - Add desired items to cart
   - Review and modify cart in `cart.html`
   - Submit order
   - View order confirmation
   - Track order status in `orders.html`
5. **Profile Management**: Users can update their information in `profile.html`
6. **Invoice Viewing**: Users can see their charges in `invoice.html`

The application is designed to work both online and offline, with fallback mechanisms for API failures. Data is stored in localStorage for persistence across sessions.

## Status Indicators
The application uses consistent color-coded status indicators across all screens:

- **Pending**: Yellow/amber (awaiting processing)
- **In Progress**: Blue (order being prepared)
- **Delivered**: Green (completed successfully)
- **Cancelled**: Red (order was cancelled)

These status indicators help patients easily understand the state of their orders at a glance.

## API Integration
The frontend communicates with the backend API at `http://localhost:8080` to fetch and submit data. The API endpoints used include:

- `/api/auth/*` - Authentication endpoints
- `/api/pacientes/*` - Patient data
- `/api/produtos` - Product catalog
- `/api/pedidos/*` - Order management
- `/api/quartos/*` - Room information

API calls include appropriate error handling and fallbacks to ensure a seamless user experience even when connectivity issues occur.
