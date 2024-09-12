const puppeteer = require('puppeteer');

async function createPage(browser) {
    return await browser.newPage();
}

async function processCollectionPage(page, collectionPageUrl, creator) {
    try {
        await page.goto(collectionPageUrl);

        await page.waitForXPath('//*[@id="Domain"]');
        const [checkboxHandle] = await page.$x('//*[@id="Domain"]');
        if (checkboxHandle) {
            await page.evaluate(element => element.click(), checkboxHandle);
        }

        // Задержка перед проверкой изменения списка NFT
        await page.waitForTimeout(5000);

        // Ждем изменения списка NFT
        await page.waitForFunction(() => {
            const nftElements = document.querySelectorAll('.nc-CardNFT a.absolute.inset-0.z-10');
            return nftElements.length > 0;
        });

        // Продолжаем обработку страницы и выбираем первый NFT
        const collectionInfo = await page.$eval('.max-w-screen-sm', element => {
            const collectionClass = element.querySelector('h2[class="inline-block text-2xl sm:text-3xl lg:text-4xl font-semibold"]');
            const collection = collectionClass ? collectionClass.innerText : '';
            return { collection };
        });

        const nftElements = await page.$$('.nc-CardNFT');
        const firstNftElement = nftElements[0];
        const nameClass = await firstNftElement.$('h2[class="text-xs sm:text-base font-medium h-[30px] sm:h-[45px] line-clamp-2"]');
        const nftid = nameClass ? await page.evaluate(nft => nft.innerText, nameClass) : '';
        const hrefClass = await firstNftElement.$('a[class="absolute inset-0 z-10"]');
        const href = hrefClass ? await page.evaluate(a => a.href, hrefClass) : '';
        const priceSpan = await firstNftElement.$('span[class="mt-[3px] sm:mt-[2px] text-xs sm:text-sm 2xl:text-base"]');
        const price = priceSpan ? await page.evaluate(span => span.innerText, priceSpan) : '';

        const foundNFT = { creator, collection: collectionInfo.collection, nftid, price, href };

        return foundNFT;
    } catch (error) {
        console.error('Произошла ошибка при обработке страницы коллекции:', error);
        return null;
    }
}

async function processCollection() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await createPage(browser);
    const collectionPageUrl = 'https://bluemove.net/collection/aptos-names-v1';
    const creator = '0x305a97874974fdb9a7ba59dc7cab7714c8e8e00004ac887b6e348496e1981838';

    try {
        return await processCollectionPage(page, collectionPageUrl, creator)
    } catch (error) {
        console.error('Произошла ошибка:', error);
    } finally {
        await browser.close();
    }
}


module.exports = {
    processCollection
}
