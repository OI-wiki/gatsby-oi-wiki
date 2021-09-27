import { observable } from 'mobx'

interface EditWarnStore {
  open: boolean;
  relativePath: string;

  setOpen(val: boolean): void;

  setRelativePath(val: string): void;
}

const editWarnStore = observable<EditWarnStore>({
  open: false,
  relativePath: '',

  setOpen(val: boolean) {
    this.open = val
  },
  setRelativePath(val: string) {
    this.relativePath = val
  },
}, undefined, {
  autoBind: true,
})

export { editWarnStore }
