// generate-status.js
const axios = require('axios');
const fs = require('fs');

const servers = [
  { name: "tsukino", url: "https:/tsukino.moe" },
  { name: "akame", url: "http://akame.moe" },
  { name: "png", url: "http://png.tsukino.moe" }
];

async function checkServers() {
  const results = [];

  for (const server of servers) {
    let status = "offline";
    let errorMessage = "";

    try {
      const response = await axios.get(server.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Server Status Bot)'
        }
      });

      if (response.status === 200 || response.status < 400) {
        status = "online";
      }
    } catch (err) {
      status = "offline";
      errorMessage = err.message;
    }

    results.push({
      name: server.name,
      url: server.url,
      status,
      error: errorMessage || undefined,
      lastChecked: new Date().toISOString()
    });
  }

  fs.writeFileSync('servers.json', JSON.stringify(results, null, 2));
  console.log("✅ servers.json updated.");
}

checkServers();