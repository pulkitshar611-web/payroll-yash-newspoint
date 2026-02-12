const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'payroll_db'
};

async function check() {
    try {
        const connection = await mysql.createConnection(config);
        const [e] = await connection.query('DESCRIBE training_enrollments');
        console.log('training_enrollments fields:', e.map(f => f.Field).join(', '));
        const [c] = await connection.query('DESCRIBE course_assignments');
        console.log('course_assignments fields:', c.map(f => f.Field).join(', '));
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
check();
