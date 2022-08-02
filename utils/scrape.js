const puppeteer = require("puppeteer");
const fs = require("fs"),
  PDFParser = require("pdf2json");

const queryStrings = [];

/**cannot involve system font */
const links = {
  from: `https://payme.hsbc.com.hk/zh-hk/merchant-list`,
  to: `https://www.google.com/search?q=${queryStrings[0]}&sourceid=chrome&ie=UTF-8`,
};

const scraperPdf = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(links.from, {
    waitUntil: "networkidle2",
  });
  await page.pdf({ path: links.fromPdf, format: "a4" });

  await browser.close();
};

const scraperPayme = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${links.from}`);

    const data = await page.evaluate(() => {
      const merchantArr = [];
      const merchantHtmlCol = document.getElementsByClassName("name");
      for (let i = 0; i < merchantHtmlCol.length; i++) {
        merchantArr.push(merchantHtmlCol[i].innerHTML.replace("<!---->", ""));
      }
      return merchantArr;
    });
    //condense data into an obj and write to json file
    const merchantObj = {};
    for (let i = 0; i < data.length; i++) {
      merchantObj[i] = data[i];
    }
    fs.writeFile("target.json", JSON.stringify(merchantObj), () => {
      console.log("🚀 ~ file: scrape.js ~ line 44 ~ fs.writeFile ~ target");
    });

    console.log("data:", data);
  } catch (err) {
    console.log(err);
  }
  await browser.close();
};

scraperPayme();
