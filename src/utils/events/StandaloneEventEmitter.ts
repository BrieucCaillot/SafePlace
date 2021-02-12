import AbstractEventEmitter from './AbstractEventEmitter'

export default abstract class StandaloneEventEmitter<ID, INFO> extends AbstractEventEmitter<ID, INFO> {
  protected isRunning: boolean = false

  public Subscribe(...params: Parameters<AbstractEventEmitter<ID, INFO>['Subscribe']>) {
    super.Subscribe(...params)
    if (!this.isRunning) {
      this.isRunning = true
      this.Start()
    }
  }

  public Unsubscribe(...params: Parameters<AbstractEventEmitter<ID, INFO>['Unsubscribe']>) {
    super.Unsubscribe(...params)
    if (this.isRunning && this.callbackAssoc.size === 0) {
      this.isRunning = false
      this.Stop()
    }
  }

  protected abstract Start(): void
  protected abstract Stop(): void
}
