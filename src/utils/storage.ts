export function readNumberFromStorage(key: string, fallback: number) {
  const rawValue = window.localStorage.getItem(key)
  const parsedValue = rawValue === null ? Number.NaN : Number(rawValue)

  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

export function writeNumberToStorage(key: string, value: number) {
  window.localStorage.setItem(key, String(value))
}
