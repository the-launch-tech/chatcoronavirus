require('dotenv').config()

const puppeteer = require('puppeteer')
const cron = require('node-cron')
const express = require('express')
const axios = require('axios')

const app = express()

app.listen(5001, async function() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('https://www.brainyquote.com/topics/motivational-quotes')

  await page.waitForSelector('.b-qt')

  const titles = await page.$$eval('.b-qt', elements => {
    return elements.map(item => item.textContent)
  })

  console.log(titles)

  await browser.close()
})
