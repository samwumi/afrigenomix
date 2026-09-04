#!/usr/bin/env node

/**
 * Test MySQL Database Connection
 * This script tests the connection to your Hostinger MySQL database
 * 
 * Installation: npm install mysql2
 * Usage: node test-db-connection.js
 */

let mysql;
try {
  mysql = require('mysql2/promise');
} catch (error) {
  console.error('\n❌ mysql2 package not found!\n');
  console.error('Please install it first:\n');
  console.error('  npm install mysql2\n');
  console.error('Then run this script again:\n');
  console.error('  node test-db-connection.js\n');
  process.exit(1);
}

// Your database connection string
const DATABASE_URL = "mysql://u215495167_afrigenomix:Afrigenomix@2026@localhost:3306/u215495167_afrigenomix";

console.log('\n🔍 Testing MySQL Database Connection...\n');
console.log('========================================\n');

// Parse the connection string
const urlPattern = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
const match = DATABASE_URL.match(urlPattern);

if (!match) {
  console.error('❌ Invalid DATABASE_URL format\n');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

console.log('Connection Details:');
console.log('-------------------');
console.log(`Host:     ${host}`);
console.log(`Port:     ${port}`);
console.log(`User:     ${user}`);
console.log(`Database: ${database}`);
console.log(`Password: ${'*'.repeat(password.length)}\n`);

async function testConnection() {
  let connection;
  
  try {
    console.log('⏳ Attempting to connect...\n');
    
    // Create connection
    connection = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: user,
      password: password,
      database: database,
      connectTimeout: 10000
    });

    console.log('✅ Connection successful!\n');

    // Test query
    console.log('⏳ Running test query...\n');
    const [rows] = await connection.execute('SELECT DATABASE() as current_db, NOW() as server_time, VERSION() as mysql_version');
    
    console.log('✅ Query successful!\n');
    console.log('Database Info:');
    console.log('-------------');
    console.log(`Current Database: ${rows[0].current_db}`);
    console.log(`Server Time:      ${rows[0].server_time}`);
    console.log(`MySQL Version:    ${rows[0].mysql_version}\n`);

    // Check if any tables exist
    console.log('⏳ Checking for existing tables...\n');
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} table(s):\n`);
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log('ℹ️  No tables found (database is empty)\n');
      console.log('💡 Run these commands to set up your database:\n');
      console.log('   1. Update prisma/schema.prisma (change provider to "mysql")');
      console.log('   2. npx prisma generate');
      console.log('   3. npx prisma db push');
      console.log('   4. npx prisma db seed\n');
    }

    console.log('\n🎉 Database connection test PASSED!\n');
    console.log('Next steps:');
    console.log('----------');
    console.log('1. Update prisma/schema.prisma:');
    console.log('   Change: provider = "mysql"');
    console.log('2. Run: npx prisma generate');
    console.log('3. Run: npx prisma db push');
    console.log('4. Run: npx prisma db seed');
    console.log('5. Run: npm run build');
    console.log('6. Run: pm2 start npm --name "afrigenomix" -- start\n');

  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error Details:');
    console.error('-------------');
    console.error(`Code:    ${error.code}`);
    console.error(`Message: ${error.message}\n`);

    // Provide specific troubleshooting advice
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Troubleshooting:');
      console.log('   - MySQL server may not be running');
      console.log('   - Check if MySQL is installed: systemctl status mysql');
      console.log('   - Verify the host and port are correct\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Troubleshooting:');
      console.log('   - Username or password is incorrect');
      console.log('   - Verify credentials in Hostinger control panel');
      console.log('   - Make sure user has access to the database\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Troubleshooting:');
      console.log('   - Database does not exist');
      console.log('   - Create the database in Hostinger control panel');
      console.log('   - Verify database name spelling\n');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.log('💡 Troubleshooting:');
      console.log('   - Cannot reach the database server');
      console.log('   - Check if you are running this from the Hostinger server');
      console.log('   - If running locally, MySQL may not be accessible remotely\n');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
testConnection().catch(error => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});
