import {setup, sendMessage} from '../main_logic.js';



class AnthropicClient {
    constructor(init) {
        this.page = null;
        this.browser = null;
        this.issetup = false
        this.number = 1;
        this.init = init;
    }
    async setup() {
        [this.page, this.browser] = await setup(this.init);
        this.issetup = true
    }
    async send(message) {
        if (this.issetup) {
        const outputText = await sendMessage(this.page, message, this.number);
        this.number++;
        return {"output": outputText, "input": message};
        }
        else {
            throw new Error('Client not setup, run setup() first');
        }
    }
    async close() {
        await this.browser.close();
    }

}

export {AnthropicClient};