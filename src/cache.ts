export type CacheFn<T> = (key: string) => T[]

export class Cache<T> {
  private memory: {
    [key: string]: T[]
  } = {}
  private keys: string[]
  constructor(length = 1000) {
    this.keys = new Array(length)
  }
  get length() {
    return this.keys.length
  }
  public getItem(fn: CacheFn<T>, key: string): T[] {
    if (!this.memory[key]) {
      this.memory[key] = fn(key)
    }
    return this.memory[key]
  }
}
