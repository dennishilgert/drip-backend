/**
 * It returns a string representation of the given value, or an empty string if the value is undefined
 * or null
 * 
 * @param {any} value - any
 * @param {boolean} [trimmed=false] - boolean = false
 * @returns A string value
 */
 export function asString (value: any, trimmed: boolean = false): string {
  const str = value === undefined || value === null ? '' : String(value)
  return trimmed ? str.trim() : str
}

/**
 * It converts a value to a number, or returns NaN if the value is null or an empty string
 * 
 * @param {any} value - any
 * @returns A number value
 */
export function asNumber (value: any): number {
  return (value === null || value === '') ? NaN : Number(value)
}

/**
 * It returns true if the value is 1, '1', true, or 'true', and false otherwise
 * 
 * @param {any} value - any
 * @returns A boolean value
 */
export function asBoolean (value: any): boolean {
  return (value === 1 || value === '1' || value === true || value === 'true') ? true : false
}
