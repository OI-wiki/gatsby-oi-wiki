import { computed, observable } from 'mobx'

export interface HeaderStore {
  appear: boolean;
  appearLock: boolean;
  onTop: boolean;

  height: number;
  currentHeight: number;

  setAppear(val: boolean): void;

  setAppearLock(val: boolean): void;

  setOnTop(val: boolean): void;
}


const HEADER_HEIGHT = 60

const headerStore = observable<HeaderStore>({
  appear: true,
  appearLock: false,
  onTop: true,

  get height() {
    return HEADER_HEIGHT
  },
  get currentHeight() {
    return this.appear ? this.height : 0
  },

  setAppear(val) {
    if (!this.appearLock) {
      this.appear = val
    }
  },
  setAppearLock(val: boolean) {
    this.appearLock = val
  },
  setOnTop(val) {
    this.onTop = val
  },
}, {
  height: computed,
  currentHeight: computed,
}, {
  autoBind: true,
})

export { headerStore, HEADER_HEIGHT }
