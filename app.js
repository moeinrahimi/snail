const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  let baseURL = 'https://wallpapersafari.com'  
  await page.goto(baseURL);
  await page.click('form [name="q"]')
  await page.keyboard.type('marvel heroes')
  await page.click('form [type="submit"]')
  await page.waitForNavigation()
  await page.click('.container > .row > div > a')
  await page.waitForNavigation()
  let baseURL = 'https://wallpapersafari.com/lego-marvel-super-heroes-wallpaper/'
  // we don't want to pressure on our bandwidth do we ? :)
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image')
      request.abort();
    else
      request.continue();
  });
    await page.goto(baseURL);
    let wallpapersLength = await page.evaluate(()=>{
      return  document.querySelectorAll('#single >  div > .wrap-image').length
    })
    for(var i = 2;i<wallpapersLength;i++){
      let linkSelector = `#single > div:nth-child(${i}) > .wrap-image > a`
      const link = await page.evaluate((sel)=>{ 
        return  document.querySelector(sel).href.replace('/w/','/download/')
      },linkSelector)
      page.goto(link)
    }

    await browser.close();
})();
