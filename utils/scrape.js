const puppeteer = require("puppeteer");
const fs = require("fs").promises,
  PDFParser = require("pdf2json");
// const path =require("path") ;
// const __dirname = path.dirname(__filename);

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

const filePaths = {
  googleJson: "google.json",
};

const convertArrayToJsonObj = (arr) => {
  const jsonObj = {};
  //TODO: write async func for replacement of  ">"
  arr.forEach((ele, _) => (jsonObj[ele.replace('›','')] = ele));
  console.log(jsonObj);
  return JSON.stringify(jsonObj);
};

const fileWriting = async (res) => {
  console.log("hiiii", res);

  try {
    //if file exists, add data

    //writing into file
    /** using flag in writeFile for adding doc*/
    await fs.writeFile(
      filePaths.googleJson,
      ',' + convertArrayToJsonObj(res),
      { flag: "a" },
      (err) => {
        if (err) {
          throw err;
        }
        console.log("Adding data Success");
        // reading file test
        let data = fs.readFileSync(filePaths.googleJson, "utf-8");
        console.log("data added -->" + data);
      }
    );
  } catch (err) {
    console.log("try catch err:", err);
    await fs.stat(filePath, (error, _) => {
      if (error !== null && error.code === "ENOENT") {
        fs.writeFile(
          filePaths.googleJson,
          convertArrayToJsonObj(res),
          (err) => {
            console.log("yooooooo");
            if (err) {
              console.log("The error in cb", err);
            } else {
              // reading file test
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync(filePaths.googleJson, "utf8"));
            }
          }
        );
      }
    });
  }
};

const googleScrape = async (arr) => {
  try {
    //TODO setTimeInterval to scrape google, 10 times each interval
    //try run it 3 times
    const linksRes = arr.map(async (_, i) => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(arr[i]);
      const googRes = await page.evaluate(() => {
        //TODO add regex to extract links only
        return document.getElementsByTagName("cite")[0].innerText;
      });
      await browser.close();
      return googRes;
    });
    const res = await Promise.all(linksRes).then((res) => {
      return res;
    });
    console.log("googleScrape res: ", res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

const scraperGoog = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const toLinks = [];
    const data = await fs.readFile("target.json", (err, data) => {
      if (err) throw err;
      //   console.log(toLinks);
    });
    await browser.close();
    const dataObj = JSON.parse(data.toString());
    for (let i in dataObj) {
      toLinks.push(
        `https://www.google.com/search?q=${dataObj[i]}&sourceid=chrome&ie=UTF-8`
      );
    }
    // console.log(toLinks.slice(0, 9));
    //TODO cut the read file into 2 parts
    const arr = [
      "https://www.google.com/search?q=3hreesixty&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=Ecco&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=cat&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=dog&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=1&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=2&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=3&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=4&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=5&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=6&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=7&sourceid=chrome&ie=UTF-8",
      "https://www.google.com/search?q=8&sourceid=chrome&ie=UTF-8",
    ];
    let x = 0;
    const run = setInterval(() => {
      if (x <= 10) {
        googleScrape(arr.slice(x, x + 3)).then((res) => {
          fileWriting(res);
          console.log(
            "🚀 ~ file: scrape.js ~ line 99 ~ googleScrape ~ slice",
            arr.slice(x, x + 3),
            x
          );
          x = x + 3;
        });
      }
    }, "5000");
    run();
    //TODO: auto exit process
    if (x <= 10) {
      clearInterval(run);
      process.exit();
    }
    //TODO runs at interval with different slice
  } catch (err) {
    console.error(err);
  }
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
