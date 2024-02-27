## AutoChat

This is a WIP that uses puppeteer to talk to Claude programatically.

It currently supports:
  - An easy-to-use client
  - Keeping data for quick login

## How to use

First, `git clone https://github.com/ashercn97/AutoChat.git`
Then, setup a `config.js` file in the root of the project. It should look like:

```
const USER = 'google username'
const PASS = "google password"

export { USER, PASS }
```

Finally, write the code! Here is what it could look like:

```
import { AnthropicClient } from "./src/client/first.js";

const client = new AnthropicClient(false); // whether or not youve used it before/there is a data folder on your computer. You must change it once you use it.
await client.setup();
const res = await client.send("API For free?!?!");
console.log(res.output);
await client.close();
```

## Plans
* move to typescript
* implement a self-hosted server
* figure out how to make it work in headless mode/write a workaround
