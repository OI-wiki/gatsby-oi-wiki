import { action, computed, observable } from 'mobx'

export interface HeaderStore {
  appear: boolean;

  height: number;

  setAppear(val: boolean): void;
}


const HEADER_HEIGHT = 60

const headerStore = observable<HeaderStore>({
  appear: true,

  get height() {
    return HEADER_HEIGHT
  },

  setAppear(val) {
    this.appear = val
  },
}, {
  height: computed,

  setAppear: action.bound,
})

export { headerStore, HEADER_HEIGHT }
