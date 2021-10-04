import { BytemdPlugin } from 'bytemd'
import rehypePseudo, { PseudoOptions } from 'rehype-pseudo'

export default function pseudo(options?: Omit<PseudoOptions, 'mathEngine' | 'mathRenderer'>): BytemdPlugin {
  const opts = {
    mathEngine: 'katex',
    mathRenderer: (math: any) => `<span class="math math-inline">${math}</span>`,
    ...options,
  }
  return {
    rehype: processor => processor.use(rehypePseudo as any, opts),
  }
}
