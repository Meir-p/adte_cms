# Adte Events CMS - Quick Start Checklist

## ✅ Automated Configuration (COMPLETED)

The following have been configured automatically:

- [x] Removed example content types (article, category, author, about, global)
- [x] Created Event collection type with 13 fields
- [x] Configured CORS for frontend domains
- [x] Configured media upload settings (10MB limit, responsive images)
- [x] Created lifecycle hooks for automatic isPastEvent management
- [x] Created Event controller with automatic media population

---

## 📝 Manual Steps (Required)

Complete these steps in order:

### 1. Start Strapi Development Server

```bash
cd /Users/meirperetz/Documents/GitHub/siteplus/adte_cms
npm run develop
```

Wait for the server to start at `http://localhost:1337`

---

### 2. Configure API Permissions (5 minutes)

#### Public Role (for frontend visitors)
1. Go to: **Settings → Users & Permissions → Roles → Public**
2. Find **Event** section
3. Enable: `find` and `findOne`
4. Click **Save**

#### Authenticated Role (for logged-in users)
1. Go to: **Settings → Users & Permissions → Roles → Authenticated**
2. Find **Event** section
3. Enable: `find`, `findOne`, `create`, `update`, `delete`
4. Click **Save**

---

### 3. Create API Token (5 minutes)

1. Go to: **Settings → API Tokens → Create new API Token**
2. Fill in:
   - Name: `Next.js Frontend - Production`
   - Description: `Read-only token for Adte Events frontend`
   - Token duration: `Unlimited`
   - Token type: `Read-only`
3. Under **Event** permissions, enable: `find` and `findOne`
4. Click **Save**
5. **COPY THE TOKEN** (you won't see it again!)
6. Add to Next.js `.env.local`:
   ```env
   STRAPI_API_URL=http://localhost:1337
   STRAPI_API_TOKEN=paste_token_here
   ```

---

### 4. Create Sample Event (5 minutes)

1. Go to: **Content Manager → Event → Create new entry**
2. Fill in:
   - **Title**: `AdTech Conference 2025`
   - **Short Description**: `Join us for the premier AdTech conference featuring CTV advertising insights, networking, and industry leaders.`
   - **Event URL**: `https://example.com/adtech-2025`
   - **Featured Image**: Upload any image from `data/uploads/`
   - **Event Date**: `2025-12-15T09:00:00`
   - **Event End Date**: `2025-12-15T18:00:00`
   - **Location**: `Las Vegas, NV`
   - **Event Type**: `conference`
   - **Registration Status**: `open`
   - **Featured**: Yes (toggle on)
   - **Display Order**: `1`
3. Click **Save** then **Publish**

---

### 5. Test API (2 minutes)

Replace `YOUR_TOKEN` with your actual API token:

```bash
# Test getting all events
curl -X GET 'http://localhost:1337/api/events?populate=*' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Test getting upcoming events only
curl -X GET 'http://localhost:1337/api/events?populate=*&filters[isPastEvent][$eq]=false&sort[0]=displayOrder:asc' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

You should see your sample event in the response!

---

### 6. Update Environment Variables for Production

When deploying to production:

1. Generate new secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. Update `.env`:
   - `ADMIN_JWT_SECRET` - new secure value
   - `API_TOKEN_SALT` - new secure value
   - `APP_KEYS` - four new secure values (comma-separated)
   - `JWT_SECRET` - new secure value
   - `URL` - your production domain
   - Switch to PostgreSQL database configuration

3. Update `config/middlewares.js` CORS origins:
   - Remove `http://localhost:3000` and `http://localhost:1337`
   - Keep only production domains

---

## 🎉 You're Done!

Your Strapi CMS is now configured for the Adte Events platform!

### Next Steps:

1. **Review the full documentation**: See `CONFIGURATION_GUIDE.md` for detailed information
2. **Integrate with Next.js**: Use the API token and endpoints documented in the guide
3. **Add more events**: Create additional event entries in the Content Manager
4. **Plan production deployment**: Review the production checklist in `CONFIGURATION_GUIDE.md`

---

## 🔗 Quick Links

- **Admin Panel**: http://localhost:1337/admin
- **API Base URL**: http://localhost:1337/api
- **Events Endpoint**: http://localhost:1337/api/events
- **Media Library**: http://localhost:1337/admin/content-manager/collectionType/plugin::upload.file

---

## 📚 API Endpoint Examples

### Get All Events
```
GET /api/events?populate=*
```

### Get Upcoming Events (Sorted)
```
GET /api/events?populate=*&filters[isPastEvent][$eq]=false&sort[0]=displayOrder:asc&sort[1]=eventDate:asc
```

### Get Past Events
```
GET /api/events?populate=*&filters[isPastEvent][$eq]=true&sort[0]=eventDate:desc
```

### Get Featured Events Only
```
GET /api/events?populate=*&filters[featured][$eq]=true&filters[isPastEvent][$eq]=false
```

### Get Single Event by ID
```
GET /api/events/1?populate=*
```

---

## ⚠️ Important Notes

- The `isPastEvent` field is automatically managed by lifecycle hooks
- Images are automatically optimized and resized on upload
- The `featuredImage` is always populated in API responses
- Always use `?populate=*` to get related data (images)
- Events must be **Published** (not just Saved) to appear in API responses

---

**Need Help?** See `CONFIGURATION_GUIDE.md` for troubleshooting and detailed documentation.

