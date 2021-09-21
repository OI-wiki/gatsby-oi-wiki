import { makePersistable, stopPersisting } from 'mobx-persist-store'
import { PersistenceStorageOptions } from 'mobx-persist-store/lib/esm2017/types'
import { AnnotationsMap, CreateObservableOptions, IReactionOptions, observable } from 'mobx'
import * as localforage from 'localforage'

type WithPersistFunc<T> = T & {
  stopStore(): void
}

type PersistStore =
  <T extends Record<string, any>>
  (value: T,
   storageOptions: PersistenceStorageOptions<keyof T>,
   otherOptions?: {
     decorators?: AnnotationsMap<T, never>,
     observableOptions?: CreateObservableOptions,
     localforageOptions?: LocalForageOptions,
     reactionOptions?: IReactionOptions<T>
   }
  ) => WithPersistFunc<T>;


const forageInstanceMap = new Map<string, LocalForage>()

const persistStore: PersistStore = (value, storageOptions, otherOptions) => {
  const target = Object.assign(value, {
    stopStore() {
      stopPersisting(this)
    },
  })

  // do nothing if not in browser
  if (typeof window === 'undefined') return target
  console.log(target)

  const { decorators, observableOptions, localforageOptions, reactionOptions } = otherOptions || {}

  const forageOptions = {
    name: 'persist-info',
    ...localforageOptions,
  }

  const persistStorage = forageInstanceMap.get(forageOptions.name)
    ?? forageInstanceMap
      .set(forageOptions.name, localforage.createInstance(forageOptions))
      .get(forageOptions.name)

  const store = observable<WithPersistFunc<typeof value>>(
    target,
    decorators,
    {
      autoBind: true,
      ...observableOptions,
    })

  makePersistable(
    store,
    {
      storage: persistStorage,
      // one day
      expireIn: 24 * 60 * 60 * 1000,
      removeOnExpiration: true,
      stringify: false,
      debugMode: process.env.NODE_ENV === 'development',
      ...storageOptions,
    },
    {
      delay: 200,
      ...reactionOptions,
    },
  )

  return store
}

export default persistStore
