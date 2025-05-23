# PG Management System

A comprehensive PG (Paying Guest) management solution built with Expo and React Native.

## Project Status

### Completed Features ✅

1. Project Setup
   - Basic Expo Router configuration
   - Theme support (light/dark mode)
   - Roboto font integration
   - Authentication context
   - Supabase integration

2. Authentication
   - User roles (Admin, Manager, Tenant)
   - Sign in functionality
   - Sign up functionality
   - Secure storage implementation

### In Progress 🚧

1. Authentication & User Roles
   - Email verification system
   - KYC document upload
   - Police clearance verification

2. Database Schema
   - User profiles
   - Room inventory
   - Payments
   - Maintenance requests

### Pending Features ⏳

1. Tenant Portal
   - Document Management
     - KYC document upload with validation
     - Room application submission
   - Financial Management
     - Payment gateway integration
     - Utility bill viewing
     - Payment history
   - Service Requests
     - Complaint management with chat
     - Laundry scheduling
     - Room cleaning booking
     - Guest stay requests
   - Food Services
     - Digital menu
     - Meal opt-out system

2. Admin Portal
   - Application Management
     - Room application workflow
     - KYC verification system
     - Police verification emails
   - Financial Oversight
     - Rent payment tracking
     - Utility bill management
   - Facility Management
     - Complaint handling
     - Inventory management
     - Food menu administration
     - Guest stay processing
   - Analytics Dashboard
     - Financial reports
     - Complaint statistics
     - Occupancy tracking

3. Manager Portal
   - Operational Management
     - Complaint handling
     - Tenant communication
     - Schedule management
   - Food Service Management
   - Inventory Monitoring

## Technical Stack

- Frontend: React Native with Expo
- Backend: Supabase
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Database: PostgreSQL (via Supabase)
- Payment Processing: Stripe

## Development Guidelines

### Styling
- Use `StyleSheet.create` for all styling
- Follow the theme context for colors
- Use Roboto font family:
  - Regular: 'Roboto-Regular'
  - Medium: 'Roboto-Medium'
  - Bold: 'Roboto-Bold'

### Navigation
- Tab-based primary navigation
- Stack navigation for hierarchical flows
- Modal navigation for overlays

### Icons
- Use Lucide icons exclusively
- Import from 'lucide-react-native'

## Environment Setup

Required environment variables:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Next Steps

1. Complete the database schema implementation
2. Set up the authentication flow with email verification
3. Implement the KYC document upload system
4. Create the basic tenant portal interface
5. Set up the payment processing system with Stripe

## Contributing

Follow these guidelines when contributing:
- Use the provided theme context for consistent styling
- Follow the file structure conventions
- Implement proper error handling
- Write meaningful commit messages