import { app } from 'electron'
import fs from 'fs/promises'
import path from 'path'

// Exported directly to handle file creation and writing
export async function writeFile({
  fileName,
  content
}: {
  fileName: string
  content: string
}): Promise<string> {
  try {
    // Check if the user provided an absolute path or just a filename
    const isAbsolutePath = fileName.includes('/') || fileName.includes('\\')

    // Default to the user's desktop if no absolute path is provided
    const targetPath = isAbsolutePath ? fileName : path.join(app.getPath('desktop'), fileName)

    await fs.writeFile(targetPath, content, 'utf-8')
    return `Success. File saved to: ${targetPath}`
  } catch (err) {
    return `Error writing file: ${err}`
  }
}
