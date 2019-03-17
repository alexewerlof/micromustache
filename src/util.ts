export class CachedFn<T> {
  private cache: {
    [key: string]: T
  } = {}

  private keys: string[]
  private currKeyIndex = 0

  constructor(private fn: (arg: string) => T, private size: number = 100) {
    this.keys = new Array(size)
  }

  public clear() {
    this.cache = {}
  }

  public obtain(key: string): T {
    let result = this.cache[key]
    if (!result) {
      result = this.cache[key] = this.fn(key)
      const keyToDelete = this.keys[this.currKeyIndex]
      if (keyToDelete !== undefined) {
        delete this.cache[keyToDelete]
      }
      this.keys[this.currKeyIndex] = key
      this.currKeyIndex++
      this.currKeyIndex %= this.size
    }
    return result
  }
}
