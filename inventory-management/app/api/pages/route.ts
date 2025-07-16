import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create_page':
        return await createPageFile(data)
      case 'update_page':
        return await updatePageFile(data)
      case 'delete_page':
        return await deletePageFile(data)
      case 'list_pages':
        return await listPages()
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error handling page generation request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process page generation request' },
      { status: 500 }
    )
  }
}

async function createPageFile(data: { path: string; content: string; overwrite?: boolean }): Promise<NextResponse> {
  const { path: filePath, content, overwrite = false } = data
  
  try {
    const fullPath = path.join(process.cwd(), 'app', filePath)
    const dir = path.dirname(fullPath)
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true })
    
    // Check if file exists
    try {
      await fs.access(fullPath)
      if (!overwrite) {
        return NextResponse.json(
          { success: false, error: 'File already exists' },
          { status: 409 }
        )
      }
    } catch {
      // File doesn't exist, which is fine
    }
    
    // Write the file
    await fs.writeFile(fullPath, content, 'utf8')
    
    return NextResponse.json({
      success: true,
      message: 'Page created successfully',
      path: filePath
    })
  } catch (error) {
    console.error('Error creating page file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create page file' },
      { status: 500 }
    )
  }
}

async function updatePageFile(data: { path: string; content: string }): Promise<NextResponse> {
  const { path: filePath, content } = data
  
  try {
    const fullPath = path.join(process.cwd(), 'app', filePath)
    
    // Check if file exists
    await fs.access(fullPath)
    
    // Update the file
    await fs.writeFile(fullPath, content, 'utf8')
    
    return NextResponse.json({
      success: true,
      message: 'Page updated successfully',
      path: filePath
    })
  } catch (error) {
    console.error('Error updating page file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page file' },
      { status: 500 }
    )
  }
}

async function deletePageFile(data: { path: string }): Promise<NextResponse> {
  const { path: filePath } = data
  
  try {
    const fullPath = path.join(process.cwd(), 'app', filePath)
    
    // Delete the file
    await fs.unlink(fullPath)
    
    // Try to remove empty directory
    const dir = path.dirname(fullPath)
    try {
      const files = await fs.readdir(dir)
      if (files.length === 0) {
        await fs.rmdir(dir)
      }
    } catch {
      // Directory not empty or other error, ignore
    }
    
    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
      path: filePath
    })
  } catch (error) {
    console.error('Error deleting page file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page file' },
      { status: 500 }
    )
  }
}

async function listPages(): Promise<NextResponse> {
  try {
    const appDir = path.join(process.cwd(), 'app')
    const pages = await findPageFiles(appDir, appDir)
    
    return NextResponse.json({
      success: true,
      pages
    })
  } catch (error) {
    console.error('Error listing pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list pages' },
      { status: 500 }
    )
  }
}

async function findPageFiles(dir: string, baseDir: string): Promise<string[]> {
  const pages: string[] = []
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Skip api and other special directories
        if (entry.name === 'api' || entry.name.startsWith('_') || entry.name.startsWith('.')) {
          continue
        }
        
        const subPages = await findPageFiles(fullPath, baseDir)
        pages.push(...subPages)
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        const relativePath = path.relative(baseDir, fullPath)
        pages.push(relativePath)
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return pages
}

export async function GET() {
  return await listPages()
}
