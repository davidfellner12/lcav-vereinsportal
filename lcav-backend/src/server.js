require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/groups',        require('./routes/groups'));
app.use('/api/channels',      require('./routes/channels'));
app.use('/api/training',      require('./routes/training'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/tasks',         require('./routes/tasks'));

const { resultsRouter, regRouter } = require('./routes/wettkampf');
app.use('/api/results',       resultsRouter);
app.use('/api/registrations', regRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.path} nicht gefunden.` }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Interner Serverfehler.' }); });

const PORT = process.env.PORT || 4000;

// Init DB first, then start server
require('./db/database').getDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🏃 LCAV Backend läuft auf http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Seed:   npm run seed\n`);
  });
}).catch(err => { console.error('DB init fehlgeschlagen:', err); process.exit(1); });
