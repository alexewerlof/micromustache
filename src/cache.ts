export class Cache<T> {
  private memory: {
    [key: string]: T
  } = {}

  private keys: string[]
  private currentKeyIndex = 0

  constructor(private fn: (key: string) => T, length = 1000) {
    this.keys = new Array(length)
  }

  public get(key: string): T {
    const hitResult = this.memory[key]
    if (hitResult === undefined) {
      const oldKey = this.keys[this.currentKeyIndex]
      // if this spot currentKeyIndex is pointing to is taken by an older cache key
      if (oldKey) {
        // remove the old key from the cache
        delete this.memory[oldKey]
      }
      // Add the new item to the cache
      this.keys[this.currentKeyIndex] = key
      this.memory[key] = this.fn(key)

      // increase current key index to point to the next candidate for removing from the cache
      this.currentKeyIndex++
      if (this.currentKeyIndex >= this.keys.length) {
        this.currentKeyIndex = 0
      }
    }
    return hitResult
  }
}
