const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/screenshot', async (req, res) => {
  const { url } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true 
    });
    const page = await browser.newPage();

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout exceeded')), 10000));

    await Promise.race([
      page.goto(url, { waitUntil: 'domcontentloaded' }),
      timeoutPromise
    ]);

    const screenshot = await page.screenshot();

    await browser.close();

    res.json({ screenshot: `data:image/png;base64,${screenshot.toString('base64')}` });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({ error: 'Error taking screenshot' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
