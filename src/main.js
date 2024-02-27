import { AnthropicClient } from "./client/first.js";

const client = new AnthropicClient(false);
await client.setup();
const res = await client.send("Hii i love claude!");
console.log(res.output);
await client.close();