# Appwrite Setup Guide

This guide will help you set up Appwrite for the Visual Scripting Game Editor.

## 1. Create Appwrite Account

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Create a new project

## 2. Create Database

1. Navigate to **Databases** in the left sidebar
2. Click **Create Database**
3. Name it "game-editor" (or any name you prefer)
4. Copy the **Database ID** for later

## 3. Create Projects Collection

1. Inside your database, click **Create Collection**
2. Name it "projects"
3. Copy the **Collection ID** for later

### Collection Attributes

Add the following attributes to the "projects" collection:

| Attribute | Type | Size | Required | Array | Default |
|-----------|------|------|----------|-------|---------|
| name | String | 255 | Yes | No | - |
| slug | String | 255 | Yes | No | - |
| description | String | 1000 | No | No | - |
| graph | String | 100000 | Yes | No | - |
| userId | String | 255 | Yes | No | - |

### Collection Indexes

Create the following indexes for better performance:

1. **slug_index**
   - Type: Key
   - Attributes: slug
   - Orders: ASC
   - This enables fast lookups by slug

### Collection Permissions

Set the following permissions:

**Role: Any**
- ✓ Read

**Role: Users (authenticated)**
- ✓ Create
- ✓ Update
- ✓ Delete

This allows anyone to view projects, but only authenticated users can create/modify them.

## 4. Create Storage Bucket

1. Navigate to **Storage** in the left sidebar
2. Click **Create Bucket**
3. Name it "game-assets"
4. Copy the **Bucket ID** for later

### Bucket Settings

- **File Security**: Enabled
- **Maximum File Size**: 10 MB (adjust as needed)
- **Allowed File Extensions**: Leave empty (all files) or add: `png,jpg,jpeg,gif,mp3,ogg,wav`

### Bucket Permissions

**Role: Any**
- ✓ Read

**Role: Users (authenticated)**
- ✓ Create
- ✓ Update
- ✓ Delete

## 5. Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_PROJECTS_COLLECTION_ID=your_collection_id_here
VITE_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id_here
```

Replace the values with your actual IDs from the previous steps.

### Where to Find IDs

- **Project ID**: Project Settings > General > Project ID
- **Database ID**: Databases > Your Database > Settings > Database ID
- **Collection ID**: Databases > Your Database > projects > Settings > Collection ID
- **Bucket ID**: Storage > game-assets > Settings > Bucket ID

## 6. Enable Authentication (Optional)

For user authentication:

1. Navigate to **Auth** in the left sidebar
2. Enable authentication methods:
   - Email/Password
   - OAuth providers (Google, GitHub, etc.)

### Update Auth Flow

If you enable auth, update the following files:

**src/stores/authStore.ts** (create this file):
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account } from '@/appwrite/config'
import { ID } from 'appwrite'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  async function login(email: string, password: string) {
    await account.createEmailSession(email, password)
    user.value = await account.get()
    isAuthenticated.value = true
  }

  async function signup(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name)
    await login(email, password)
  }

  async function logout() {
    await account.deleteSession('current')
    user.value = null
    isAuthenticated.value = false
  }

  async function checkAuth() {
    try {
      user.value = await account.get()
      isAuthenticated.value = true
    } catch {
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth
  }
})
```

## 7. Test Connection

Run your development server:

```bash
npm run dev
```

Check the browser console for any connection errors. You should see Appwrite SDK initialization without errors.

## 8. Seed Sample Data (Optional)

To test the app with sample projects, you can manually create a document in the "projects" collection:

1. Go to Databases > game-editor > projects
2. Click **Add Document**
3. Add the following data:

```json
{
  "name": "Test Project",
  "slug": "test-project",
  "description": "A test project",
  "graph": "{\"nodes\":[],\"edges\":[]}",
  "userId": "test-user"
}
```

Now you can load this project in the app at `/play/test-project`.

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:

1. Go to Project Settings > Platforms
2. Add a new Web Platform
3. Enter your development URL: `http://localhost:5173`
4. For production, add your deployed URL

### Permission Errors

If you get "Unauthorized" errors:

1. Check collection permissions (see step 3)
2. Make sure "Any" role has Read permission
3. For authenticated operations, ensure user is logged in

### Large Graph Size Errors

If graphs exceed the 100KB limit:

1. Go to Collection Settings > Attributes
2. Update the `graph` attribute size to 200000 or higher
3. Or implement graph compression in the services

## Production Deployment

For production:

1. Update `.env` with production values
2. Update Appwrite Platform settings with production domain
3. Consider enabling rate limiting in Appwrite
4. Set up backup schedules for the database

## Support

For Appwrite-specific issues, check:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
