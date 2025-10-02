import { databases, storage, config } from './config'
import { ID, Query } from 'appwrite'
import type { GameProject } from '@/types/graph'
import type { ProjectDocument } from '@/types/appwrite'

export const projectService = {
  async create(project: GameProject, userId: string): Promise<GameProject> {
    const doc: Partial<ProjectDocument> = {
      name: project.name,
      slug: project.slug,
      description: project.description,
      graph: JSON.stringify(project.graph),
      userId
    }

    const response = await databases.createDocument(
      config.databaseId,
      config.projectsCollectionId,
      ID.unique(),
      doc
    )

    return this.mapDocumentToProject(response)
  },

  async update(projectId: string, project: GameProject): Promise<GameProject> {
    const doc: Partial<ProjectDocument> = {
      name: project.name,
      slug: project.slug,
      description: project.description,
      graph: JSON.stringify(project.graph)
    }

    const response = await databases.updateDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId,
      doc
    )

    return this.mapDocumentToProject(response)
  },

  async get(projectId: string): Promise<GameProject> {
    const response = await databases.getDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId
    )

    return this.mapDocumentToProject(response)
  },

  async getBySlug(slug: string): Promise<GameProject | null> {
    const response = await databases.listDocuments(
      config.databaseId,
      config.projectsCollectionId,
      [Query.equal('slug', slug), Query.limit(1)]
    )

    if (response.documents.length === 0) {
      return null
    }

    return this.mapDocumentToProject(response.documents[0])
  },

  async list(userId?: string): Promise<GameProject[]> {
    const queries = userId ? [Query.equal('userId', userId)] : []

    const response = await databases.listDocuments(
      config.databaseId,
      config.projectsCollectionId,
      queries
    )

    return response.documents.map((doc) => this.mapDocumentToProject(doc))
  },

  async delete(projectId: string): Promise<void> {
    await databases.deleteDocument(
      config.databaseId,
      config.projectsCollectionId,
      projectId
    )
  },

  mapDocumentToProject(doc: any): GameProject {
    return {
      id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      graph: JSON.parse(doc.graph),
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
      userId: doc.userId
    }
  }
}

export const storageService = {
  async uploadAsset(file: File): Promise<string> {
    const response = await storage.createFile(
      config.storageBucketId,
      ID.unique(),
      file
    )

    return response.$id
  },

  async deleteAsset(fileId: string): Promise<void> {
    await storage.deleteFile(config.storageBucketId, fileId)
  },

  getAssetUrl(fileId: string): string {
    return storage.getFileView(config.storageBucketId, fileId).toString()
  }
}
