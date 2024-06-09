const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let browser;
(async () => {
  browser = await puppeteer.launch();
})();

// Create a health check endpoint
app.get('/health', (req, res) => {
    res.send('Server is healthy');
  });
  

app.post('/convert-html-to-pdf', upload.single('input-html-file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const htmlContent = req.file.buffer.toString('utf8');

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  // To reflect CSS used for screens instead of print
  page.emulateMediaType('screen');

  // Download the PDF
  const result = await page.pdf({
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });

  // Return result as a PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
  res.send(result);

  await page.close();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log(`SIGTERM signal received: closing HTTP server`)
  browser.close(() => {
    console.log(`Browser closed`)
  });
  server.close(() => {
    dconsole.log(`HTTP server closed`)
  })
})

function gracefulShutdown() {
    console.log('Shutting down gracefully...');
  
    server.close(() => {
      console.log('Server closed.');
      // Close any other connections or resources here
      browser.close();
      process.exit(0);
    });
  
    // Force close the server after 5 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 5000);
  }
  
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);