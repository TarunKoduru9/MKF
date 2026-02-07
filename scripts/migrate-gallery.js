const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mkf_trust_db',
    multipleStatements: true
};

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        const sql = `
            CREATE TABLE IF NOT EXISTS gallery_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('image', 'video') NOT NULL,
                category VARCHAR(50) DEFAULT 'general',
                src TEXT NOT NULL,
                public_id VARCHAR(255),
                title VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log('Executing migration...');
        await connection.query(sql);
        console.log('Migration successful: gallery_items table created.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
