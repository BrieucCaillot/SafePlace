export default abstract class AbstractEventEmitter<ID, INFO> {
  protected callbackAssoc: Map<ID, ((info: INFO) => void)[]> = new Map()

  Subscribe(id: ID, callback: (info: INFO) => void) {
    if (this.callbackAssoc.has(id)) {
      this.callbackAssoc.get(id)?.push(callback)
    } else {
      this.callbackAssoc.set(id, [callback])
    }
  }

  Unsubscribe(id: ID, callback: (info: INFO) => void) {
    if (this.callbackAssoc.has(id)) {
      const callbacks = this.callbackAssoc.get(id) as ((info: INFO) => void)[]
      const index = callbacks.indexOf(callback, 0)
      if (index > -1) callbacks.splice(index, 1)
      if (callbacks.length === 0) this.callbackAssoc.delete(id)
    }
  }

  protected Emit(id: ID, info: INFO) {
    if (this.callbackAssoc.has(id)) {
      const callbacks = this.callbackAssoc.get(id) as ((info: INFO) => void)[]
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](info)
      }
    }
  }
}
