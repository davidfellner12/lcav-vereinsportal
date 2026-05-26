const router = require('express').Router();
const db = require('../db/database');
const { authenticate, isTrainer } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  await db.getDb();
  const groups = db.all(`SELECT g.*, u.name AS trainer_name FROM groups g LEFT JOIN users u ON g.trainer_id = u.id ORDER BY g.name`);
  groups.forEach(g => {
    const cnt = db.get('SELECT COUNT(*) as c FROM group_members WHERE group_id=?', [g.id]);
    g.member_count = cnt?.c || 0;
  });
  res.json(groups);
});

router.get('/:name/members', authenticate, async (req, res) => {
  await db.getDb();
  const members = db.all(`SELECT u.id,u.name,u.email,u.avatar,u.date_of_birth,gm.disciplines,gm.joined_at FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=(SELECT id FROM groups WHERE name=?) AND u.active=1 ORDER BY u.name`, [req.params.name]);
  members.forEach(m => { m.disciplines = m.disciplines ? JSON.parse(m.disciplines) : []; });
  res.json(members);
});

router.post('/:name/members', authenticate, isTrainer, async (req, res) => {
  const { user_id, disciplines } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id erforderlich.' });
  await db.getDb();
  const group = db.get('SELECT id FROM groups WHERE name=?', [req.params.name]);
  if (!group) return res.status(404).json({ error: 'Gruppe nicht gefunden.' });
  db.run('INSERT OR REPLACE INTO group_members (group_id,user_id,disciplines) VALUES (?,?,?)', [group.id, user_id, JSON.stringify(disciplines||[])]);
  res.status(201).json({ message: 'Hinzugefügt.' });
});

router.delete('/:name/members/:userId', authenticate, isTrainer, async (req, res) => {
  await db.getDb();
  const group = db.get('SELECT id FROM groups WHERE name=?', [req.params.name]);
  if (!group) return res.status(404).json({ error: 'Nicht gefunden.' });
  db.run('DELETE FROM group_members WHERE group_id=? AND user_id=?', [group.id, req.params.userId]);
  res.json({ message: 'Entfernt.' });
});

module.exports = router;
