export default function trimTrailingSlash(str?: string): string {
  return str?.replace(/\/$/, '')
}
