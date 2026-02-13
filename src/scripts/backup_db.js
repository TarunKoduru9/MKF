const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { google } = require('googleapis');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // The folder ID in Google Drive
const KEY_FILE_PATH = path.join(__dirname, '../client_secret.json');
const TOKEN_PATH = path.join(__dirname, '../drive_token.json');

const date = new Date();

const timestamp = date.toISOString().replace(/[:.]/g, '-');
const backupFileName = `${DB_NAME}_backup_${timestamp}.sql`;
const backupFilePath = path.join(__dirname, '../uploads', backupFileName);

async function uploadFile() {
    // Load client secrets from a local file.
    const content = fs.readFileSync(KEY_FILE_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Load authorized user tokens
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        auth.setCredentials(token);
    } else {
        console.error(`Token file not found at ${TOKEN_PATH}. Run 'node scripts/get_drive_token.js' first.`);
        return;
    }

    const drive = google.drive({ version: 'v3', auth });

    try {
        const response = await drive.files.create({
            requestBody: {
                name: backupFileName,
                parents: [GOOGLE_DRIVE_FOLDER_ID],
                mimeType: 'application/x-sql',
            },
            media: {
                mimeType: 'application/x-sql',
                body: fs.createReadStream(backupFilePath),
            },
        });

        console.log(`File uploaded successfully: ${response.data.name} (${response.data.id})`);

        // Delete local file after upload
        fs.unlinkSync(backupFilePath);
        console.log('Local backup file deleted.');

    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
}

function dumpDatabase() {
    console.log('Starting database backup...');

    // mysqldump command
    const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${backupFilePath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating backup: ${error.message}`);
            return;
        }
        if (stderr) {
            // mysqldump writes to stderr for progress, not necessarily an error, but good to log if validation fails
            // console.warn(`Backup stderr: ${stderr}`);
        }

        console.log(`Backup created at: ${backupFilePath}`);
        uploadFile();
    });
}

// Check for required configuration
if (!DB_USER || !DB_PASSWORD || !DB_NAME || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    console.error('Missing configuration. Please check .env file.');
    process.exit(1);
}

dumpDatabase();
