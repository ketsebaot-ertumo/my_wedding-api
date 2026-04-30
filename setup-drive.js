const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const credentials = JSON.parse(fs.readFileSync('oauth2.json'));
const { client_id, client_secret, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file'],
  prompt: 'consent',
  redirect_uri: redirect_uris[0] // Explicitly set the redirect URI
});

console.log('\n🔐 Authorize this application by visiting this URL:\n');
console.log(authUrl);
console.log('\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken({
      code: code,
      redirect_uri: redirect_uris[0]
    });
    const tokenPath = `${process.env.HOME}/.drive-token.json`;
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    console.log('\n✅ Token saved successfully to:', tokenPath);
    console.log('You can now run your application!');
  } catch (error) {
    console.error('❌ Error saving token:', error.message);
    if (error.message.includes('redirect_uri_mismatch')) {
      console.log('\n💡 Make sure your redirect URIs in Google Cloud Console match:');
      console.log('   http://localhost');
      console.log('   http://localhost:8080');
    }
  }
  rl.close();
});
