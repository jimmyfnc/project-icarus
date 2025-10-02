<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-4">Properties</h2>

    <div v-if="selectedNode" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Node Type
        </label>
        <div class="text-sm text-gray-600">{{ selectedNode.type }}</div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>

      <!-- Node-specific properties -->
      <div v-if="nodeEntry">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Node Settings</h3>

        <!-- OnKey properties -->
        <div v-if="selectedNode.type === 'OnKey'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Key
          </label>
          <select
            v-model="properties.key"
            @change="updateProperties"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="SPACE">Space</option>
            <option value="UP">Up Arrow</option>
            <option value="DOWN">Down Arrow</option>
            <option value="LEFT">Left Arrow</option>
            <option value="RIGHT">Right Arrow</option>
          </select>
        </div>

        <!-- Every properties -->
        <div v-else-if="selectedNode.type === 'Every'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Interval (ms)
          </label>
          <input
            v-model.number="properties.interval"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- Spawn properties -->
        <div v-else-if="selectedNode.type === 'Spawn'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Sprite
          </label>
          <select
            v-model="properties.sprite"
            @change="updateProperties"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="player">Player</option>
            <option value="enemy">Enemy</option>
            <option value="bird">Bird</option>
            <option value="pipe">Pipe</option>
            <option value="ground">Ground</option>
            <option value="platform">Platform</option>
            <option value="ship">Ship</option>
            <option value="bullet">Bullet</option>
            <option value="paddle">Paddle</option>
            <option value="ball">Ball</option>
            <option value="brick">Brick</option>
            <option value="tank">Tank</option>
            <option value="cannonball">Cannonball</option>
            <option value="terrain">Terrain</option>
          </select>

          <label class="block text-sm font-medium text-gray-700">
            X Position
          </label>
          <input
            v-model.number="properties.x"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Y Position
          </label>
          <input
            v-model.number="properties.y"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Entity ID
          </label>
          <input
            v-model="properties.entityId"
            @change="updateProperties"
            type="text"
            placeholder="e.g. player, enemy1"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <div class="flex items-center mt-2">
            <input
              v-model="properties.isStatic"
              @change="updateProperties"
              type="checkbox"
              id="isStatic"
              class="mr-2"
            />
            <label for="isStatic" class="text-sm font-medium text-gray-700">
              Is Static (immovable)
            </label>
          </div>

          <div class="flex items-center">
            <input
              v-model="properties.hasGravity"
              @change="updateProperties"
              type="checkbox"
              id="hasGravity"
              class="mr-2"
            />
            <label for="hasGravity" class="text-sm font-medium text-gray-700">
              Has Gravity
            </label>
          </div>

          <div class="flex items-center">
            <input
              v-model="properties.collideWorldBounds"
              @change="updateProperties"
              type="checkbox"
              id="collideWorldBounds"
              class="mr-2"
            />
            <label for="collideWorldBounds" class="text-sm font-medium text-gray-700">
              Collide World Bounds
            </label>
          </div>

          <label class="block text-sm font-medium text-gray-700 mt-2">
            Tag (for collision groups)
          </label>
          <input
            v-model="properties.tag"
            @change="updateProperties"
            type="text"
            placeholder="e.g. enemy, coin, platform"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Used with OnCollideWithTag to detect collisions with all entities that have this tag
          </p>
        </div>

        <!-- Movement properties -->
        <div v-else-if="['Impulse', 'Move'].includes(selectedNode.type)" class="space-y-2">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
          />

          <label class="block text-sm font-medium text-gray-700">
            Velocity X
          </label>
          <input
            v-model.number="properties.dx"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Velocity Y
          </label>
          <input
            v-model.number="properties.dy"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- ApplyGravity properties -->
        <div v-else-if="selectedNode.type === 'ApplyGravity'" class="space-y-2">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
          />

          <label class="block text-sm font-medium text-gray-700">
            Gravity
          </label>
          <input
            v-model.number="properties.gravity"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- Variable properties -->
        <div v-else-if="['SetVar', 'AddVar'].includes(selectedNode.type)" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Variable Name
          </label>
          <input
            v-model="properties.varName"
            @change="updateProperties"
            type="text"
            placeholder="e.g. score"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Value
          </label>
          <input
            v-model.number="properties.value"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- Compare properties -->
        <div v-else-if="selectedNode.type === 'Compare'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Operator
          </label>
          <select
            v-model="properties.operator"
            @change="updateProperties"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="==">Equal (==)</option>
            <option value=">">Greater (&gt;)</option>
            <option value="<">Less (&lt;)</option>
            <option value=">=">Greater or Equal (&gt;=)</option>
            <option value="<=">Less or Equal (&lt;=)</option>
            <option value="!=">Not Equal (!=)</option>
          </select>

          <label class="block text-sm font-medium text-gray-700">
            Value A
          </label>
          <input
            v-model.number="properties.a"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Value B
          </label>
          <input
            v-model.number="properties.b"
            @change="updateProperties"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- OnCollide properties -->
        <div v-else-if="selectedNode.type === 'OnCollide'" class="space-y-2">
          <EntitySelect
            v-model="properties.entityA"
            @update:modelValue="updateProperties"
            label="Entity A ID"
            placeholder="e.g. player"
          />

          <EntitySelect
            v-model="properties.entityB"
            @update:modelValue="updateProperties"
            label="Entity B ID"
            placeholder="e.g. ground"
          />
        </div>

        <!-- OnCollideWithTag properties -->
        <div v-else-if="selectedNode.type === 'OnCollideWithTag'" class="space-y-2">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
            placeholder="e.g. player"
          />

          <label class="block text-sm font-medium text-gray-700">
            Tag to Collide With
          </label>
          <input
            v-model="properties.tag"
            @change="updateProperties"
            type="text"
            placeholder="e.g. enemy, coin"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            This node triggers when the entity collides with ANY entity that has this tag
          </p>
        </div>

        <!-- PlaySound / StopSound properties -->
        <div v-else-if="['PlaySound', 'StopSound'].includes(selectedNode.type)" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Sound Key
          </label>
          <input
            v-model="properties.soundKey"
            @change="updateProperties"
            type="text"
            placeholder="e.g. jump, coin, explosion"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <div v-if="selectedNode.type === 'PlaySound'">
            <label class="block text-sm font-medium text-gray-700">
              Volume (0-1)
            </label>
            <input
              v-model.number="properties.volume"
              @change="updateProperties"
              type="number"
              min="0"
              max="1"
              step="0.1"
              placeholder="1.0"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />

            <div class="flex items-center mt-2">
              <input
                v-model="properties.loop"
                @change="updateProperties"
                type="checkbox"
                id="soundLoop"
                class="mr-2"
              />
              <label for="soundLoop" class="text-sm font-medium text-gray-700">
                Loop Sound
              </label>
            </div>
          </div>
        </div>

        <!-- PlayMusic / StopMusic properties -->
        <div v-else-if="selectedNode.type === 'PlayMusic'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Music Key
          </label>
          <input
            v-model="properties.musicKey"
            @change="updateProperties"
            type="text"
            placeholder="e.g. bgm, theme"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Volume (0-1)
          </label>
          <input
            v-model.number="properties.volume"
            @change="updateProperties"
            type="number"
            min="0"
            max="1"
            step="0.1"
            placeholder="0.5"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <div class="flex items-center">
            <input
              v-model="properties.loop"
              @change="updateProperties"
              type="checkbox"
              id="musicLoop"
              class="mr-2"
            />
            <label for="musicLoop" class="text-sm font-medium text-gray-700">
              Loop Music
            </label>
          </div>
        </div>

        <!-- SetVolume properties -->
        <div v-else-if="selectedNode.type === 'SetVolume'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Master Volume (0-1)
          </label>
          <input
            v-model.number="properties.volume"
            @change="updateProperties"
            type="number"
            min="0"
            max="1"
            step="0.1"
            placeholder="1.0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- SetAngle properties -->
        <div v-else-if="selectedNode.type === 'SetAngle'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Entity ID
          </label>
          <input
            v-model="properties.entity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. tank1"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Angle (degrees)
          </label>
          <input
            v-model.number="properties.angle"
            @change="updateProperties"
            type="number"
            placeholder="45"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            0° = right, 90° = down, 180° = left, 270° = up
          </p>
        </div>

        <!-- ShootProjectile properties -->
        <div v-else-if="selectedNode.type === 'ShootProjectile'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            From Entity ID
          </label>
          <input
            v-model="properties.fromEntity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. tank1"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Angle (degrees)
          </label>
          <input
            v-model.number="properties.angle"
            @change="updateProperties"
            type="number"
            placeholder="45"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Power (velocity)
          </label>
          <input
            v-model.number="properties.power"
            @change="updateProperties"
            type="number"
            placeholder="300"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Sprite
          </label>
          <select
            v-model="properties.sprite"
            @change="updateProperties"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="cannonball">Cannonball</option>
            <option value="bullet">Bullet</option>
            <option value="ball">Ball</option>
          </select>

          <label class="block text-sm font-medium text-gray-700">
            Tag
          </label>
          <input
            v-model="properties.tag"
            @change="updateProperties"
            type="text"
            placeholder="projectile"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Gravity
          </label>
          <input
            v-model.number="properties.gravity"
            @change="updateProperties"
            type="number"
            placeholder="400"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- GetVariable properties -->
        <div v-else-if="selectedNode.type === 'GetVariable'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Variable Name
          </label>
          <input
            v-model="properties.variable"
            @change="updateProperties"
            type="text"
            placeholder="e.g. angle, power"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Reads a variable and outputs its value
          </p>
        </div>

        <!-- ApplyForce properties (wind effect) -->
        <div v-else-if="selectedNode.type === 'ApplyForce'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Entity ID
          </label>
          <input
            v-model="properties.entity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. projectile"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Force X (wind/horizontal)
          </label>
          <input
            v-model.number="properties.fx"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Force Y (vertical)
          </label>
          <input
            v-model.number="properties.fy"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Applies continuous acceleration (e.g., wind: fx=50 pushes right)
          </p>
        </div>

        <!-- SetGravityScale properties -->
        <div v-else-if="selectedNode.type === 'SetGravityScale'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Entity ID
          </label>
          <input
            v-model="properties.entity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. projectile"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Gravity Scale
          </label>
          <input
            v-model.number="properties.scale"
            @change="updateProperties"
            type="number"
            step="0.1"
            placeholder="1.0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            1.0 = normal, 0.5 = half gravity (moon), 2.0 = double gravity
          </p>
        </div>

        <!-- GetEntity properties -->
        <div v-else-if="selectedNode.type === 'GetEntity'">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
            helperText="Outputs entity reference and 'exists' boolean for validation"
          />
        </div>

        <!-- GetEntityPosition properties -->
        <div v-else-if="selectedNode.type === 'GetEntityPosition'">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
            helperText="Outputs the x, y coordinates of the entity"
          />
        </div>

        <!-- AIAimAt properties -->
        <div v-else-if="selectedNode.type === 'AIAimAt'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            From Entity (Shooter)
          </label>
          <input
            v-model="properties.fromEntity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. tank2"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            To Entity (Target)
          </label>
          <input
            v-model="properties.toEntity"
            @change="updateProperties"
            type="text"
            placeholder="e.g. tank1"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Accuracy (0.0 - 1.0)
          </label>
          <input
            v-model.number="properties.accuracy"
            @change="updateProperties"
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="0.5"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            1.0 = perfect aim, 0.5 = medium (±10°), 0.0 = terrible (±20°)
          </p>
        </div>

        <!-- RandomRange properties -->
        <div v-else-if="selectedNode.type === 'RandomRange'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Min Value
          </label>
          <input
            v-model.number="properties.min"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Max Value
          </label>
          <input
            v-model.number="properties.max"
            @change="updateProperties"
            type="number"
            placeholder="100"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Generates random integer between min and max (inclusive)
          </p>
        </div>

        <!-- CalculateAngle properties -->
        <div v-else-if="selectedNode.type === 'CalculateAngle'" class="space-y-2">
          <p class="text-xs text-gray-500 mb-2">
            Calculates angle and distance between two points
          </p>
          <label class="block text-sm font-medium text-gray-700">
            From X
          </label>
          <input
            v-model.number="properties.fromX"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            From Y
          </label>
          <input
            v-model.number="properties.fromY"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            To X
          </label>
          <input
            v-model.number="properties.toX"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            To Y
          </label>
          <input
            v-model.number="properties.toY"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <!-- CompareNumbers properties -->
        <div v-else-if="selectedNode.type === 'CompareNumbers'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Value A
          </label>
          <input
            v-model.number="properties.a"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Value B
          </label>
          <input
            v-model.number="properties.b"
            @change="updateProperties"
            type="number"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Has 3 outputs: > (greater), < (less), = (equal)
          </p>
        </div>

        <!-- DestroyTerrainCircle properties -->
        <div v-else-if="selectedNode.type === 'DestroyTerrainCircle'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Terrain Entity ID
          </label>
          <input
            v-model="properties.terrainEntity"
            @change="updateProperties"
            type="text"
            placeholder="terrain"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            X Position
          </label>
          <input
            v-model.number="properties.x"
            @change="updateProperties"
            type="number"
            placeholder="400"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Y Position
          </label>
          <input
            v-model.number="properties.y"
            @change="updateProperties"
            type="number"
            placeholder="300"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          <label class="block text-sm font-medium text-gray-700">
            Crater Radius
          </label>
          <input
            v-model.number="properties.radius"
            @change="updateProperties"
            type="number"
            placeholder="30"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Removes a circular area from terrain at impact point
          </p>
        </div>

        <!-- GetProjectileImpactPosition properties -->
        <div v-else-if="selectedNode.type === 'GetProjectileImpactPosition'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Projectile Entity ID
          </label>
          <input
            v-model="properties.projectile"
            @change="updateProperties"
            type="text"
            placeholder="e.g. cannonball"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <p class="text-xs text-gray-500 mt-1">
            Gets x, y coordinates of projectile impact
          </p>
        </div>

        <!-- Entity reference properties -->
        <div v-else-if="['Destroy', 'SetCameraFollow'].includes(selectedNode.type)">
          <EntitySelect
            v-model="properties.entity"
            @update:modelValue="updateProperties"
            label="Entity ID"
            placeholder="Select entity..."
            helperText="Choose from spawned entities or enter custom ID"
          />
        </div>
      </div>

      <button
        @click="deleteNode"
        class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
      >
        Delete Node
      </button>
    </div>

    <div v-else class="text-sm text-gray-500">
      Select a node to view its properties
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useEditorStore } from '@/stores/editorStore'
import { NodeRegistry } from '@/runtime/NodeRegistry'
import EntitySelect from './EntitySelect.vue'

const editorStore = useEditorStore()

const selectedNode = computed(() => editorStore.selectedNode)
const nodeEntry = computed(() => {
  if (!selectedNode.value) return null
  return NodeRegistry.get(selectedNode.value.type)
})

const properties = reactive<Record<string, any>>({})

// Watch for selected node changes
watch(selectedNode, (node) => {
  if (node) {
    Object.assign(properties, node.data.properties)
  }
}, { immediate: true })

function updateProperties() {
  if (selectedNode.value) {
    editorStore.updateNodeProperties(selectedNode.value.id, { ...properties })
  }
}

function deleteNode() {
  if (selectedNode.value) {
    editorStore.removeNode(selectedNode.value.id)
  }
}
</script>
