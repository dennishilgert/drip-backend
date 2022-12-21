import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  animals
} from 'unique-names-generator'

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  separator: ' ',
  length: 2,
  style: 'capital'
}

export function uniqueName (): string {
  return uniqueNamesGenerator(customConfig)
}
