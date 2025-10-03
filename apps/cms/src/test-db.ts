import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.resolve(projectRoot, '.env');
dotenv.config({ path: envPath });

const testConnection = async () => {
  console.log('🔍 Testing database connection...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    console.error('   Please set DATABASE_URL in apps/cms/.env');
    process.exit(1);
  }

  console.log('📝 Configuration:');
  console.log(`   DATABASE_URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`   DATABASE_SSL: ${process.env.DATABASE_SSL || 'false'}\n`);

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    console.log('🔌 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database!\n');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 Database info:');
    console.log(`   ${result.rows[0].version}\n`);

    client.release();
    await pool.end();

    console.log('✅ Database connection test passed!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run: npm run dev:cms');
    console.log('   2. Payload will automatically run migrations on first start');
    console.log('   3. Create your admin account in the browser');
    console.log('   4. Optionally run: npm run seed (to add test data)\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!\n');

    if (error.code === 'ENOTFOUND') {
      console.error('🔍 Error: Cannot resolve database host');
      console.error('   Check that your DATABASE_URL host is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Error: Connection refused');
      console.error('   - If using local PostgreSQL: Is it running?');
      console.error('   - Check that the port number is correct');
    } else if (error.message.includes('password authentication failed')) {
      console.error('🔍 Error: Authentication failed');
      console.error('   Check username and password in DATABASE_URL');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('🔍 Error: Database does not exist');
      console.error('   Create the database first (Payload will create tables)');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('🔍 Error: Connection timed out');
      console.error('   - Check your internet connection');
      console.error('   - Verify the database host is accessible');
    } else {
      console.error('🔍 Error details:');
      console.error(`   ${error.message}`);
    }

    console.error('\n💡 Troubleshooting:');
    console.error('   1. Verify DATABASE_URL in apps/cms/.env');
    console.error('   2. Check DATABASE_SSL setting (true for cloud, false for local)');
    console.error('   3. Ensure PostgreSQL is running (if local)');
    console.error('   4. See SETUP.md for detailed instructions\n');

    await pool.end();
    process.exit(1);
  }
};

testConnection();
