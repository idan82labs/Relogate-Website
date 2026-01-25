# User Guide

This guide explains the user journey through the Relogate platform - from registration to receiving your personalized relocation report.

## Table of Contents

- [Getting Started](#getting-started)
- [User Registration](#user-registration)
- [Completing the Questionnaire](#completing-the-questionnaire)
- [Payment Process](#payment-process)
- [Personal Area](#personal-area)
- [Viewing Your Report](#viewing-your-report)
- [Notifications](#notifications)
- [Account Management](#account-management)

---

## Getting Started

Relogate is a relocation assistance platform that helps users find their ideal destination country based on personal circumstances, preferences, and goals. The platform provides personalized recommendations through an AI-powered matching system.

### User Journey Overview

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐    ┌────────────────┐
│  Register   │ -> │  Questionnaire   │ -> │   Payment   │ -> │  View Report   │
│   Account   │    │   (4 steps)      │    │  (Stripe)   │    │  (Personal)    │
└─────────────┘    └──────────────────┘    └─────────────┘    └────────────────┘
```

---

## User Registration

### Creating an Account

1. **Navigate to Registration**: Visit the registration page at `/register`
2. **Enter Your Details**:
   - **Email**: Your email address (will be used for login)
   - **Password**: Secure password (minimum 8 characters)
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Phone**: Contact phone number (Israeli format supported)

3. **Submit Registration**: Click the registration button
4. **Email Verification**: Check your email for a verification link (if enabled)

### Login

1. Navigate to `/login`
2. Enter your registered email and password
3. Click "Login"
4. You'll be redirected to your personal area or the questionnaire

### Password Reset

If you've forgotten your password:
1. Click "Forgot Password" on the login page
2. Enter your registered email
3. Check your email for the reset link
4. Create a new password

---

## Completing the Questionnaire

The questionnaire collects information to generate your personalized relocation recommendations. It consists of 4 main steps.

### Step 1: Country Selection

Select the countries you're interested in relocating to:
- Browse the list of available destination countries
- Click on countries to select/deselect them
- You can select multiple countries
- Each country displays a flag and name in Hebrew

**Tip**: Select all countries you're potentially interested in - the system will rank them based on your profile.

### Step 2: Relocation Reason

Indicate why you're considering relocation:
- **Work**: Career opportunities, remote work
- **Lifestyle**: Quality of life improvements
- **Education**: Study abroad opportunities
- **Family**: Family reunification or relocation
- **Other**: Other personal reasons

Select the primary reason that best describes your situation.

### Step 3: Family Status

Provide information about your family situation:
- **Single**: Individual relocation
- **Married**: Relocating as a couple
- **Married with Children**: Family relocation with children

This information helps tailor recommendations for visa types, cost of living, and lifestyle considerations.

### Step 4: Personal Details

Complete your profile information:
- **Full Name**: First and last name
- **Email**: Contact email
- **Phone**: Contact phone number
- **Citizenship**: Your current citizenship(s)

### Saving Progress

- Your progress is automatically saved as you complete each step
- You can close the browser and return later - your progress will be preserved
- Navigate between steps using the "Continue" and "Back" buttons

### Completing the Questionnaire

Once you've filled in all required information:
1. Review your answers on the final step
2. Click "Submit" to complete the questionnaire
3. You'll be redirected to the payment page

---

## Payment Process

### Initiating Payment

After completing the questionnaire:
1. You'll see a summary of your questionnaire
2. Click "Continue to Payment" to proceed
3. You'll be redirected to the secure Stripe checkout

### Checkout Process

The payment is processed securely through Stripe:
1. **Enter Card Details**: Card number, expiry date, CVV
2. **Billing Information**: Address (if required)
3. **Review Amount**: Verify the payment amount
4. **Complete Payment**: Click "Pay" to process

### Payment Confirmation

After successful payment:
- You'll receive an email confirmation
- Your personal area will be updated
- The admin team will begin preparing your report
- You'll receive a notification when your report is ready

### Payment Status

Track your payment status in the Personal Area:
- **Pending**: Payment is being processed
- **Completed**: Payment successful
- **Failed**: Payment failed (try again or contact support)
- **Refunded**: Payment has been refunded

---

## Personal Area

The Personal Area (`/personal-area`) is your dashboard for managing your Relogate experience.

### Dashboard Overview

The personal area displays:
- **Profile Summary**: Your basic information
- **Questionnaire Status**: Current status of your questionnaire
- **Report Status**: Availability of your personalized report
- **Payment History**: Your payment records
- **Notifications**: Important updates and messages

### Questionnaire Management

From the personal area, you can:
- **View Current Questionnaire**: See your submitted answers
- **Update Questionnaire**: Modify your responses (if allowed)
- **Start New Questionnaire**: Begin a fresh questionnaire (archives the previous one)

### Migration to New Version

If you have an older questionnaire version:
- You'll be prompted to migrate to the new format
- The migration preserves your existing answers
- New questions may be added for improved recommendations

---

## Viewing Your Report

### Report Availability

Your personalized report becomes available after:
1. Questionnaire completion
2. Payment processing
3. Admin review and publication

You'll receive a notification when your report is ready.

### Report Contents

The report includes:

#### Greeting Section
- Personalized opening message
- Summary of your profile

#### Destination Recommendations
For each recommended country:
- **Match Score**: Percentage match with your profile (0-100%)
- **Country Overview**: Introduction to the destination
- **Visa Information**: Recommended visa type and requirements
- **Match Reasons**: Why this country suits you
- **Narrative Sections**: Detailed personalized content about:
  - Living experience
  - Work opportunities
  - Family considerations
  - Cost of living
  - Quality of life

### Navigating the Report

- **Country Cards**: Click to expand detailed information
- **Score Circles**: Visual representation of match percentage
- **Section Navigation**: Browse different aspects of each destination

---

## Notifications

### Notification Types

You may receive notifications for:
- **Report Ready**: Your personalized report is available
- **Destination Added**: New destination added to your report
- **Questionnaire Reminder**: Reminder to complete your questionnaire
- **System Updates**: Platform updates and announcements

### Viewing Notifications

1. Access notifications from your Personal Area
2. Unread notifications are highlighted
3. Click on a notification to view details
4. Mark as read to dismiss

### Managing Notifications

- **View All**: See your complete notification history
- **Mark as Read**: Clear notification indicators
- **Delete**: Remove old notifications

---

## Account Management

### Profile Settings

Access your profile settings to:
- Update personal information
- Change contact details
- Modify preferences

### Security

Keep your account secure:
- Use a strong, unique password
- Don't share your login credentials
- Log out from shared devices

### Language

The platform is primarily in Hebrew (RTL layout). All user-facing content is displayed in Hebrew.

---

## Getting Help

### Support Channels

If you need assistance:
1. **Contact Form**: Available on the website
2. **Email**: Contact support directly
3. **FAQ**: Check the frequently asked questions section

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't log in | Reset your password via "Forgot Password" |
| Payment failed | Check card details or try a different card |
| Report not showing | Check your email for status updates |
| Questionnaire issues | Contact support for assistance |

---

## Privacy & Data

### Data Collection

Relogate collects:
- Profile information (name, email, phone)
- Questionnaire responses
- Payment information (processed by Stripe)

### Data Use

Your data is used to:
- Generate personalized recommendations
- Process payments
- Send relevant notifications
- Improve the platform

### Data Protection

- Passwords are securely hashed
- Payment data is handled by Stripe (PCI compliant)
- Personal data is stored securely in Supabase
