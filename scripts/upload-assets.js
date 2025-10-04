/**
 * Script to generate and upload placeholder game assets to Appwrite Storage
 * Usage: node scripts/upload-assets.js
 */

import { Client, Storage, ID } from 'node-appwrite'
import { createCanvas } from 'canvas'
import { writeFileSync, unlinkSync, readFileSync } from 'fs'
import { config } from 'dotenv'
import { File } from 'buffer'

// Load environment variables from multiple .env files
config({ path: '.env.development' })
config({ path: '.env.production', override: false })
config({ path: '.env', override: false })

// Get API key from environment or command line argument
const apiKey = process.env.Developer_Key || process.env.APPWRITE_API_KEY || process.argv[2]

if (!apiKey) {
  console.error('❌ API Key required!')
  console.error('Usage: node scripts/upload-assets.js <YOUR_API_KEY>')
  console.error('Or add Developer_Key=<key> to .env file')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(apiKey)

const storage = new Storage(client)
const bucketId = process.env.VITE_APPWRITE_ASSETS_BUCKET_ID || 'assets'

// Asset definitions
const assets = [
  // Flappy Bird assets
  { name: 'bird', width: 40, height: 40, color: '#FFD700', type: 'image/png' },
  { name: 'pipe', width: 60, height: 400, color: '#2ECC71', type: 'image/png' },
  { name: 'ground', width: 800, height: 100, color: '#8B4513', type: 'image/png' },

  // Platformer assets
  { name: 'player', width: 32, height: 48, color: '#3B82F6', type: 'image/png' },
  { name: 'platform', width: 100, height: 20, color: '#6B7280', type: 'image/png' },
  { name: 'coin', width: 24, height: 24, color: '#FBBF24', type: 'image/png' },

  // Space Shooter assets
  { name: 'ship', width: 48, height: 48, color: '#60A5FA', type: 'image/png' },
  { name: 'enemy', width: 40, height: 40, color: '#EF4444', type: 'image/png' },
  { name: 'bullet', width: 8, height: 16, color: '#FACC15', type: 'image/png' },

  // Breakout assets
  { name: 'paddle', width: 100, height: 20, color: '#8B5CF6', type: 'image/png' },
  { name: 'ball', width: 20, height: 20, color: '#F3F4F6', type: 'image/png' },
  { name: 'brick', width: 60, height: 30, color: '#F59E0B', type: 'image/png' },

  // Tank Wars assets
  { name: 'tank', width: 48, height: 48, color: '#059669', type: 'image/png' },
  { name: 'wall', width: 40, height: 40, color: '#6B7280', type: 'image/png' }
]

/**
 * Generate a colored rectangle PNG image
 */
function generateImage(width, height, color, filename) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fill with color
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)

  // Add border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, width, height)

  // Save to file
  const buffer = canvas.toBuffer('image/png')
  writeFileSync(filename, buffer)

  return filename
}

/**
 * Upload a file to Appwrite Storage
 */
async function uploadAsset(asset) {
  const filename = `./temp_${asset.name}.png`

  try {
    // Generate placeholder image
    console.log(`Generating ${asset.name}...`)
    generateImage(asset.width, asset.height, asset.color, filename)

    // Upload to Appwrite
    console.log(`Uploading ${asset.name} to Appwrite...`)

    // Read file as buffer and create a File object
    const fileBuffer = readFileSync(filename)
    const fileObj = new File([fileBuffer], `${asset.name}.png`, { type: 'image/png' })

    // Use the asset name as the file ID for consistency
    const file = await storage.createFile(
      bucketId,
      asset.name, // Use asset name as ID for easy reference
      fileObj
    )

    console.log(`✅ Uploaded ${asset.name} (ID: ${file.$id})`)

    // Clean up temp file
    unlinkSync(filename)

    return file
  } catch (error) {
    // Clean up temp file on error
    try {
      unlinkSync(filename)
    } catch (e) {
      // Ignore cleanup errors
    }

    if (error.code === 409) {
      console.log(`⚠️  ${asset.name} already exists, skipping...`)
    } else {
      console.error(`❌ Failed to upload ${asset.name}:`, error.message)
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting asset upload...\n')
  console.log(`Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`)
  console.log(`Project: ${process.env.VITE_APPWRITE_PROJECT_ID}`)
  console.log(`Bucket: ${bucketId}\n`)

  // Upload all assets
  for (const asset of assets) {
    await uploadAsset(asset)
  }

  console.log('\n✨ Asset upload complete!')
}

main().catch(console.error)
