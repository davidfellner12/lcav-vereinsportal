const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../db/database');
const { authenticate } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email und Passwort erforderlich.' });
  const d = await db.getDb();
  const user = db.get('SELECT * FROM users WHERE email = ? AND active = 1', [email.toLowerCase()]);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, group_name: user.group_name, avatar: user.avatar },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

router.get('/me', authenticate, async (req, res) => {
  await db.getDb();
  const user = db.get('SELECT id,name,email,role,group_name,avatar,date_of_birth,phone,active FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ error: 'Nicht gefunden.' });
  res.json(user);
});

router.put('/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Neues Passwort mind. 6 Zeichen.' });
  await db.getDb();
  const user = db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(400).json({ error: 'Aktuelles Passwort falsch.' });
  db.run('UPDATE users SET password = ? WHERE id = ?', [bcrypt.hashSync(newPassword, 10), req.user.id]);
  res.json({ message: 'Passwort geändert.' });
});

module.exports = router;
