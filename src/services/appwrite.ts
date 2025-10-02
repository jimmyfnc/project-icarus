import { Client, Account, Databases, ID, Query, Permission, Role, type Models } from 'appwrite'

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)

// Configuration
export const config = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  projectsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID
}

// Types
export interface AppwriteProject extends Models.Document {
  name: string
  slug: string
  description: string
  graph: string // JSON stringified
  userId: string
  createdAt: string
  updatedAt: string
}

// Authentication
export const auth = {
  async login(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password)
  },

  async signup(email: string, password: string, name: string) {
    const user = await account.create(ID.unique(), email, password, name)
    // Auto-login after signup
    await this.login(email, password)
    return user
  },

  async logout() {
    return await account.deleteSession('current')
  },

  async getCurrentUser() {
    try {
      return await account.get()
    } catch {
      return null
    }
  }
}

// Project CRUD
export const projects = {
  async list(userId: string) {
    const response = await databases.listDocuments(
      config.databaseId,
      config.projectsCollectionId,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    )
    return response.documents as AppwriteProject[]
  },

  async get(projectId: string) {
    return await databases.getDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId
    ) as AppwriteProject
  },

  async create(project: {
    name: string
    slug: string
    description: string
    graph: object
    userId: string
  }) {
    return await databases.createDocument(
      config.databaseId,
      config.projectsCollectionId,
      ID.unique(),
      {
        ...project,
        graph: JSON.stringify(project.graph)
      },
      [
        Permission.read(Role.user(project.userId)),
        Permission.update(Role.user(project.userId)),
        Permission.delete(Role.user(project.userId))
      ]
    ) as AppwriteProject
  },

  async update(projectId: string, updates: {
    name?: string
    slug?: string
    description?: string
    graph?: object
  }) {
    const data: any = { ...updates }

    if (updates.graph) {
      data.graph = JSON.stringify(updates.graph)
    }

    return await databases.updateDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId,
      data
    ) as AppwriteProject
  },

  async delete(projectId: string) {
    return await databases.deleteDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId
    )
  }
}
