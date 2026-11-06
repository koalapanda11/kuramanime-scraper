const puppeteer = require('puppeteer-core');

async function runTest() {
  console.log('Menjalankan Puppeteer di Termux...');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || '/data/data/com.termux/files/usr/bin/termux-open-url', // atau lewat jalur alternatif
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Membuka website...');
  await page.goto('https://example.com');

  const title = await page.title();
  console.log(`Berhasil! Judul halaman: ${title}`);

  await browser.close();
}

runTest();
