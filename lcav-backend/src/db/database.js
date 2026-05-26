const path = require('path');
const fs   = require('fs');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './lcav.db';
let db = null;
let SQL = null;

async function getDb() {
  if (db) return db;
  const initSqlJs = require('sql.js');
  SQL = await initSqlJs();

  const dbFile = path.resolve(DB_PATH);
  if (fs.existsSync(dbFile)) {
    const buf = fs.readFileSync(dbFile);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  // Auto-save wrapper
  const origRun = db.run.bind(db);
  db.runAndSave = function(...args) {
    const r = origRun(...args);
    fs.writeFileSync(dbFile, Buffer.from(db.export()));
    return r;
  };

  initSchema();
  return db;
}

function save() {
  const buf = Buffer.from(db.export());
  fs.writeFileSync(path.resolve(DB_PATH), buf);
}

function exec(sql) { db.run(sql); save(); }

function run(sql, params = []) {
  db.run(sql, params);
  save();
  // Return last insert rowid
  const r = db.exec('SELECT last_insert_rowid() as id');
  return { lastInsertRowid: r[0]?.values[0][0] };
}

function get(sql, params = []) {
  const r = db.exec(sql, params);
  if (!r.length || !r[0].values.length) return undefined;
  const cols = r[0].columns;
  return Object.fromEntries(cols.map((c, i) => [c, r[0].values[0][i]]));
}

function all(sql, params = []) {
  const r = db.exec(sql, params);
  if (!r.length) return [];
  const cols = r[0].columns;
  return r[0].values.map(row => Object.fromEntries(cols.map((c, i) => [c, row[i]])));
}

function initSchema() {
  db.run(`PRAGMA foreign_keys = ON;`);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'mitglied',
      group_name TEXT,
      avatar TEXT,
      date_of_birth TEXT,
      phone TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      trainer_id INTEGER,
      schedule TEXT,
      color TEXT,
      icon TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS group_members (
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      disciplines TEXT,
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (group_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'public',
      group_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS training_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      name TEXT NOT NULL,
      week INTEGER,
      year INTEGER,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS training_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL,
      day TEXT NOT NULL,
      type TEXT NOT NULL,
      discipline TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 60,
      intensity TEXT NOT NULL DEFAULT 'moderat',
      notes TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      type TEXT NOT NULL DEFAULT 'Wettkampf',
      groups TEXT,
      helpers_needed INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'geplant',
      description TEXT,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS event_helpers (
      event_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT,
      status TEXT NOT NULL DEFAULT 'angemeldet',
      PRIMARY KEY (event_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event_id INTEGER,
      event_label TEXT,
      assigned_to INTEGER,
      group_name TEXT,
      priority TEXT NOT NULL DEFAULT 'mittel',
      status TEXT NOT NULL DEFAULT 'offen',
      due_date TEXT,
      category TEXT,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      discipline TEXT NOT NULL,
      result TEXT NOT NULL,
      result_num REAL,
      event_name TEXT,
      event_date TEXT,
      place INTEGER,
      group_name TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER,
      event_label TEXT,
      disciplines TEXT,
      status TEXT NOT NULL DEFAULT 'gemeldet',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  save();
}

module.exports = { getDb, run, get, all, exec, save };
