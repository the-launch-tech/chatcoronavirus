require('dotenv').config()

const puppeteer = require('puppeteer')
const cron = require('node-cron')
const express = require('express')
const axios = require('axios')

const app = express()

app.listen(5001, function() {
  puppeteer.launch().then(browser => {
    browser.newPage().then(page => {
      page.goto('https://banned.video/').then(() => {
        page
          .evaluate(() => {
            let els = document.querySelectorAll('.rc')
            console.log('els', els)
            return Array.from(els).map(el => {
              const url = el.querySelector('.r a').href
              const title = el.querySelector('.r h3').innerHTML
              return { url, title }
            })
          })
          .then(results => {
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
          })
      })
    })
  })
})
