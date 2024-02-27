import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth'; // Use v2.4.5 instead of latest
import { USER, PASS } from '../config.js';




puppeteer.use(pluginStealth());

async function setup(init=false) {
    const browser = await puppeteer.launch({headless: false, args: [
        `--user-data-dir=./data`,
    ],});
    const page = await browser.newPage();



    await page.goto("https://claude.ai/");
    await page.waitForTimeout(2500);

    if (init) {

        const googlelogin = await page.$x("/html/body/div[2]/div/main/section/button");
        await googlelogin[0].click();

        const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
        const newPage = await newPagePromise;

        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section/div/div/div[1]/div/div[1]/div/div[1]/input");
        const email = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section/div/div/div[1]/div/div[1]/div/div[1]/input");

        await email[0].type(USER, {delay: 100});

        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button");
        const next = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button");
        await next[0].click();

        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section[2]/div/div/input[1]");
        const password = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section[2]/div/div/input[1]");
        //await password[0].type(PASS, {delay: 120});
        const passwordField = password[0];
        //await passwordField.click({ clickCount: 3 }); // Selects all text in the input
        //await passwordField.press('Backspace'); // Clears the input
        console.log("PASSWORD BEING TYPED: " + PASS);
        await newPage.waitForTimeout(1000);
        await passwordField.type(PASS, { delay: 100 }); // Types the password

        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section[2]/div/div/div[1]/div[3]/div/div[1]/div/div/div[1]/div/input");
        const showpass = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[1]/div/form/span/section[2]/div/div/div[1]/div[3]/div/div[1]/div/div/div[1]/div/input")
        await showpass[0].click();

        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button", { visible: true });
        const next2 = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div[1]/div/div/button");
        await newPage.waitForTimeout(120);
        await next2[0].click();


        await newPage.waitForXPath("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div/div[2]/div/div/button")
        const continueBut = await newPage.$x("/html/body/div[1]/div[1]/div[2]/div/c-wiz/div/div[2]/div/div[2]/div/div/div[2]/div/div/button")
        await continueBut[0].click();
    }
    try {
        // Wait for the page to fully load
        //await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Now wait for the specific element
        await page.waitForXPath("/html/body/main/div[1]/div/div[2]/fieldset/div/div[2]/div[2]/button");

        // Get the element
        const createNewChatElements = await page.$x("/html/body/main/div[1]/div/div[2]/fieldset/div/div[2]/div[2]/button");

        if (createNewChatElements.length > 0) {
            await createNewChatElements[0].click();
        } else {
            console.error('Create new chat button not found');
        }
    } catch (error) {
        console.error('Error occurred:', error);
    }

    await page.waitForXPath("/html/body/div[3]/div/div[3]/div[2]/div/fieldset/div[1]/div/div/div")


    return [page, browser];
}


async function getTextByXPath(xpath, page, timeout = 10000) {
    await page.waitForXPath(xpath);

    let elements = await page.$x(xpath);
    if (elements.length === 0) {
        throw new Error('Element not found');
    }

    let currentText = '';
    let previousText = '';
    let startTime = new Date().getTime();

    // Loop to check for text changes
    while (new Date().getTime() - startTime < timeout) {
        currentText = await page.evaluate(element => element.textContent.trim(), elements[0]);
        
        if (currentText === previousText) {
            // Text content stabilized, break the loop
            break;
        }

        // Update previous text and wait a bit before next check
        previousText = currentText;
        await page.waitForTimeout(500); // Wait for 500ms before next check

        // Re-query the element to get the latest content
        elements = await page.$x(xpath);
        if (elements.length === 0) {
            throw new Error('Element not found');
        }
    }

    return currentText;
}




async function sendMessage(page, message, number) {
    await page.focus('div[contenteditable="true"]');
    await page.keyboard.type(message);



    await page.waitForXPath("/html/body/div[3]/div/div[3]/div[2]/div/fieldset/div[2]/button")
    const send = await page.$x("/html/body/div[3]/div/div[3]/div[2]/div/fieldset/div[2]/button")
    await send[0].click()

    /* get output text */
    const xpath = `/html/body/div[3]/div/div[3]/div[1]/div[${number * 4}]/div/div[1]/p`
    const outputText = await getTextByXPath(xpath, page);

    return outputText;

}


export { setup, sendMessage };