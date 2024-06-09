This script is a simple Express.js server that listens on port 3000. 

It has two endpoints: 

```
POST /convert-html-to-pdf
```  
This endpoint accepts an HTML file, converts it to a PDF file, and sends the PDF file as a response. 
```
GET /health  
```
This endpoint is a health check endpoint that returns a simple message. 

The server uses Puppeteer to creates a headless chrome broserconvert HTML to PDF. 

The server is also configured to handle graceful shutdowns. 

To test the server, run the following command at the root of the project: 
``` 
curl --location 'http://localhost:3000/convert-html-to-pdf' \
--form 'input-html-file=@"/sample.html"'
```

