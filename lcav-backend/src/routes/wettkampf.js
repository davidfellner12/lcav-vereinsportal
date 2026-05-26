const express = require('express');
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

const resultsRouter = express.Router();
const regRouter = express.Router();

resultsRouter.get('/bestenliste', authenticate, async (req, res) => {
  await db.getDb();
  const { discipline } = req.query;
  let q = `SELECT r.*,u.name AS athlete_name,u.avatar FROM results r JOIN users u ON r.user_id=u.id WHERE r.result_num IS NOT NULL`;
  const p = [];
  if (discipline) { q += ' AND r.discipline=?'; p.push(discipline); }
  q += ' ORDER BY r.discipline,r.result_num ASC';
  const rows = db.all(q, p);
  const best = {};
  rows.forEach(r => { const k=`${r.discipline}|${r.user_id}`; if (!best[k]) best[k]=r; });
  res.json(Object.values(best));
});

resultsRouter.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const { group, discipline, user_id } = req.query;
  let q = `SELECT r.*,u.name AS athlete_name,u.avatar FROM results r JOIN users u ON r.user_id=u.id WHERE 1=1`;
  const p = [];
  if (group)      { q += ' AND r.group_name=?'; p.push(group); }
  if (discipline) { q += ' AND r.discipline=?'; p.push(discipline); }
  if (user_id)    { q += ' AND r.user_id=?';    p.push(user_id); }
  res.json(db.all(q + ' ORDER BY r.event_date DESC', p));
});

resultsRouter.post('/', authenticate, isTrainer, async (req, res) => {
  const { user_id, discipline, result, result_num, event_name, event_date, place, group_name } = req.body;
  if (!user_id||!discipline||!result) return res.status(400).json({ error: 'user_id, discipline, result erforderlich.' });
  await db.getDb();
  const r = db.run('INSERT INTO results (user_id,discipline,result,result_num,event_name,event_date,place,group_name) VALUES (?,?,?,?,?,?,?,?)',
    [user_id,discipline,result,result_num||null,event_name||null,event_date||null,place||null,group_name||null]);
  res.status(201).json({ id: r.lastInsertRowid });
});

resultsRouter.delete('/:id', authenticate, isTrainer, async (req, res) => {
  await db.getDb(); db.run('DELETE FROM results WHERE id=?', [req.params.id]); res.json({ message: 'Gelöscht.' });
});

regRouter.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const { event_id, user_id } = req.query;
  let q = `SELECT rg.*,u.name AS athlete_name,u.avatar FROM registrations rg JOIN users u ON rg.user_id=u.id WHERE 1=1`;
  const p = [];
  if (event_id) { q += ' AND rg.event_id=?'; p.push(event_id); }
  if (user_id)  { q += ' AND rg.user_id=?';  p.push(user_id); }
  const rows = db.all(q + ' ORDER BY rg.created_at DESC', p);
  rows.forEach(r => { r.disciplines = r.disciplines ? JSON.parse(r.disciplines) : []; });
  res.json(rows);
});

regRouter.post('/', authenticate, async (req, res) => {
  const { event_id, event_label, disciplines } = req.body;
  await db.getDb();
  const r = db.run('INSERT INTO registrations (user_id,event_id,event_label,disciplines) VALUES (?,?,?,?)',
    [req.user.id, event_id||null, event_label||null, JSON.stringify(disciplines||[])]);
  res.status(201).json({ id: r.lastInsertRowid });
});

regRouter.delete('/:id', authenticate, async (req, res) => {
  await db.getDb();
  const reg = db.get('SELECT * FROM registrations WHERE id=?', [req.params.id]);
  if (!reg) return res.status(404).json({ error: 'Nicht gefunden.' });
  if (reg.user_id !== req.user.id && !['trainer','vorstand'].includes(req.user.role)) return res.status(403).json({ error: 'Keine Berechtigung.' });
  db.run('DELETE FROM registrations WHERE id=?', [req.params.id]);
  res.json({ message: 'Abgemeldet.' });
});

module.exports = { resultsRouter, regRouter };
