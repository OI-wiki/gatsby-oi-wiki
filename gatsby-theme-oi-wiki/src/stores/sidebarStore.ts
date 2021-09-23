import { CreateObservableOptions, observable } from 'mobx'

interface SidebarStore {
  collapsed: boolean;
  width: number;

  setCollapsed(val: boolean): void

  toggleCollapsed(): void
}

const sidebarStoreModel: SidebarStore = {
  collapsed: false,
  width: 300,

  setCollapsed(val) {
    this.collapsed = val
  },

  toggleCollapsed() {
    this.collapsed = !this.collapsed
  },
}

const sidebarStoreOption: CreateObservableOptions = {
  autoBind: true,
}

const tocSidebarStore = observable(sidebarStoreModel, undefined, sidebarStoreOption)

const navSidebarStore = observable(sidebarStoreModel, undefined, sidebarStoreOption)

export { tocSidebarStore, navSidebarStore }
