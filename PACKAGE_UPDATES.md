# Package Updates

## Vue Flow Package Name Change

The `@braks/vue-flow` package has been deprecated and replaced with the official `@vue-flow` packages.

### Changes Made

#### package.json
**Old**:
```json
"@braks/vue-flow": "^1.3.0"
```

**New**:
```json
"@vue-flow/core": "^1.41.2",
"@vue-flow/background": "^1.3.0",
"@vue-flow/controls": "^1.1.2",
"@vue-flow/minimap": "^1.5.0"
```

#### Import Changes

**src/components/GraphCanvas.vue**:
```typescript
// Old
import { VueFlow, Background, MiniMap, Controls } from '@braks/vue-flow'
import type { Connection, Node, Edge } from '@braks/vue-flow'

// New
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import type { Connection, Node, Edge } from '@vue-flow/core'
```

**src/components/CustomNode.vue**:
```typescript
// Old
import { Handle, Position } from '@braks/vue-flow'

// New
import { Handle, Position } from '@vue-flow/core'
```

#### CSS Imports

Added to **src/style.css**:
```css
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';
```

### Installation

```bash
npm install
```

### Security Notes

Current vulnerabilities (2 moderate) are in development dependencies and don't affect production build. They can be addressed with:

```bash
npm audit fix
```

Or for breaking changes:
```bash
npm audit fix --force
```

### Documentation References

- Vue Flow Official Docs: https://vueflow.dev/
- Migration Guide: https://vueflow.dev/guide/migration/
- GitHub: https://github.com/bcakmakoglu/vue-flow

### Testing

After updating, test:
1. Node dragging works
2. Edge connections work
3. Minimap displays
4. Controls (zoom/pan) work
5. Background grid shows

All functionality should remain the same - only the package names have changed.
