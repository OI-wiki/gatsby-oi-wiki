import { observable } from 'mobx'

interface SearchStore {
  searchKey: string;
  open: boolean;
  isFirstRun: boolean;

  setSearchKey(val: string): void;

  setOpen(val: boolean): void;

  disableSearch(): void;

  enableSearch(): void;

  setIsFirstRun(val: boolean): void;
}

const searchStore = observable<SearchStore>({
  searchKey: '',
  open: false,
  isFirstRun: true,

  setSearchKey(val) {
    this.searchKey = val
  },

  setOpen(val) {
    this.open = val
  },

  disableSearch() {
    this.open = false
  },

  enableSearch() {
    this.open = true
  },

  setIsFirstRun(val) {
    this.isFirstRun = val
  },
}, undefined, {
  autoBind: true,
})

export { searchStore }
