const router = require('express').Router();
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const { status, type } = req.query;
  let q = `SELECT e.*, u.name AS creator_name FROM events e LEFT JOIN users u ON e.created_by=u.id WHERE 1=1`;
  const p = [];
  if (status) { q += ' AND e.status=?'; p.push(status); }
  if (type)   { q += ' AND e.type=?';   p.push(type); }
  const events = db.all(q + ' ORDER BY e.date ASC', p);
  events.forEach(e => {
    e.groups = e.groups ? JSON.parse(e.groups) : [];
    const h = db.get('SELECT COUNT(*) as c FROM event_helpers WHERE event_id=?', [e.id]);
    e.helpers_signed = h?.c || 0;
  });
  res.json(events);
});

router.get('/:id', authenticate, async (req, res) => {
  await db.getDb();
  const event = db.get('SELECT e.*,u.name AS creator_name FROM events e LEFT JOIN users u ON e.created_by=u.id WHERE e.id=?', [req.params.id]);
  if (!event) return res.status(404).json({ error: 'Nicht gefunden.' });
  event.groups = event.groups ? JSON.parse(event.groups) : [];
  const helpers = db.all('SELECT u.id,u.name,u.avatar,eh.role,eh.status FROM event_helpers eh JOIN users u ON eh.user_id=u.id WHERE eh.event_id=?', [req.params.id]);
  res.json({ ...event, helpers });
});

router.post('/', authenticate, isTrainer, async (req, res) => {
  const { title, date, time, location, type, groups, helpers_needed, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'Titel und Datum erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO events (title,date,time,location,type,groups,helpers_needed,description,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
    [title, date, time||null, location||null, type||'Wettkampf', JSON.stringify(groups||[]), helpers_needed||0, description||null, req.user.id]);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', authenticate, isTrainer, async (req, res) => {
  const { title, date, time, location, type, groups, helpers_needed, status, description } = req.body;
  await db.getDb();
  db.run('UPDATE events SET title=COALESCE(?,title),date=COALESCE(?,date),time=COALESCE(?,time),location=COALESCE(?,location),type=COALESCE(?,type),groups=COALESCE(?,groups),helpers_needed=COALESCE(?,helpers_needed),status=COALESCE(?,status),description=COALESCE(?,description) WHERE id=?',
    [title||null,date||null,time||null,location||null,type||null,groups?JSON.stringify(groups):null,helpers_needed||null,status||null,description||null,req.params.id]);
  res.json({ message: 'Aktualisiert.' });
});

router.delete('/:id', authenticate, isTrainer, async (req, res) => {
  await db.getDb(); db.run('DELETE FROM events WHERE id=?', [req.params.id]); res.json({ message: 'Gelöscht.' });
});

router.post('/:id/helpers', authenticate, async (req, res) => {
  await db.getDb();
  db.run('INSERT OR REPLACE INTO event_helpers (event_id,user_id,role,status) VALUES (?,?,?,?)', [req.params.id, req.user.id, req.body.role||null, 'angemeldet']);
  res.status(201).json({ message: 'Angemeldet.' });
});

router.delete('/:id/helpers', authenticate, async (req, res) => {
  await db.getDb(); db.run('DELETE FROM event_helpers WHERE event_id=? AND user_id=?', [req.params.id, req.user.id]); res.json({ message: 'Abgemeldet.' });
});

module.exports = router;
