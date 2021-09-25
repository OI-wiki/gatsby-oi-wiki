import { computed, observable } from 'mobx'

export interface HeaderStore {
  appear: boolean;
  onTop: boolean;

  height: number;

  setAppear(val: boolean): void;

  setOnTop(val: boolean): void;
}


const HEADER_HEIGHT = 60

const headerStore = observable<HeaderStore>({
  appear: true,
  onTop: true,

  get height() {
    return HEADER_HEIGHT
  },

  setAppear(val) {
    this.appear = val
  },
  setOnTop(val) {
    this.onTop = val
  },
}, {
  height: computed,
}, {
  autoBind: true,
})

export { headerStore, HEADER_HEIGHT }
