import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const Database = require('better-sqlite3');
    const path = require('path');
    
    const DB_PATH = path.join(process.cwd(), 'data', 'ems.db');
    const db = new Database(DB_PATH);
    
    const users = db.prepare('SELECT * FROM users').all();
    db.close();
    
    return NextResponse.json({ users, count: users.length });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
