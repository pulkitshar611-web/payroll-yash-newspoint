const mysql = require('mysql2/promise');
const env = require('./src/config/env');

async function run() {
    try {
        const pool = mysql.createPool({
            host: env.db.host,
            user: env.db.user,
            password: env.db.password,
            database: env.db.name
        });

        const empId = 2; // shri
        const employerId = 8;

        console.log('Populating data for employee ID 2...');

        // 1. Update Employee Credit Balance
        await pool.query("UPDATE employees SET credit_balance = 50000.00 WHERE id = ?", [empId]);

        // 2. Add Salary Record
        await pool.query(`
      INSERT INTO salary_records (
        employee_id, amount, basic_salary, hra, pf, gross_salary, net_salary, 
        month, year, status, payment_date, created_at, updated_at
      )
      VALUES (?, 75000.00, 45000.00, 15000.00, 5400.00, 75000.00, 65000.00, 
        'January', 2026, 'paid', NOW(), NOW(), NOW())
    `, [empId]);

        // 3. Add Bills
        await pool.query(`
      INSERT INTO bills (employee_id, employer_id, bill_number, amount, status, due_date, name, description, created_at, updated_at)
      VALUES 
      (?, ?, 'BILL-001', 1200.50, 'pending', '2026-01-15', 'Electricity Bill', 'January Electricity', NOW(), NOW()),
      (?, ?, 'BILL-002', 599.00, 'pending', '2026-01-20', 'Internet Bill', 'Broadband Payment', NOW(), NOW())
    `, [empId, employerId, empId, employerId]);

        // 4. Update Bank Details
        await pool.query(`
      UPDATE bank_details SET 
        bank_name = 'HDFC Bank', 
        account_number = '50100456789012', 
        ifsc_code = 'HDFC0001234', 
        branch = 'Whitefield',
        account_type = 'Savings',
        is_primary = 1,
        balance = 25000.00,
        status = 'active',
        verification_status = 'verified'
      WHERE employee_id = ?
    `, [empId]);

        // 5. Add Transactions
        const [emp] = await pool.query("SELECT user_id FROM employees WHERE id = ?", [empId]);
        const userId = emp[0].user_id;

        await pool.query(`
      INSERT INTO transactions (user_id, employer_id, type, amount, description, status, date, created_at, updated_at)
      VALUES 
      (?, ?, 'credit', 5000.00, 'Monthly Allowance', 'success', NOW(), NOW(), NOW()),
      (?, ?, 'payment', 1500.00, 'Cafeteria Payment', 'success', NOW(), NOW(), NOW())
    `, [userId, employerId, userId, employerId]);

        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
