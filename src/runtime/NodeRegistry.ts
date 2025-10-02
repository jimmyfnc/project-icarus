import type { NodeRegistryEntry } from '@/types/runtime'

export class NodeRegistry {
  private static nodes = new Map<string, NodeRegistryEntry>()

  static register(entry: NodeRegistryEntry) {
    this.nodes.set(entry.meta.type, entry)
  }

  static get(type: string): NodeRegistryEntry | undefined {
    return this.nodes.get(type)
  }

  static getAll(): NodeRegistryEntry[] {
    return Array.from(this.nodes.values())
  }

  static getByCategory(category: string): NodeRegistryEntry[] {
    return Array.from(this.nodes.values()).filter(
      (node) => node.meta.category === category
    )
  }
}
