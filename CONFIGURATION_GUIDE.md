# Adte Events CMS - Configuration Guide

## ✅ Completed Phases

The following configurations have been completed programmatically:

- ✅ **PHASE 1**: Removed example content types (article, category, author)
- ✅ **PHASE 2**: Created Event content type with complete schema
- ✅ **PHASE 4**: Configured CORS settings in `config/middlewares.js`
- ✅ **PHASE 5**: Configured upload/media plugin settings in `config/plugins.js`
- ✅ **PHASE 7**: Created lifecycle hooks for automatic `isPastEvent` field management
- ✅ **PHASE 8**: Created Event controller with automatic media population

---

## 🔧 Manual Configuration Steps Required

The following steps must be completed through the Strapi Admin UI or environment configuration:

### PHASE 3: Configure API Permissions

**Steps:**

1. Start your Strapi instance:
   ```bash
   cd /Users/meirperetz/Documents/GitHub/siteplus/adte_cms
   npm run develop
   ```

2. Access the Strapi Admin Panel: `http://localhost:1337/admin`

3. Navigate to: **Settings → Users & Permissions plugin → Roles → Public**

4. Scroll to the **Event** section and enable:
   - ✅ `find` (Get list of events)
   - ✅ `findOne` (Get single event by ID)
   - ❌ `create` (Keep disabled)
   - ❌ `update` (Keep disabled)
   - ❌ `delete` (Keep disabled)

5. Click **Save**

6. Navigate to: **Settings → Users & Permissions plugin → Roles → Authenticated**

7. Scroll to the **Event** section and enable:
   - ✅ `find`
   - ✅ `findOne`
   - ✅ `create`
   - ✅ `update`
   - ✅ `delete`

8. Click **Save**

---

### PHASE 6: Create API Token for Next.js Frontend

**Steps:**

1. Navigate to: **Settings → API Tokens → Create new API Token**

2. Configure the token:
   - **Name**: `Next.js Frontend - Production`
   - **Description**: `Read-only token for Adte Events frontend`
   - **Token duration**: `Unlimited`
   - **Token type**: `Read-only`

3. Under **Permissions**, expand **Event** and select:
   - ✅ `find`
   - ✅ `findOne`

4. Click **Save**

