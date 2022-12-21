import fs from 'fs'

/**
 * It deletes a file at the given path
 * @param {string} path - The path to the file you want to delete.
 */
export async function deleteFile (path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(path, (error: any) => {
      if (error) return reject(error)
      resolve()
    })
  })
}
