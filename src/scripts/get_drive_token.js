const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');

// Path to client secret (downloaded from Google Cloud Console)
const CREDENTIALS_PATH = path.join(__dirname, '../client_secret.json');
const TOKEN_PATH = path.join(__dirname, '../drive_token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

function authorize() {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);

        // Authorize a client with credentials, then call the Google Drive API.
        const credentials = JSON.parse(content);
        // Handle different structure of downloaded keys
        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        getAccessToken(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('\nAuthorize this app by visiting this url:\n');
    console.log(authUrl);
    // Write to file for easier retrieval
    fs.writeFileSync(path.join(__dirname, '../auth_url.txt'), authUrl);
    console.log('\n(URL also saved to auth_url.txt)\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);

            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to', TOKEN_PATH);
            console.log('Setup Complete! You can now run the backup script.');
        });
    });
}

authorize();
