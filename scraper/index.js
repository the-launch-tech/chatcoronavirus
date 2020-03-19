require('dotenv').config()

const puppeteer = require('puppeteer')
const cron = require('node-cron')
const express = require('express')
const axios = require('axios')

const app = express()

app.listen(5001, async function() {
  console.log('app.listen 5001', new Date())

  // cron.schedule('30 20 */1 * * *', async function() {
  try {
    const browser = await puppeteer.launch()
    console.log('browser', browser)
    const page = await browser.newPage()
    console.log('page', page)
    await page.goto(
      'https://www.google.com/search?hl=en&as_q=coronavirus+covid-19+updates&as_epq=&as_oq=&as_eq=&as_nlo=&as_nhi=&lr=&cr=&as_qdr=d&as_sitesearch=&as_occt=any&safe=images&as_filetype=&as_rights='
    )
    const results = await page.evaluate(() => {
      let els = document.querySelectorAll('.rc')
      console.log('els', els)
      return Array.from(els).map(el => {
        const url = el.querySelector('.r a').href
        const title = el.querySelector('.r h3').innerHTML
        return { url, title }
      })
    })
    console.log('results', results)
    browser.close()
    console.log('browser.close()', browser.close())
    results.map(result => {
      console.log('result', result)
      axios
        .post(`${process.env.API_POST_RESOURCE}google`, result, {
          headers: {
            'x-scraper-token': process.env.SCRAPER_TOKEN,
          },
        })
        .then(console.log)
        .catch(console.error)
    })
  } catch (e) {
    console.error(e)
  }
  // })
})
