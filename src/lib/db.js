import mysql from 'mysql2/promise';

// In a real scenario, these values should come from environment variables.
// For this environment, I'll set up the connection structure but handle failures gracefully
// since I don't have the actual DB credentials.

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mkf_trust_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Helper to execute queries
export async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database operation failed');
    }
}

export default pool;