5. **IMPORTANT**: Copy the generated token immediately (you won't see it again!)

6. Store this token in your Next.js `.env.local` file:
   ```env
   STRAPI_API_TOKEN=your_generated_token_here
   STRAPI_API_URL=http://localhost:1337
   ```

---

### PHASE 9: Environment Variables Configuration

**Review and update** the `.env` file in your Strapi project root:

```env
HOST=0.0.0.0
PORT=1337

# Database Configuration (currently using SQLite)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For production, switch to PostgreSQL:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=adte_strapi
# DATABASE_USERNAME=your_db_user
# DATABASE_PASSWORD=your_db_password
# DATABASE_SSL=false

# Security Keys (generate strong random strings for production)
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your-jwt-secret-here

# Application URLs
URL=http://localhost:1337
# Production: URL=https://your-strapi-domain.com
```

**⚠️ IMPORTANT**: For production, generate new secure keys using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### PHASE 10: Testing & Verification

#### 10.1 Restart Strapi

```bash
cd /Users/meirperetz/Documents/GitHub/siteplus/adte_cms
npm run develop
```

#### 10.2 Create Sample Event

1. Go to **Content Manager → Event → Create new entry**

2. Fill in sample data:
   - **Title**: `AdTech Conference 2025`
   - **Slug**: `adtech-conference-2025` (auto-generated)
   - **Short Description**: `Join us for the premier AdTech conference featuring CTV advertising insights, networking, and industry leaders.`
   - **Event URL**: `https://example.com/adtech-2025`
   - **Featured Image**: Upload an image from `data/uploads/`
   - **Event Date**: `2025-12-15T09:00:00`
   - **Event End Date**: `2025-12-15T18:00:00`
   - **Location**: `Las Vegas, NV`
   - **Event Type**: `conference`
   - **Registration Status**: `open`
   - **Featured**: `true`
   - **Display Order**: `1`

3. Click **Save** then **Publish**

#### 10.3 Test API Endpoints

**Test 1: Get all events (without authentication)**
```bash
curl -X GET 'http://localhost:1337/api/events?populate=*'
```

**Test 2: Get all events (with API token)**
```bash
curl -X GET 'http://localhost:1337/api/events?populate=*' \
  -H 'Authorization: Bearer YOUR_API_TOKEN_HERE'
```

**Test 3: Get single event**
```bash
curl -X GET 'http://localhost:1337/api/events/1?populate=*' \
  -H 'Authorization: Bearer YOUR_API_TOKEN_HERE'
```

**Test 4: Filter upcoming events**
```bash
curl -X GET 'http://localhost:1337/api/events?populate=*&filters[isPastEvent][$eq]=false&sort[0]=displayOrder:asc&sort[1]=eventDate:asc' \
  -H 'Authorization: Bearer YOUR_API_TOKEN_HERE'
```

**Expected Response Structure:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "AdTech Conference 2025",
        "slug": "adtech-conference-2025",
        "shortDescription": "Join us for the premier AdTech conference...",
        "eventUrl": "https://example.com/adtech-2025",
        "eventDate": "2025-12-15T09:00:00.000Z",
        "eventEndDate": "2025-12-15T18:00:00.000Z",
        "location": "Las Vegas, NV",
        "eventType": "conference",
        "isPastEvent": false,
        "featured": true,
        "registrationStatus": "open",
        "displayOrder": 1,
        "createdAt": "2025-11-22T00:00:00.000Z",
        "updatedAt": "2025-11-22T00:00:00.000Z",
        "publishedAt": "2025-11-22T00:00:00.000Z",
        "featuredImage": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/image.jpg",
              "alternativeText": "Event image",
              "width": 1920,
              "height": 1080,
              "formats": {
                "large": { "url": "...", "width": 1000, "height": 563 },
                "medium": { "url": "...", "width": 750, "height": 422 },
                "small": { "url": "...", "width": 500, "height": 281 },
                "thumbnail": { "url": "...", "width": 245, "height": 138 }
              }
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### PHASE 11: Production Deployment Checklist

Before deploying to production:

- [ ] Generate new strong JWT secrets and API tokens
- [ ] Update CORS origins to production domains only (remove localhost)
- [ ] Switch from SQLite to PostgreSQL database
- [ ] Set up automated database backups
- [ ] Configure CDN for media files (e.g., AWS S3, Cloudinary)
- [ ] Enable rate limiting in `config/middlewares.js`
- [ ] Set up monitoring and logging (e.g., PM2, Sentry)
- [ ] Create admin user with strong password
- [ ] Update `URL` environment variable to production domain
- [ ] Test all API endpoints in production
- [ ] Document the API token and store it securely (e.g., Vercel env vars)

---

### PHASE 12: Next.js Integration Details

Provide the frontend team with these details:

#### Environment Variables (Next.js `.env.local`)
```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_read_only_api_token_here
```

#### API Endpoints

**Base URL**: `http://localhost:1337/api` (dev) or `https://your-domain.com/api` (prod)

**Get all events**:
```
GET /api/events?populate=*
```

**Get upcoming events (sorted)**:
```
GET /api/events?populate=*&filters[isPastEvent][$eq]=false&sort[0]=displayOrder:asc&sort[1]=eventDate:asc
```

**Get past events**:
```
GET /api/events?populate=*&filters[isPastEvent][$eq]=true&sort[0]=eventDate:desc
```

**Get featured events**:
```
GET /api/events?populate=*&filters[featured][$eq]=true&filters[isPastEvent][$eq]=false
```

**Get single event by ID**:
```
GET /api/events/1?populate=*
```

**Get event by slug** (requires custom endpoint or filter):
```
GET /api/events?populate=*&filters[slug][$eq]=adtech-conference-2025
```

#### Example Next.js Fetch Function

```typescript
// lib/strapi.ts
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function fetchEvents(filters = {}) {
  const queryParams = new URLSearchParams({
    'populate': '*',
    'sort[0]': 'displayOrder:asc',
    'sort[1]': 'eventDate:asc',
    ...filters
  });

  const response = await fetch(
    `${STRAPI_API_URL}/api/events?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

// Usage examples
export async function getUpcomingEvents() {
  return fetchEvents({ 'filters[isPastEvent][$eq]': 'false' });
}

export async function getPastEvents() {
  return fetchEvents({ 'filters[isPastEvent][$eq]': 'true' });
}

export async function getFeaturedEvents() {
  return fetchEvents({
    'filters[featured][$eq]': 'true',
    'filters[isPastEvent][$eq]': 'false'
  });
}
```

---

## 📋 Event Content Type Field Reference

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `title` | Text | Yes | - | Event title (max 255 chars) |
| `slug` | UID | Yes | - | URL-friendly identifier (auto-generated from title) |
| `shortDescription` | Text (Long) | Yes | - | Brief event description (max 500 chars) |
| `eventUrl` | Text | Yes | - | External URL to event page/registration |
| `featuredImage` | Media | Yes | - | Main event image (images only) |
| `eventDate` | DateTime | Yes | - | Event start date and time |
| `eventEndDate` | DateTime | No | null | Event end date and time |
| `location` | Text | No | - | Event location (max 255 chars) |
| `eventType` | Enumeration | Yes | `conference` | Type: conference, webinar, networking, workshop, trade-show, other |
| `isPastEvent` | Boolean | No | `false` | Auto-set based on eventDate (managed by lifecycle hooks) |
| `featured` | Boolean | No | `false` | Display prominently on archive page |
| `registrationStatus` | Enumeration | Yes | `open` | Status: open, closing-soon, closed, waitlist |
| `displayOrder` | Integer | No | `0` | Lower numbers appear first in lists |

---

## 🎯 Key Features Implemented

1. **Automatic Past Event Detection**: The `isPastEvent` field is automatically set based on the `eventDate` using lifecycle hooks.

2. **Always Populated Media**: The Event controller automatically populates `featuredImage` with all necessary fields and formats.

3. **Image Optimization**: Multiple image formats (thumbnail, small, medium, large, xlarge) are automatically generated on upload.

4. **CORS Configured**: Frontend domains are whitelisted for API access.

5. **API Permissions**: Public read-only access configured for frontend consumption.

6. **Type Safety**: Full Strapi v4 schema with proper field types and validations.

---

## 🔍 Troubleshooting

### Issue: Events not appearing in API response
- Ensure the event is **Published** (not just Saved)
- Check that Public role has `find` and `findOne` permissions
- Verify the API token has correct permissions

### Issue: Images not loading
- Check that `featuredImage` is being populated: `?populate=*`
- Verify CORS settings allow image origins
- Ensure image was successfully uploaded to Media Library

### Issue: isPastEvent not updating
- The lifecycle hooks only run on create/update
- For existing events, update them manually or run a migration script

### Issue: CORS errors
- Verify frontend domain is listed in `config/middlewares.js`
- Check that CORS headers include `Authorization`
- Ensure preflight OPTIONS requests are handled

---

## 📞 Support

For additional help:
- Strapi Documentation: https://docs.strapi.io/
- Strapi Discord: https://discord.strapi.io/
- Project Repository: [Your repo URL]

---

**Last Updated**: November 22, 2025

