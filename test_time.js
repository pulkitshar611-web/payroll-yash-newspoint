const db = require('./src/config/mysql');
async function run() {
    try {
        const checkInStr = "18:41:37";
        const todayStr = new Date().toISOString().split('T')[0];
        const checkInTime = new Date(`${todayStr}T${checkInStr}`);
        const checkOutTime = new Date();
        const durationMs = checkOutTime - checkInTime;
        const hours = (durationMs / (1000 * 60 * 60)).toFixed(2);
        console.log('Parsed CheckIn:', checkInTime);
        console.log('CheckOut:', checkOutTime);
        console.log('Hours:', hours);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
