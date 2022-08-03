const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const main = () => {
  googleScrape();
};

const launchingBrowser = (fn) => {
  return async function (fn) {
    const browser = await puppeteer.launch({ headless: false });
    try {
      const page = await browser.newPage();
      fn(page);
    } catch (e) {
      console.error(e);
    }
  };
};

const googleScrape = async () => {
  const arr = [
    "https://www.google.com/search?q=3hreesixty&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=3hreesixty&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=3hreesixty&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=Ecco&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
    "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
  ];
  try {
    //TODO setTimeout to scrape google, 10 times each interval
    // run 3 times as trial
    
    const linksRes = arr.map(async (_, i) => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(arr[i]);
          const googRes = await page.evaluate(() => {
            //TODO add regex
          return document.getElementsByTagName("cite")[0].innerText;
        });
        await browser.close();
        return googRes;
    });
    await Promise.all(linksRes).then((res) => {
      fs.writeFile("google.json", JSON.stringify(res), () => {
        console.log("🚀 ~ file: scrape.js ~ line 44 ~ fs.writeFile ~ linkRes");
      });
    });
  } catch (e) {
    console.error(e);
  }
};

main();
