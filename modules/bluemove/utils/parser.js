const puppeteer = require('puppeteer');
const { creatorAddresses } = require('./bluemove_helpers');

const {
    max_amount_to_buy: amount_to_buy
} = require('../../../config').BlueMove;


function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


async function createPage(browser) {
    return await browser.newPage();
}


async function processCollectionPage(page, collectionPageUrl, randomCollectionUrl) {
    try {
        await page.goto(collectionPageUrl);

        let foundNFT = null;
        let collectionInfo = null;

        const result = await Promise.race([
            page.waitForFunction(() => {
                const nftElements = document.querySelectorAll('.nc-CardNFT a.absolute.inset-0.z-10');
                return nftElements.length > 0;
            }),
            page.waitForTimeout(5000)
        ]);

        if (result) {
            collectionInfo = await page.$eval('.max-w-screen-sm', element => {
                const collectionClass = element.querySelector('h2[class="inline-block text-2xl sm:text-3xl lg:text-4xl font-semibold"]');
                const collection = collectionClass ? collectionClass.innerText : '';
                return { collection };
            });

            const nftElements = await page.$$('.nc-CardNFT');

            for (const element of nftElements) {
                const nameClass = await element.$('h2[class="text-xs sm:text-base font-medium h-[30px] sm:h-[45px] line-clamp-2"]');
                const nftid = nameClass ? await page.evaluate(nft => nft.innerText, nameClass) : '';
                const hrefClass = await element.$('a[class="absolute inset-0 z-10"]');
                const href = hrefClass ? await page.evaluate(a => a.href, hrefClass) : '';
                const priceSpan = await element.$('span[class="mt-[3px] sm:mt-[2px] text-xs sm:text-sm 2xl:text-base"]');
                const price = priceSpan ? await page.evaluate(span => span.innerText, priceSpan) : '';

                const numericPrice = parseFloat(price.replace(',', ''));
                if (numericPrice < amount_to_buy && !price.includes(',') && !price.includes('M')) {
                    const creator = creatorAddresses[randomCollectionUrl] || '';
                    foundNFT = { creator, collection: collectionInfo.collection, nftid, price, href };
                    break;
                }
            }
        }

        return foundNFT;
    } catch (error) {
        console.error('Произошла ошибка при обработке страницы коллекции:', error);
        return null;
    }
}


async function processCollections(collectionList) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await createPage(browser);
    const usedUrls = new Set();

    try {
        while (collectionList.length > usedUrls.size) {
            let randomCollectionUrl;

            do {
                randomCollectionUrl = getRandomElement(collectionList);
            } while (usedUrls.has(randomCollectionUrl));

            usedUrls.add(randomCollectionUrl);

            const fullCollectionUrl = `https://bluemove.net${randomCollectionUrl}`;
            const nftList = await processCollectionPage(page, fullCollectionUrl, randomCollectionUrl);

            if (nftList) {
                return nftList;
            }
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    } finally {
        await browser.close();
    }

    return null;
}


module.exports = {
    processCollections
};
