import React from 'react'

export type Nullable<T> = T | null
export type StrBool = 'true' | 'false'
export type StrIndexObj<T = string> = { [k: string]: T }
export type OnClickHandler<T = HTMLAnchorElement> = ((e: React.MouseEvent<T>) => void)
