const rp = require("request-promise");
const cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const url =
  "https://www.google.com/maps/place/Nema+-+Visconde+de+Piraj%C3%A1+%7C+Padaria+de+Fermenta%C3%A7%C3%A3o+Natural/@-22.9841517,-43.2128543,15z/data=!4m6!3m5!1s0x9bd58a0cdc1487:0x4c1eb56d62eb469b!8m2!3d-22.9841517!4d-43.2128543!16s%2Fg%2F11j20tdp78?entry=ttu";

module.exports.handler = async (event) => {
  try {
    // const html = await rp(url)
    // const $ = await cheerio.load(html)
    // const teste = $('div');
    // const teste = $('span')
    // const teste = $('div.OyjIsf');

    // console.log('teste =>', teste._root)
    // console.log($.html());
    const browser = await puppeteer.launch({
      headless:false,
      args: [
        '--user-data-dir=C:/Users/thiago/AppData/Local/Temp',
      ]});

    // // Create a page
    const page = await browser.newPage();

    // // Go to your site
    await page.goto(url);

    // // Query for an element handle.
    await page.content();
    // const element = await page.waitForSelector('button.HHrUdb');
    // await page.waitForSelector('button.HHrUdb');
    // await page.waitForNavigation();
    const element = await page.$eval('.HHrUdb',el => el.outerHTML)
    console.log('element =>', element)
    // const element = await page.waitForSelector('button > .HHrUdb fontTitleSmall rqjGif');
    // await page.waitForSelector('button.HHrUdb');

    // // console.log('element =>', element)
    const $ = await cheerio.load(element)
    const $span = $('span').text();
    const reviewsNumber =  $span.substring(0, $span.indexOf(" "))
    console.log('reviewsNumber =>', reviewsNumber)
    console.log('$span =>', $span)
    // $('.OyjIsf', ).each(function (i, elem) {
    //   console.log('i =>', i)
    //   console.log('elem =>', elem)
    // });

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Go Serverless v3.0! Your function executed successfully!"
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.log('error =>', error)
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: "erro ao consultar dados, tente novamente mais tarde!",
          err: error
        },
        null,
        2
      ),
    };
  }
};