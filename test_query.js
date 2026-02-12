const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'payroll_db'
};

async function test() {
    try {
        const connection = await mysql.createConnection(config);

        // Test the exact query from getAppliedJobs
        const userId = 53; // jobseeker user ID from earlier check
        console.log('Testing query for user_id:', userId);

        const query = `
      SELECT ja.*, j.title as job_title, j.description as job_description, j.location as job_location, 
             j.job_type, j.salary_min, j.salary_max,
             e.company_name, e.company_logo
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN employers e ON j.employer_id = e.id
      WHERE ja.jobseeker_id = ?
      ORDER BY ja.applied_at DESC
    `;

        const [rows] = await connection.query(query, [userId]);
        console.log('Query successful! Found', rows.length, 'applications');

        if (rows.length > 0) {
            console.log('First application:', {
                id: rows[0].id,
                job_title: rows[0].job_title,
                status: rows[0].status
            });
        }

        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('SQL:', err.sql);
    }
}
test();
