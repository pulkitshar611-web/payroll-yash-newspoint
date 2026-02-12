// Quick schema verification script
require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifySchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'pop_db'
    });

    console.log('✅ Connected to database\n');

    // Check vendors table structure
    console.log('=== VENDORS TABLE ===');
    const [vendorsColumns] = await connection.query('DESCRIBE vendors');
    vendorsColumns.forEach(col => {
        console.log(`${col.Field} - ${col.Type} - ${col.Null} - ${col.Key}`);
    });

    // Check employers table structure
    console.log('\n=== EMPLOYERS TABLE ===');
    const [employersColumns] = await connection.query('DESCRIBE employers');
    employersColumns.forEach(col => {
        console.log(`${col.Field} - ${col.Type} - ${col.Null} - ${col.Key}`);
    });

    // Check jobs table structure
    console.log('\n=== JOBS TABLE ===');
    const [jobsColumns] = await connection.query('DESCRIBE jobs');
    jobsColumns.forEach(col => {
        console.log(`${col.Field} - ${col.Type} - ${col.Null} - ${col.Key}`);
    });

    // Check current data counts
    console.log('\n=== DATA COUNTS ===');
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`Users: ${userCount[0].count}`);

    const [employerCount] = await connection.query('SELECT COUNT(*) as count FROM employers');
    console.log(`Employers: ${employerCount[0].count}`);

    const [employeeCount] = await connection.query('SELECT COUNT(*) as count FROM employees');
    console.log(`Employees: ${employeeCount[0].count}`);

    const [jobCount] = await connection.query('SELECT COUNT(*) as count FROM jobs');
    console.log(`Jobs: ${jobCount[0].count}`);

    const [applicationCount] = await connection.query('SELECT COUNT(*) as count FROM job_applications');
    console.log(`Job Applications: ${applicationCount[0].count}`);

    const [subscriptionCount] = await connection.query('SELECT COUNT(*) as count FROM subscriptions');
    console.log(`Subscriptions: ${subscriptionCount[0].count}`);

    // Check for any pending subscriptions
    console.log('\n=== SUBSCRIPTION STATUS ===');
    const [subscriptions] = await connection.query(`
    SELECT s.id, s.status, e.company_name, p.name as plan_name
    FROM subscriptions s
    JOIN employers e ON s.employer_id = e.id
    JOIN plans p ON s.plan_id = p.id
  `);
    if (subscriptions.length > 0) {
        subscriptions.forEach(sub => {
            console.log(`${sub.company_name} - ${sub.plan_name} - ${sub.status}`);
        });
    } else {
        console.log('No subscriptions found');
    }

    await connection.end();
    console.log('\n✅ Verification complete');
}

verifySchema().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
