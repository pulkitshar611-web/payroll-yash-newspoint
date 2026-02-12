const db = require('./src/config/mysql');
async function run() {
    try {
        const userId = 32; // Based on earlier debug, user 32 is employee 7
        const [emp] = await db.query("SELECT id FROM employees WHERE user_id = ?", [userId]);
        console.log('Employee found:', emp);
        const [rows] = await db.query(`
          SELECT *, 
                 DATE_FORMAT(date, '%Y-%m-%d') as date_str,
                 DATE_FORMAT(check_in, '%H:%i:%s') as check_in_time_raw,
                 DATE_FORMAT(check_out, '%H:%i:%s') as check_out_time_raw,
                 DATE_FORMAT(check_in, '%h:%i %p') as check_in_time,
                 DATE_FORMAT(check_out, '%h:%i %p') as check_out_time
          FROM attendance 
          WHERE employee_id = ? 
          ORDER BY date DESC
        `, [emp[0].id]);
        console.log('Attendance Rows:', rows.length);
        process.exit(0);
    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    }
}
run();
