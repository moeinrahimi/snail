const puppeteer = require('puppeteer');
const axios = require('axios')
const fs = require('fs')
let searching= 'marvel heroes'
const run = async () => {
  try{  
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  // we don't want to pressure on our bandwidth do we ? :)
  page.on('request', request => {
    if (request.resourceType() === 'image')
      request.abort();
    else
      request.continue();
  });
  
  let baseURL = 'https://wallpapersafari.com'  
 
  await page.goto(baseURL);
  await page.click('form [name="q"]')
  await page.keyboard.type(searching)
  await page.click('form [type="submit"]')
  await page.waitForNavigation()
  let wallpaperPage = await page.evaluate(()=>{
    return document.querySelector('.container > .row > div  a').href
  })
    await page.goto(wallpaperPage);
    let wallpapersLength = await page.evaluate(()=>{
      return  document.querySelectorAll('#single >  div > .wrap-image').length
    })
    console.log(wallpapersLength,'length')
    let links = []
    for(var i = 2;i<wallpapersLength;i++){
      let linkSelector = `#single > div:nth-child(${i}) > .wrap-image > a`
      const link = await page.evaluate((sel)=>{ 
        return  document.querySelector(sel).href.replace('/w/','/download/')
      },linkSelector)
      let {data} =await axios.get(link, {
        responseType: 'arraybuffer' 
    })
      let randomnumber = Math.floor(Math.random() * (1555 - 51 + 1)) + 51;
      fs.writeFileSync(`./images/${randomnumber}.jpg`,data)
      console.log(data)
    }
    await broweser.close()
  }catch(e){
    console.log(e,'got an error !')
  }
}
run()