const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db     = require('../db/database');
const { authenticate, isTrainer, isVorstand } = require('../middleware/auth');

router.get('/', authenticate, isVorstand, async (req, res) => {
  await db.getDb();
  res.json(db.all('SELECT id,name,email,role,group_name,avatar,date_of_birth,phone,active FROM users WHERE active=1 ORDER BY name'));
});

router.get('/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.role === 'mitglied' && req.user.id !== id) return res.status(403).json({ error: 'Keine Berechtigung.' });
  await db.getDb();
  const user = db.get('SELECT id,name,email,role,group_name,avatar,date_of_birth,phone,active FROM users WHERE id=?', [id]);
  if (!user) return res.status(404).json({ error: 'Nicht gefunden.' });
  res.json(user);
});

router.post('/', authenticate, isVorstand, async (req, res) => {
  const { name, email, password, role, group_name, date_of_birth, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, Email und Passwort erforderlich.' });
  await db.getDb();
  try {
    const r = db.run('INSERT INTO users (name,email,password,role,group_name,avatar,date_of_birth,phone) VALUES (?,?,?,?,?,?,?,?)',
      [name, email.toLowerCase(), bcrypt.hashSync(password, 10), role||'mitglied', group_name||null,
       name.split(' ').map(n=>n[0]).join('').substring(0,2), date_of_birth||null, phone||null]);
    res.status(201).json({ id: r.lastInsertRowid });
  } catch(e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Email bereits vergeben.' });
    throw e;
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.role === 'mitglied' && req.user.id !== id) return res.status(403).json({ error: 'Keine Berechtigung.' });
  await db.getDb();
  const { name, phone } = req.body;
  db.run('UPDATE users SET name=COALESCE(?,name), phone=COALESCE(?,phone) WHERE id=?', [name||null, phone||null, id]);
  res.json({ message: 'Aktualisiert.' });
});

module.exports = router;
