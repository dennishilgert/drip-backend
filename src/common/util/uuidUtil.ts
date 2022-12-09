import crypto from 'crypto'

export function generateUuid (): string {
  return crypto.randomUUID()
}