const fetch = require('node-fetch');

exports.handler = async (event) => {
const { code } = JSON.parse(event.body);
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!code) {
  return { statusCode: 400, body: JSON.stringify({ error: 'No code provided.' }) };
}

try {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return { statusCode: 400, body: JSON.stringify(data) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ token: data.access_token }),
  };
} catch (error) {
  return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
}
};

