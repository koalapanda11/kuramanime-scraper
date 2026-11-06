import puppeteer from 'puppeteer';

/**
 * Fungsi modular untuk melakukan scraping Kuramanime secara on-demand
 * @param {string} targetUrl - URL yang ingin di-scrape
 */
async function getKuramanimeData(targetUrl = 'https://v20.kuramanime.ing/') {
  console.log(`[SCRAPER] Memulai proses untuk target: ${targetUrl}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list'
    ]
  });

  try {
    const page = await browser.newPage();

    // Menyetel User-Agent agar tidak mudah terdeteksi bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('[SCRAPER] Mengakses halaman...');
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Ekstraksi data elemen halaman
    const data = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('a').forEach(el => {
        if (el.innerText && el.href.includes('/anime')) {
          items.push({ 
            title: el.innerText.trim(), 
            url: el.href 
          });
        }
      });
      return items.slice(0, 5); // Ambil 5 sampel data teratas
    });

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data
    };

  } catch (error) {
    console.error('[SCRAPER ERROR]:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await browser.close();
    console.log('[SCRAPER] Browser ditutup dengan aman.');
  }
}

// Fungsi utama untuk pengujian langsung
async function runTest() {
  const result = await getKuramanimeData();
  console.log('\nHasil Akhir JSON:');
  console.log(JSON.stringify(result, null, 2));
}

runTest();
