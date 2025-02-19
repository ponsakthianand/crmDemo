export function generateUniqueId(): string {
  const timestamp = Date.now().toString().slice(-7)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return timestamp + random
}

