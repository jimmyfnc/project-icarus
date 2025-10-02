// Appwrite Configuration
export interface AppwriteConfig {
  endpoint: string
  projectId: string
  databaseId: string
  projectsCollectionId: string
  storageBucketId: string
}

// Project Document (Appwrite)
export interface ProjectDocument {
  $id?: string
  $createdAt?: string
  $updatedAt?: string
  name: string
  slug: string
  description: string
  graph: string // JSON stringified GameGraph
  userId: string
}
