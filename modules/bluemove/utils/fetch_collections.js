const fs = require('fs');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function openBrowser() {
    return await puppeteer.launch({headless: 'new'});
}

async function createPage(browser) {
    return await browser.newPage();
}

async function closeBrowser(browser) {
    await browser.close();
}

async function goToExplorePage(page) {
    console.log('Перехожу на первую страницу с коллекциями');
    await page.goto('https://bluemove.net/explore');
    await page.waitForSelector('.CollectionCard2');
}

async function getCollectionUrls(page) {
    const collectionList = [];

    const processPage = async (currentPage) => {
        try {
            const htmlContent = await currentPage.content();
            const $ = cheerio.load(htmlContent);
            const collectionElements = $('.CollectionCard2');

            collectionElements.each((index, element) => {
                const htmlContent = $(element).html();
                const divContent = '<div class="relative z-10">';
                if (!htmlContent.includes(divContent)) {
                    const href = $(element).find('a.absolute.inset-0.z-0').attr('href');
                    collectionList.push(href);
                }
            });

            const nextPageElement = await currentPage.$x("//li[@class='next']//a[@rel='next']");
            if (nextPageElement.length > 0) {
                console.log('Перехожу на следующую страницу');
                await nextPageElement[0].click();
                await currentPage.waitForSelector('.CollectionCard2');
                console.log('Обрабатываю следующую страницу');
                await processPage(currentPage);
            }
        } catch (error) {
            console.error('Произошла ошибка при обработке страницы:', error);
        }
    };

    await processPage(page);

    console.log('Список коллекций получен');
    return collectionList;
}

(async () => {
    try {
        const browser = await openBrowser();
        const page = await createPage(browser);
        await goToExplorePage(page);
        const collectionList = await getCollectionUrls(page);

        const content = `const collectionUrls = ${JSON.stringify(collectionList, null, 2)};\n\nmodule.exports = { collectionUrls };`;
        fs.writeFile('bluemove_collections.js', content, 'utf8', (err) => {
            if (err) {
                console.error('Ошибка при создании файла:', err);
                return;
            }
            console.log('Файл bluemove_collections.js успешно создан.');
        });

        await closeBrowser(browser);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
})();
