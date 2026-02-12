const db = require('./src/config/mysql');
async function run() {
    try {
        console.log('Testing public.controller.js:getDashboard query...');
        const [rows] = await db.query(`
            SELECT ja.*, j.title as job_title, j.id as job_id, e.company_name, e.company_logo 
            FROM job_applications ja
            LEFT JOIN jobs j ON ja.job_id = j.id
            LEFT JOIN employers e ON j.employer_id = e.id
            LIMIT 1
        `);
        console.log('Success!', rows.length);
    } catch (e) {
        console.error('FAILED:', e.message);
    }

    try {
        console.log('\nTesting jobseeker.controller.js:getAppliedJobs query...');
        const [rows] = await db.query(`
            SELECT ja.*, j.title as job_title, e.company_name, j.location, j.job_type, ja.status as application_status
            FROM job_applications ja
            JOIN jobs j ON ja.job_id = j.id
            LEFT JOIN employers e ON j.employer_id = e.id
            LIMIT 1
        `);
        console.log('Success!', rows.length);
    } catch (e) {
        console.error('FAILED:', e.message);
    }
    process.exit(0);
}
run();
