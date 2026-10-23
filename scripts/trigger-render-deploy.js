const fs = require('fs');
const https = require('https');

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/RENDER_API_KEY=(.*)/);
if (!match) {
  console.error("No RENDER_API_KEY found in .env.local");
  process.exit(1);
}
const apiKey = match[1].trim();

const postData = JSON.stringify({
  clearCache: "do_not_clear"
});

const options = {
  hostname: 'api.render.com',
  path: '/v1/services/srv-dbcb2qon74is73fv7uj0/deploys',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', console.error);
req.write(postData);
req.end();
