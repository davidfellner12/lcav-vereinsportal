const router = require('express').Router();
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const { group, week, year } = req.query;
  let q = 'SELECT tp.*, u.name AS creator_name FROM training_plans tp LEFT JOIN users u ON tp.created_by=u.id WHERE 1=1';
  const p = [];
  if (group) { q += ' AND tp.group_name=?'; p.push(group); }
  if (week)  { q += ' AND tp.week=?';       p.push(week); }
  if (year)  { q += ' AND tp.year=?';       p.push(year); }
  res.json(db.all(q + ' ORDER BY tp.year DESC,tp.week DESC', p));
});

router.get('/:id', authenticate, async (req, res) => {
  await db.getDb();
  const plan = db.get('SELECT * FROM training_plans WHERE id=?', [req.params.id]);
  if (!plan) return res.status(404).json({ error: 'Nicht gefunden.' });
  const units = db.all('SELECT * FROM training_units WHERE plan_id=? ORDER BY day,sort_order', [req.params.id]);
  const days = {};
  units.forEach(u => { (days[u.day] = days[u.day]||[]).push(u); });
  res.json({ ...plan, days });
});

router.post('/', authenticate, isTrainer, async (req, res) => {
  const { group_name, name, week, year } = req.body;
  if (!group_name || !name) return res.status(400).json({ error: 'group_name und name erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO training_plans (group_name,name,week,year,created_by) VALUES (?,?,?,?,?)',
    [group_name, name, week||null, year||new Date().getFullYear(), req.user.id]);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/:id', authenticate, isTrainer, async (req, res) => {
  const { name, week, year } = req.body;
  await db.getDb();
  db.run('UPDATE training_plans SET name=COALESCE(?,name),week=COALESCE(?,week),year=COALESCE(?,year) WHERE id=?',
    [name||null, week||null, year||null, req.params.id]);
  res.json({ message: 'Aktualisiert.' });
});

router.delete('/:id', authenticate, isTrainer, async (req, res) => {
  await db.getDb();
  db.run('DELETE FROM training_plans WHERE id=?', [req.params.id]);
  res.json({ message: 'Gelöscht.' });
});

router.post('/:id/units', authenticate, isTrainer, async (req, res) => {
  const { day, type, discipline, duration_min, intensity, notes, sort_order } = req.body;
  if (!day || !discipline) return res.status(400).json({ error: 'day und discipline erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO training_units (plan_id,day,type,discipline,duration_min,intensity,notes,sort_order) VALUES (?,?,?,?,?,?,?,?)',
    [req.params.id, day, type||'Allgemein', discipline, duration_min||60, intensity||'moderat', notes||null, sort_order||0]);
  res.status(201).json({ id: r.lastInsertRowid });
});

router.put('/units/:unitId', authenticate, isTrainer, async (req, res) => {
  const { type, discipline, duration_min, intensity, notes } = req.body;
  await db.getDb();
  db.run('UPDATE training_units SET type=COALESCE(?,type),discipline=COALESCE(?,discipline),duration_min=COALESCE(?,duration_min),intensity=COALESCE(?,intensity),notes=COALESCE(?,notes) WHERE id=?',
    [type||null,discipline||null,duration_min||null,intensity||null,notes||null,req.params.unitId]);
  res.json({ message: 'Aktualisiert.' });
});

router.delete('/units/:unitId', authenticate, isTrainer, async (req, res) => {
  await db.getDb();
  db.run('DELETE FROM training_units WHERE id=?', [req.params.unitId]);
  res.json({ message: 'Gelöscht.' });
});

module.exports = router;
