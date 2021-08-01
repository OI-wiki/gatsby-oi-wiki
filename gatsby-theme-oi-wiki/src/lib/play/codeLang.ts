export const langModeMap = Object.freeze({
  C: 'c_cpp',
  C99: 'c_cpp',
  C11: 'c_cpp',
  'C++': 'c_cpp',
  'C++98': 'c_cpp',
  'C++14': 'c_cpp',
  'C++17': 'c_cpp',
  'C++20': 'c_cpp',
  Python3: 'python',
  // Javascript: 'javascript',
})

export const langList = Object.keys(langModeMap)
export type LangType = keyof typeof langModeMap
