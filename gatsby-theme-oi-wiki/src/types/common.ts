import React from 'react'

export type Nullable<T> = T | null
export type StrIndexObj<T = string> = { [k: string]: T }
export type OnClickHandler<T = HTMLAnchorElement> = ((e: React.MouseEvent<T>) => void)
export type RequiredNonNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
}
