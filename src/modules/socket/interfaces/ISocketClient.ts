export interface ISocketClient {
  emitEvent (event: string, data?: string | null, excludes?: string[]): boolean
  injectListener (event: string, listener: (...args: any[]) => void): void
}