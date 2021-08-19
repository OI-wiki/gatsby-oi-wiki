import { BytemdPlugin } from "bytemd";
import remarkDetails from "remark-details";
import rehypeDetails from "rehype-details";

export default function math(): BytemdPlugin {
	return {
		remark: processor => processor.use(remarkDetails as any).use(rehypeDetails as any),
	}
}