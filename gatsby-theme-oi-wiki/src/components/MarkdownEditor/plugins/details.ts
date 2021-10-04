import { BytemdPlugin } from 'bytemd'
import remarkDetails from 'remark-details'

export default function math(): BytemdPlugin {
  return {
    remark: processor => processor.use(remarkDetails as any),
  }
}
