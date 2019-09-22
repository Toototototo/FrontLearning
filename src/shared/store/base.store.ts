import * as ElectronStore from 'electron-store';

export class BaseStore {

  protected store: ElectronStore<any>;

  constructor(protected name: string) {
    this.store = new ElectronStore({
      name: name,
    });
  }

  public lastId<T>(): number {
    const lastElem: any = this._all<T[]>().pop();
    if (lastElem) {
      return lastElem.id;
    }
    return 1;
  }

  protected _all<T>(): T[] {
    return this.store.get(this.name, []) as T[];
  }

}
