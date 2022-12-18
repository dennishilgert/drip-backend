export enum MimeType {
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TIF = 'image/tiff',
  TIFF = 'image/tiff',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
  ICO = 'image/vnd.microsoft.icon',

  AVI = 'video/x-msvideo',
  MP4 = 'video/mp4',
  MPEG = 'video/mpeg',
  WEBM = 'video/webm',
  OGV = 'video/ogg',

  WAV = 'audio/wav',
  MP3 = 'audio/mpeg',
  WEBA = 'audio/webm',

  TXT = 'text/plain',
  CSV = 'text/csv',
  XML = 'application/xml',
  PDF = 'application/pdf',
  JSON = 'application/json',

  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ODT = 'application/vnd.oasis.opendocument.text',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ODP = 'application/vnd.oasis.opendocument.presentation',

  VSD = 'application/vnd.visio',
  AZW = 'application/vnd.amazon.ebook',
  EPUB = 'application/epub+zip',
  JAR = 'application/java-archive',
  ZIP = 'application/zip',
  GZ = 'application/gzip',
  A7Z = 'application/x-7z-compressed',
  RAR = 'application/vnd.rar',
  TAR = 'application/x-tar'
}

export function isSupported (mimeType: string): boolean {
  const mime: MimeType = getByValue(mimeType)
  if (!mime) return false
  return true
}

export function getByValue (mimeType: string): MimeType {
  return Object.keys(MimeType)[Object.values(MimeType).indexOf(mimeType as MimeType)] as MimeType
}