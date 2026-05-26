const router = require('express').Router();
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

function canAccess(user, ch) {
  if (ch.type === 'public') return true;
  if (ch.type === 'private') {
    if (ch.name === 'Vorstand') return user.role === 'vorstand';
    return ['trainer','vorstand'].includes(user.role);
  }
  if (ch.type === 'group') return user.group_name === ch.group_name || ['trainer','vorstand'].includes(user.role);
  return false;
}

router.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const channels = db.all('SELECT * FROM channels ORDER BY type,name');
  res.json(channels.filter(c => canAccess(req.user, c)));
});

router.get('/:id/messages', authenticate, async (req, res) => {
  await db.getDb();
  const ch = db.get('SELECT * FROM channels WHERE id=?', [req.params.id]);
  if (!ch) return res.status(404).json({ error: 'Nicht gefunden.' });
  if (!canAccess(req.user, ch)) return res.status(403).json({ error: 'Keine Berechtigung.' });
  const limit = Math.min(parseInt(req.query.limit)||50, 200);
  const msgs = db.all(`SELECT m.id,m.text,m.created_at,u.id AS user_id,u.name AS user_name,u.avatar FROM messages m JOIN users u ON m.user_id=u.id WHERE m.channel_id=? ORDER BY m.created_at DESC LIMIT ?`, [req.params.id, limit]);
  res.json(msgs.reverse());
});

router.post('/:id/messages', authenticate, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Text erforderlich.' });
  await db.getDb();
  const ch = db.get('SELECT * FROM channels WHERE id=?', [req.params.id]);
  if (!ch || !canAccess(req.user, ch)) return res.status(403).json({ error: 'Keine Berechtigung.' });
  const r = db.run('INSERT INTO messages (channel_id,user_id,text) VALUES (?,?,?)', [req.params.id, req.user.id, text.trim()]);
  const msg = db.get('SELECT m.*,u.name AS user_name,u.avatar FROM messages m JOIN users u ON m.user_id=u.id WHERE m.id=?', [r.lastInsertRowid]);
  res.status(201).json(msg);
});

router.post('/', authenticate, isTrainer, async (req, res) => {
  const { name, type, group_name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO channels (name,type,group_name) VALUES (?,?,?)', [name, type||'public', group_name||null]);
  res.status(201).json({ id: r.lastInsertRowid });
});

module.exports = router;
