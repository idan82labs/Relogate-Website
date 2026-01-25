# Admin Guide

This guide explains the admin workflows for managing the Relogate platform, including user management, report creation, content management, and payment oversight.

## Table of Contents

- [Admin Access](#admin-access)
- [Admin Dashboard Overview](#admin-dashboard-overview)
- [User Management](#user-management)
- [Report Management](#report-management)
- [Destination Response Management](#destination-response-management)
- [Payment Management](#payment-management)
- [Blog & Press Management](#blog--press-management)
- [Notifications](#notifications)
- [Best Practices](#best-practices)

---

## Admin Access

### Admin Login

1. Navigate to `/admin/login`
2. Enter admin credentials (email and password)
3. Click "Login"
4. You'll be redirected to the admin dashboard

### Admin Roles

Only users with `role: 'admin'` can access admin features. Regular users cannot see or access admin routes.

### Session Management

- Admin sessions use JWT tokens
- Tokens automatically refresh when expired
- Log out when finished to secure the session

---

## Admin Dashboard Overview

The admin dashboard (`/admin`) provides an overview of platform activity:

### Quick Stats
- Total registered users
- Pending questionnaires (need reports)
- Reports in draft status
- Recent payments

### Navigation

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/users` | User management |
| `/admin/reports` | Report management |
| `/admin/payments` | Payment management |
| `/admin/blog` | Blog content management |

---

## User Management

Access: `/admin/users`

### Viewing Users

The user list displays:
- User name and email
- Registration date
- Account status (active/inactive)
- Onboarding status (pending/in_progress/completed)
- Role (user/admin)

### Filtering & Sorting

Filter users by:
- **Search**: Search by name or email
- **Role**: Filter by user/admin
- **Status**: Active or inactive users
- **Sort**: By name, email, or creation date

### User Details

Click on a user to view:
- Profile information
- Questionnaire history
- Payment history
- Associated reports

### Managing Users

#### Create User
1. Click "Create User"
2. Fill in required fields:
   - Email address
   - Password (temporary)
   - First and last name
   - Optional: phone, ID number, role
3. Click "Create"

#### Update User
1. Navigate to user details
2. Edit any field:
   - Personal information
   - Contact details
   - Account status
   - Role
3. Save changes

#### Deactivate User
1. Navigate to user details
2. Click "Deactivate"
3. Confirm the action

Deactivated users cannot log in but data is preserved.

#### Restore User
1. Filter for inactive users
2. Click "Restore" on the user
3. User can log in again

### Viewing User Questionnaires

For each user, you can view:
- Questionnaire status
- Submitted responses
- Countries selected
- Personal details provided
- Completion date

Access questionnaire details at `/admin/users/[userId]/questionnaire`

---

## Report Management

Access: `/admin/reports`

Reports are personalized recommendations generated for users after they complete the questionnaire and payment.

### Report Workflow

```
┌─────────────────────┐
│ User completes      │
│ questionnaire       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ User makes payment  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Appears in          │
│ "Pending" list      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Admin creates       │
│ report (draft)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Admin adds          │
│ destinations        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Admin publishes     │
│ report              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ User can view       │
│ their report        │
└─────────────────────┘
```

### Viewing Pending Questionnaires

1. Navigate to `/admin/reports`
2. Click "Pending" tab
3. View list of completed questionnaires awaiting reports

Each pending questionnaire shows:
- User name
- Selected countries
- Submission date
- Whether a report already exists

### Creating a Report

1. From the pending list, click "Create Report"
2. Or navigate to an existing questionnaire and click "Create Report"
3. Fill in the report details:
   - **Greeting**: Personalized opening message
   - **Profile Summary**: Key user information
4. Click "Create"

The report is created in `draft` status.

### Report Structure

A report contains:

#### Header Information
- **Greeting**: Personalized message to the user
- **Profile Summary**:
  - User name
  - Citizenship
  - Age
  - Profession
  - Family status
  - Income information
  - Relocation goals

#### Destinations
Multiple destination responses, each containing:
- Country information
- Match score
- Personalized content
- Visa recommendations

### Editing a Report

1. Navigate to `/admin/reports/[id]`
2. Click "Edit"
3. Modify:
   - Greeting text
   - Profile summary fields
4. Save changes

### Publishing a Report

1. Navigate to the report
2. Ensure all destinations are ready
3. Click "Publish"
4. Choose whether to publish all destinations

Once published:
- User receives a notification
- Report appears in user's Personal Area
- Status changes from `draft` to `published`

### Deleting a Report

1. Navigate to the report
2. Click "Delete"
3. Confirm the action

**Warning**: This permanently removes the report and all associated destinations.

---

## Destination Response Management

Each report contains multiple destination responses - personalized recommendations for specific countries.

### Creating a Destination

1. Navigate to the report (`/admin/reports/[id]`)
2. Click "Add Destination"
3. Fill in the destination details

#### Destination Information
- **Name**: Country name (e.g., "Portugal")
- **Subtitle**: Tagline (e.g., "Digital Nomad Paradise")
- **Image**: URL to destination image
- **Badge**: Optional label (e.g., "Recommended", "Best Match")

#### Match Information
- **Score**: Match percentage (0-100)
- **Visa Type**: Recommended visa category
- **Reasons**: List of why this destination matches

#### Narrative Content
Personalized story sections:
- **Introduction**: Overview of the destination
- **Pathway**: How to get there (visa process)
- **Fit**: Why it suits the user
- **Benefits**: Key advantages
- **Highlights**: Bullet points of top features

#### Content Sections
Flexible sections for detailed information:
- Each section has a title, icon, and content
- Content supports Markdown formatting
- Sections can be reordered

### Editing a Destination

1. Navigate to `/admin/reports/[id]/responses/[responseId]`
2. Click "Edit"
3. Modify any field
4. Save changes

### Response Editor

The response editor (`ResponseEditor` component) provides:
- Rich text editing for content sections
- Markdown preview
- Section reordering
- Image URL management

### Publishing Destinations

Destinations can be published independently:

1. Navigate to the destination
2. Click "Publish"
3. The destination becomes visible to the user

Or publish all when publishing the report.

### Import from Template

For efficiency, you can:
1. Use existing templates for common destinations
2. Import content and customize for the user
3. Adjust match scores and reasons based on profile

See `docs/response-import-guide.md` for import format details.

---

## Payment Management

Access: `/admin/payments`

### Viewing Payments

The payment list displays:
- User information
- Payment amount and currency
- Payment status
- Product type
- Payment date

### Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment initiated, not completed |
| `completed` | Payment successful |
| `failed` | Payment failed |
| `expired` | Checkout session expired |
| `refunded` | Payment was refunded |
| `disputed` | Payment is under dispute |

### Product Types

| Type | Description |
|------|-------------|
| `relomatch_report` | Full relocation report |
| `consultation` | Consultation session |

### Filtering Payments

Filter by:
- Status (completed, pending, failed, etc.)
- Product type
- Search by user name/email
- Sort by date or amount

### User Payment Status

View a user's complete payment history:
1. Navigate to user details
2. View payment status section
3. See:
   - Has paid for report
   - Has paid for consultation
   - Total payments
   - Last payment details

---

## Blog & Press Management

Access: `/admin/blog`

Manage blog posts and press articles.

### Content Types

- **Blog**: Original articles about relocation
- **Press**: Press releases and media coverage

### Creating a Post

1. Click "Create Post"
2. Fill in required fields:
   - **Slug**: URL-friendly identifier
   - **Title**: Post title (Hebrew and English)
   - **Excerpt**: Short description
   - **Content**: Full article (Markdown)
   - **Category**: visa, relocation, lifestyle, etc.
   - **Featured Image**: URL and alt text
3. Save as draft or publish

### Post Structure

```typescript
{
  slug: "my-article",
  contentType: "blog" | "press",
  title: { he: "כותרת", en: "Title" },
  excerpt: { he: "תקציר", en: "Excerpt" },
  content: { he: "תוכן...", en: "Content..." },
  metaDescription: { he: "תיאור", en: "Description" },
  featuredImageUrl: "https://...",
  featuredImageAlt: { he: "תיאור תמונה", en: "Alt text" },
  category: "relocation",
  tags: ["visa", "portugal"],
  author: "Relogate",
  status: "draft" | "published" | "archived",
  isFeatured: false
}
```

### Managing Posts

- **Edit**: Modify any content
- **Publish**: Make visible to users
- **Unpublish**: Remove from public view
- **Archive**: Hide but preserve
- **Delete**: Permanently remove

### Categories

| Category | Use For |
|----------|---------|
| `visa` | Visa information and guides |
| `relocation` | Relocation tips and advice |
| `lifestyle` | Lifestyle and culture |
| `tax` | Tax and financial information |
| `legal` | Legal requirements |
| `education` | Education and schools |
| `healthcare` | Healthcare systems |
| `housing` | Housing and real estate |
| `work` | Work and employment |

---

## Notifications

Send notifications to users about important updates.

### Creating a Notification

1. Use the admin API endpoint
2. Specify:
   - User ID (or batch of users)
   - Notification type
   - Title and message
   - Related entity ID (optional)

### Notification Types

| Type | Trigger |
|------|---------|
| `report_ready` | Report published for user |
| `country_response_ready` | New destination added |
| `questionnaire_completed` | Auto-sent on completion |
| `questionnaire_updated` | Questionnaire was modified |
| `questionnaire_resubmit_required` | User needs to update questionnaire |
| `questionnaire_reminder` | Reminder to complete |
| `new_questionnaire_submitted` | Admin notification of new submission |
| `system` | General system messages |

### Batch Notifications

Send to multiple users:
1. Prepare list of user IDs
2. Use batch endpoint
3. All users receive the notification

---

## Best Practices

### Report Creation

1. **Review Questionnaire First**: Understand user's profile before writing
2. **Personalize Content**: Tailor recommendations to user's specific situation
3. **Be Specific**: Include concrete details about visa types, costs, timelines
4. **Check Accuracy**: Verify country information is current
5. **Preview Before Publishing**: Use the preview feature

### User Management

1. **Don't Delete**: Deactivate instead of deleting for audit trail
2. **Document Changes**: Note why changes were made
3. **Respond Promptly**: Address user issues quickly

### Content Quality

1. **Consistent Formatting**: Use consistent markdown styles
2. **Image Optimization**: Use optimized image URLs
3. **Bilingual Content**: Provide both Hebrew and English
4. **SEO Friendly**: Include meta descriptions

### Security

1. **Session Management**: Log out after admin sessions
2. **Password Security**: Use strong admin passwords
3. **Access Control**: Only grant admin access when necessary
4. **Audit Trail**: Monitor admin actions

---

## Common Tasks Quick Reference

### Process New Questionnaire

```
1. Check /admin/reports → Pending
2. Review questionnaire responses
3. Create report with greeting
4. Add destination responses (2-5 recommended)
5. Write personalized content for each
6. Preview report
7. Publish report
8. User receives notification
```

### Edit Existing Report

```
1. Navigate to /admin/reports
2. Find and click on report
3. Edit greeting/profile summary
4. Edit individual destinations
5. Save changes
6. If already published, changes are immediate
```

### Create Blog Post

```
1. Navigate to /admin/blog
2. Click "Create Post"
3. Fill in all fields (Hebrew + English)
4. Add featured image
5. Save as draft
6. Preview
7. Publish when ready
```

### Investigate User Issue

```
1. Search for user in /admin/users
2. Check user details and status
3. View questionnaire responses
4. Check payment status
5. View associated report (if exists)
6. Check notifications sent
```
