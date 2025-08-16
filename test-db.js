const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    const DB_PATH = path.join(__dirname, 'data', 'ems.db');
    const WASM_PATH = path.join(__dirname, 'public', 'sql-wasm', 'sql-wasm.wasm');
    
    console.log('DB Path:', DB_PATH);
    console.log('WASM Path:', WASM_PATH);
    
    // Check if files exist
    console.log('DB exists:', fs.existsSync(DB_PATH));
    console.log('WASM exists:', fs.existsSync(WASM_PATH));
    
    // Initialize SQL.js
    const wasmBinary = fs.readFileSync(WASM_PATH);
    const SQL = await initSqlJs({ wasmBinary });
    
    // Load database
    const data = fs.readFileSync(DB_PATH);
    const db = new SQL.Database(data);
    
    // Test query
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
    stmt.step();
    const result = stmt.getAsObject();
    stmt.free();
    
    console.log('Users count:', result.count);
    
    // List all users
    const usersStmt = db.prepare('SELECT * FROM users');
    const users = [];
    while (usersStmt.step()) {
      users.push(usersStmt.getAsObject());
    }
    usersStmt.free();
    
    console.log('Users:', users);
    
    db.close();
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();
