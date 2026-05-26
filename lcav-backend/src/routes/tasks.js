const router = require('express').Router();
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const { status, priority } = req.query;
  let q = `SELECT t.*,u.name AS assigned_name,u.avatar AS assigned_avatar,c.name AS creator_name FROM tasks t LEFT JOIN users u ON t.assigned_to=u.id LEFT JOIN users c ON t.created_by=c.id WHERE 1=1`;
  const p = [];
  if (status)   { q += ' AND t.status=?';   p.push(status); }
  if (priority) { q += ' AND t.priority=?'; p.push(priority); }
  q += " ORDER BY CASE t.priority WHEN 'hoch' THEN 1 WHEN 'mittel' THEN 2 ELSE 3 END, t.due_date ASC";
  res.json(db.all(q, p));
});

router.get('/:id', authenticate, async (req, res) => {
  await db.getDb();
  const t = db.get('SELECT t.*,u.name AS assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to=u.id WHERE t.id=?', [req.params.id]);
  if (!t) return res.status(404).json({ error: 'Nicht gefunden.' });
  res.json(t);
});

router.post('/', authenticate, isTrainer, async (req, res) => {
  const { title, event_id, event_label, assigned_to, group_name, priority, due_date, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Titel erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO tasks (title,event_id,event_label,assigned_to,group_name,priority,due_date,category,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
    [title,event_id||null,event_label||null,assigned_to||null,group_name||'Alle',priority||'mittel',due_date||null,category||null,req.user.id]);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', authenticate, async (req, res) => {
  await db.getDb();
  const task = db.get('SELECT * FROM tasks WHERE id=?', [req.params.id]);
  if (!task) return res.status(404).json({ error: 'Nicht gefunden.' });
  const isPriv = ['trainer','vorstand'].includes(req.user.role);
  const isAssigned = task.assigned_to === req.user.id;
  if (!isPriv && !isAssigned) return res.status(403).json({ error: 'Keine Berechtigung.' });
  const { title, event_label, assigned_to, priority, status, due_date, category } = req.body;
  if (isPriv) {
    db.run('UPDATE tasks SET title=COALESCE(?,title),event_label=COALESCE(?,event_label),assigned_to=COALESCE(?,assigned_to),priority=COALESCE(?,priority),status=COALESCE(?,status),due_date=COALESCE(?,due_date),category=COALESCE(?,category) WHERE id=?',
      [title||null,event_label||null,assigned_to||null,priority||null,status||null,due_date||null,category||null,req.params.id]);
  } else if (status) {
    db.run('UPDATE tasks SET status=? WHERE id=?', [status, req.params.id]);
  }
  res.json({ message: 'Aktualisiert.' });
});

router.delete('/:id', authenticate, isTrainer, async (req, res) => {
  await db.getDb(); db.run('DELETE FROM tasks WHERE id=?', [req.params.id]); res.json({ message: 'Gelöscht.' });
});

module.exports = router;
