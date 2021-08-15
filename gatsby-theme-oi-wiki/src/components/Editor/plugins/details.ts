import { BytemdPlugin } from "bytemd";

const remarkDetails = require("remark-details");
const rehypeDetails = require("rehype-details");
export default function math(): BytemdPlugin {
	return {
		remark: u => u.use(remarkDetails),
		rehype: u => u.use(rehypeDetails)
	}
}