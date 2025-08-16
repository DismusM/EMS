import { getDb } from '.';
import { ActivityLog, NewActivityLog } from './schema';

/**
 * Helper function to execute a query and return the first result
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const db = await getDb();
  const result = db.exec(sql, params);
  
  if (!result.length || !result[0].values.length) {
    return null;
  }
  
  // Convert the result to an object with column names as keys
  const row = result[0].values[0];
  const columns = result[0].columns;
  const obj: Record<string, any> = {};
  
  columns.forEach((col, index) => {
    obj[col] = row[index];
  });
  
  return obj as T;
}

/**
 * Helper function to execute a query and return all results
 */
export async function queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  const result = db.exec(sql, params);
  
  if (!result.length) {
    return [];
  }
  
  // Convert the results to objects with column names as keys
  const rows = result[0].values;
  const columns = result[0].columns;
  
  return rows.map(row => {
    const obj: Record<string, any> = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj as T;
  });
}

/**
 * Helper function to execute an INSERT, UPDATE, or DELETE query
 */
export async function execute(sql: string, params: any[] = []): Promise<{ lastInsertRowid: number; changes: number }> {
  const db = await getDb();
  db.run(sql, params);
  
  // Get the last inserted row ID and number of rows affected
  const result = db.exec('SELECT last_insert_rowid() as lastInsertRowid, changes() as changes');
  
  if (result.length && result[0].values.length) {
    return {
      lastInsertRowid: result[0].values[0][0] as number,
      changes: result[0].values[0][1] as number
    };
  }
  
  return { lastInsertRowid: 0, changes: 0 };
}

/**
 * Log an activity
 */
export async function logActivity(log: NewActivityLog): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  
  const stmt = db.prepare(
    'INSERT INTO activity_log (id, userId, action, entityType, entityId, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  
  stmt.run([
    log.id || `log-${now}-${Math.random().toString(36).substr(2, 9)}`,
    log.userId || null,
    log.action,
    log.entityType,
    log.entityId,
    log.details || null,
    log.createdAt || now
  ]);
  
  stmt.free();
  
  // Save changes to disk
  await saveDb();
}

/**
 * Get paginated results
 */
export async function getPaginated<T = any>(
  table: string,
  page: number = 1,
  pageSize: number = 10,
  where: string = '1=1',
  params: any[] = [],
  orderBy: string = 'createdAt DESC'
): Promise<{ data: T[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const db = await getDb();
  
  // Get total count
  const countResult = db.exec(`SELECT COUNT(*) as total FROM ${table} WHERE ${where}`, params);
  const total = countResult.length && countResult[0].values.length ? countResult[0].values[0][0] as number : 0;
  
  // Calculate pagination
  const offset = (page - 1) * pageSize;
  const totalPages = Math.ceil(total / pageSize);
  
  // Get paginated data
  const dataResult = db.exec(
    `SELECT * FROM ${table} WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  
  // Convert to objects
  let data: T[] = [];
  
  if (dataResult.length && dataResult[0].values.length) {
    const columns = dataResult[0].columns;
    data = dataResult[0].values.map(row => {
      const obj: Record<string, any> = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj as T;
    });
  }
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages
  };
}

/**
 * Save changes to the database file
 */
export async function saveDb() {
  const { saveDb: save } = await import('.');
  return save();
}
