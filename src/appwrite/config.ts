import { Client, Databases, Storage, Account } from 'appwrite'

const client = new Client()

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export const config = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '',
  projectsCollectionId: import.meta.env.VITE_APPWRITE_PROJECTS_COLLECTION_ID || '',
  storageBucketId: import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || ''
}

export { client }
