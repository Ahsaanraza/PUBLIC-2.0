const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to make HTTP/HTTPS requests
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.request(url, options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          data: data ? JSON.parse(data) : null
        });
      });
    });
    request.on('error', reject);
    if (options.body) {
      request.write(options.body);
    }
    request.end();
  });
}

// Proxy endpoint for flight search
app.post('/api/flight-search/search', async (req, res) => {
  try {
    console.log('[PROXY] Received search request:', JSON.stringify(req.body, null, 2));
    
    const response = await makeRequest('https://api.saer.pk/api/flight-search/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    console.log('[PROXY] Response status:', response.status);
    console.log('[PROXY] Response data:', JSON.stringify(response.data, null, 2));
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[PROXY] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend proxy running' });
});

app.listen(PORT, () => {
  console.log(`[PROXY] Backend running on http://localhost:${PORT}`);
});
