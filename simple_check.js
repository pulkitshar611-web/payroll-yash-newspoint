// Simple schema check
require('dotenv').config();
const mysql = require('mysql2/promise');

async function check() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'pop_db'
        });

        console.log('Connected to database\n');

        // Check vendors table
        const [vendors] = await conn.query('SHOW COLUMNS FROM vendors');
        console.log('VENDORS TABLE COLUMNS:');
        console.log(JSON.stringify(vendors.map(v => v.Field), null, 2));

        // Check data counts
        const [[{ userCount }]] = await conn.query('SELECT COUNT(*) as userCount FROM users');
        const [[{ empCount }]] = await conn.query('SELECT COUNT(*) as empCount FROM employers');
        const [[{ jobCount }]] = await conn.query('SELECT COUNT(*) as jobCount FROM jobs');

        console.log('\nDATA COUNTS:');
        console.log(`Users: ${userCount}`);
        console.log(`Employers: ${empCount}`);
        console.log(`Jobs: ${jobCount}`);

        await conn.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
