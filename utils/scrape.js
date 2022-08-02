const puppeteer = require("puppeteer");
const fs = require("fs").promises,
  PDFParser = require("pdf2json");

class Links {
  getFrom() {
    return `https://payme.hsbc.com.hk/zh-hk/merchant-list`;
  }

  getToArr() {
    const promisedFile = new Promise((resolve, reject) => {
      const toLinks = [];
      const res = fs.readFile("target.json", (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        for (let i in parsedData) {
          toLinks.push(
            `https://www.google.com/search?q=${parsedData[i]}&sourceid=chrome&ie=UTF-8`
          );
        }
        //   console.log(toLinks);
        return toLinks;
      });
      resolve(toLinks);
    });
    // return toLinks;
    return promisedFile;
  }
}

//TODO: add class name checking
const classNames = {
  payme: "name",
};

const scraperGoog = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    const toLinks = [];
    const data = await fs.readFile("target.json", (err, data) => {
      if (err) throw err;
      //   console.log(toLinks);
    });
    const dataObj = JSON.parse(data.toString());
    for (let i in dataObj) {
      toLinks.push(
        `https://www.google.com/search?q=${dataObj[i]}&sourceid=chrome&ie=UTF-8`
      );
    }
    // console.log(JSON.parse(data.toString()));

    // console.log(toLinks[0]);
    const resArr = [];
    for (let i = 0; i < 10; i++) {
      await page.goto(toLinks[i]);
      const googRes = await page.evaluate(() => {
        return document.getElementsByTagName("cite")[i].innerText;
      });
      resArr.push(googRes);
      console.log(
        "🚀 ~ file: scrape.js ~ line 59 ~ googRes ~ document",
        googRes,
        resArr
      );
    }
  } catch (err) {
    console.error(err);
  }

  await browser.close();
};

const scraperPayme = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const testLink = new Links();
    await page.goto(`${testLink.from}`);

    const data = await page.evaluate(() => {
      const merchantArr = [];
      const merchantHtmlCol = document.getElementsByClassName(
        `${classNames.payme}`
      );
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

scraperGoog();
