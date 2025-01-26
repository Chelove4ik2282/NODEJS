const http = require('http');
const url = require('url');
const fileManager = require('./fileManager');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  if (parsedUrl.pathname === '/') 
  {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to my first Node.js server!');
  }
else if (parsedUrl.pathname === '/file') 
{
    if (method === 'GET') 
    {
      try {
        const data = await fileManager.readFile('data.txt');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      }
    } 
    else if (method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', async () => {
        await fileManager.writeFile('data.txt', body);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File updated successfully');
      });
    }
    else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } 
  else if (parsedUrl.pathname === '/time') {
    const time = new Date().toLocaleTimeString();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Current time: ${time}`);
  }
   else if (parsedUrl.pathname === '/date') {
    const date = new Date().toISOString().split('T')[0];
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Current date: ${date}`);
  }
  else if (parsedUrl.pathname === '/blackMan')
  {
    const imagePath = './download.jpg'; 
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Image not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
      }
    });
  }
   else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404: Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
