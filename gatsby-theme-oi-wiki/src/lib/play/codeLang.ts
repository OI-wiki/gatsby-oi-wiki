export const langModeMap = Object.freeze({
  C: 'c_cpp',
  'C++': 'c_cpp',
  Java: 'java',
  Python: 'python',
})

export const langList = Object.keys(langModeMap)
export type LangType = keyof typeof langModeMap
