import { BrowserWindow, app, safeStorage } from 'electron'
import path from 'path'
import fsSync from 'fs'
import { InferenceClient } from '@huggingface/inference'

export const handleImageGeneration = async (prompt: string) => {
  const mainWindow = BrowserWindow.getAllWindows()[0]

  // Tell frontend to show loading state immediately via IPC
  if (mainWindow) {
    mainWindow.webContents.send('image-gen', { prompt: prompt, loading: true, base64: '' })
  }

  try {
    let hfKey = ''
    const secureConfigPath = path.join(app.getPath('userData'), 'iris_secure_vault.json')

    // ── 1. Fetch Secure Local Key (Using your exact vault logic) ──
    if (fsSync.existsSync(secureConfigPath)) {
      try {
        const data = JSON.parse(fsSync.readFileSync(secureConfigPath, 'utf8'))
        // Assumes you saved it as "huggingface" in your JSON vault
        if (data.huggingface) {
          if (safeStorage.isEncryptionAvailable()) {
            hfKey = safeStorage.decryptString(Buffer.from(data.huggingface, 'base64'))
          } else {
            hfKey = Buffer.from(data.huggingface, 'base64').toString('utf8')
          }
        }
      } catch (e) {
        console.error('Failed to parse secure vault:', e)
      }
    }

    if (!hfKey || hfKey.trim() === '') {
      throw new Error(
        'Missing Hugging Face API Key. Please enter it in the Command Center Vault (Settings Tab).'
      )
    }

    const client = new InferenceClient(hfKey)

    // ── 2. Generate Image ──
    const imageBlob: any = await client.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt
    })

    // ── 3. Node.js Safe Blob to Base64 Conversion (Fixes URL.createObjectURL crash) ──
    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`

    // Send successful result down the IPC line
    if (mainWindow) {
      mainWindow.webContents.send('image-gen', {
        base64: base64Image,
        prompt: prompt,
        loading: false,
        error: false
      })
    }

    return `Visual generated successfully using FLUX.`
  } catch (e: any) {
    let errorMessage = e.message

    if (errorMessage.includes('503') || errorMessage.includes('loading')) {
      errorMessage = 'Model is warming up (Free Tier). Please try again in 20 seconds.'
    }

    // Send error down the IPC line
    if (mainWindow) {
      mainWindow.webContents.send('image-gen', {
        base64: '',
        prompt: prompt,
        loading: false,
        error: true,
        errorMessage: errorMessage
      })
    }

    return `Generation failed: ${errorMessage}`
  }
}
