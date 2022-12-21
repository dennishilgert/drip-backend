/**
 * It returns the extension of a file name, or the file name itself if it doesn't have an extension
 * @param {string} fileName - The name of the file to extract the extension from.
 * @returns The file extension of the file name.
 */
export function extractExtension(fileName: string): string | undefined {
  return fileName.includes('.') ? fileName.split('.').pop() : fileName
}

/**
 * It takes a file name as a string and returns the file name without the extension
 * @param {string} fileName - The name of the file to extract the name from.
 * @returns The first element of the array returned by the split method.
 */
export function extractName(fileName: string): string {
  return fileName.includes('.') ? fileName.split('.').shift()! : fileName
}
