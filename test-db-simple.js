const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'ems.db');

try {
  console.log('Testing database at:', DB_PATH);
  const db = new Database(DB_PATH);
  
  // Test basic query
  const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log('Users count:', users.count);
  
  // List all users
  const allUsers = db.prepare('SELECT * FROM users').all();
  console.log('All users:', allUsers);
  
  db.close();
  console.log('✅ Database test successful');
} catch (error) {
  console.error('❌ Database test failed:', error);
}
