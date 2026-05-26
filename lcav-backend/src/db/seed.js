require('dotenv').config();
const bcrypt = require('bcryptjs');

async function seed() {
  const db = require('./database');
  await db.getDb();
  console.log('🌱 Seeding LCAV database...');

  db.exec(`
    DELETE FROM registrations; DELETE FROM results;
    DELETE FROM tasks; DELETE FROM event_helpers; DELETE FROM events;
    DELETE FROM training_units; DELETE FROM training_plans;
    DELETE FROM messages; DELETE FROM channels;
    DELETE FROM group_members; DELETE FROM groups; DELETE FROM users;
  `);

  const pw = bcrypt.hashSync('lcav2026', 10);
  const users = [
    ['Walter Regl',      'walterr@lcav-jodl.at',    'vorstand', null,     'WR', '1968-03-15'],
    ['Maria Bruneder',   'maria.bruneder@lcav.at',   'trainer',  'U12',   'MB', '1981-07-22'],
    ['Thomas Regl',      'thomas.regl@lcav.at',      'trainer',  'U16',   'TR', '1979-11-08'],
    ['Sandra Kirchner',  'sandra.kirchner@lcav.at',  'trainer',  'Aktive','SK', '1985-04-30'],
    ['Petra Mayr',       'petra.mayr@lcav.at',       'trainer',  'U10',   'PM', '1990-09-12'],
    ['Klaus Hofmann',    'klaus.hofmann@lcav.at',    'trainer',  'U14',   'KH', '1975-02-28'],
    ['Lena Mayr',        'lena.mayr@lcav.at',        'mitglied', 'U16',   'LM', '2010-05-14'],
    ['Felix Gruber',     'felix.gruber@lcav.at',     'mitglied', 'U12',   'FG', '2013-08-20'],
    ['Jonas Kraft',      'jonas.kraft@lcav.at',      'mitglied', 'U16',   'JK', '2011-01-10'],
    ['Anna Berger',      'anna.berger@lcav.at',      'mitglied', 'U16',   'AB', '2010-12-03'],
    ['Mia Fuchs',        'mia.fuchs@lcav.at',        'mitglied', 'U16',   'MF', '2010-07-18'],
    ['Valerie Aschenberger','valerie.a@lcav.at',     'mitglied', 'U14',   'VA', '2012-03-25'],
    ['Lilly Schweitzer', 'lilly.s@lcav.at',          'mitglied', 'U14',   'LS', '2012-09-11'],
    ['Hannah Kirchweger','hannah.k@lcav.at',         'mitglied', 'U14',   'HK', '2012-06-07'],
    ['Linus Wagner',     'linus.w@lcav.at',          'mitglied', 'U14',   'LW', '2012-11-29'],
  ];

  const uid = {};
  users.forEach(([name,email,role,group,avatar,dob]) => {
    const r = db.run('INSERT INTO users (name,email,password,role,group_name,avatar,date_of_birth) VALUES (?,?,?,?,?,?,?)',
      [name, email, pw, role, group, avatar, dob]);
    uid[name] = r.lastInsertRowid;
  });
  console.log(`✓ ${users.length} users`);

  const groups = [
    ['U10',     uid['Petra Mayr'],       'Mi 16:00, Sa 10:00',                        '#7c3aed','🌟'],
    ['U12',     uid['Maria Bruneder'],   'Di 16:30, Do 16:30, Sa 10:00',              '#059669','⚡'],
    ['U14',     uid['Klaus Hofmann'],    'Mo 17:00, Mi 17:00, Fr 16:30',              '#1a5aab','🔥'],
    ['U16',     uid['Thomas Regl'],      'Mo 17:30, Mi 17:30, Fr 17:00, Sa 9:00',    '#d97706','💪'],
    ['U18',     uid['Sandra Kirchner'], 'Di 18:00, Do 18:00, Sa 9:00',               '#dc2626','🏃'],
    ['U20',     uid['Sandra Kirchner'], 'Mo 18:30, Do 18:30',                        '#0891b2','🎯'],
    ['Aktive',  uid['Sandra Kirchner'], 'Mo-Fr 18:30, Sa 9:30',                      '#0f2540','🏆'],
    ['Masters', null,                    'Di 09:00, Do 09:00',                        '#6b7280','🌿'],
  ];
  const gid = {};
  groups.forEach(([name,tid,sched,color,icon]) => {
    const r = db.run('INSERT INTO groups (name,trainer_id,schedule,color,icon) VALUES (?,?,?,?,?)', [name,tid,sched,color,icon]);
    gid[name] = r.lastInsertRowid;
  });

  [
    ['U16','Lena Mayr',   ['100m','200m','Weitsprung']],
    ['U16','Jonas Kraft', ['400m','800m']],
    ['U16','Anna Berger', ['Hochsprung','100m Hürden']],
    ['U16','Mia Fuchs',   ['Weitsprung','200m']],
    ['U12','Felix Gruber',['Weitsprung','60m']],
    ['U14','Valerie Aschenberger',['100m','200m']],
    ['U14','Lilly Schweitzer',['100m','Weitsprung']],
    ['U14','Hannah Kirchweger',['800m','1500m']],
    ['U14','Linus Wagner',['1000m','1500m']],
  ].forEach(([g,u,d]) => {
    if (gid[g] && uid[u]) db.run('INSERT OR IGNORE INTO group_members (group_id,user_id,disciplines) VALUES (?,?,?)', [gid[g],uid[u],JSON.stringify(d)]);
  });
  console.log('✓ Groups & members');

  const channels = [
    ['Allgemein','public',null],['Veranstaltungen','public',null],
    ['Trainer-Kanal','private',null],['Vorstand','private',null],
    ['Gruppe U12','group','U12'],['Gruppe U14','group','U14'],
    ['Gruppe U16','group','U16'],['Gruppe U18','group','U18'],['Aktive','group','Aktive'],
  ];
  const chid = {};
  channels.forEach(([name,type,gn]) => { const r = db.run('INSERT INTO channels (name,type,group_name) VALUES (?,?,?)',[name,type,gn]); chid[name]=r.lastInsertRowid; });

  const now = Date.now();
  [
    ['Allgemein','Walter Regl',    'Willkommen im neuen LCAV-Portal! 🎉', now-3600000],
    ['Allgemein','Maria Bruneder', 'Hallo! Die U12 ist bereit!',          now-3000000],
    ['Allgemein','Thomas Regl',    'Trainingsplan für U16 ist online.',    now-1800000],
    ['Gruppe U16','Thomas Regl',   'Training Di startet 10min früher.',   now-86400000],
    ['Gruppe U16','Lena Mayr',     'Danke! Ich komme ca. 17:45.',        now-84000000],
    ['Trainer-Kanal','Sandra Kirchner','Wer kann beim Meeting Kampfrichter machen?', now-7200000],
    ['Trainer-Kanal','Thomas Regl','Ich bin Fr-So dabei.',                now-6600000],
  ].forEach(([ch,user,text,ts]) => {
    const t = new Date(ts).toISOString().replace('T',' ').substring(0,19);
    if (chid[ch]&&uid[user]) db.run('INSERT INTO messages (channel_id,user_id,text,created_at) VALUES (?,?,?,?)',[chid[ch],uid[user],text,t]);
  });
  console.log('✓ Channels & messages');

  const events = [
    ['40. Attnanger Stadtlauf','2026-05-31','10:30','Attnang-Puchheim','Wettkampf','["Alle"]',18,'abgeschlossen'],
    ['Int. Vöcklabrucker Sparkassen Meeting','2026-06-06','14:00','Voralpenstadion Vöcklabruck','Wettkampf','["Aktive","U18","U20"]',20,'geplant'],
    ['Vorstandssitzung Sommer','2026-06-21','19:00','Vereinslokal','Meeting','["Vorstand"]',0,'geplant'],
    ['OÖ Landesmeisterschaften U14','2026-07-05','10:00','Linz','Auswärts','["U14"]',2,'geplant'],
    ['Speedy Kids Cup Vöcklabruck','2026-08-29','09:00','Voralpenstadion Vöcklabruck','Wettkampf','["U10","U12"]',15,'geplant'],
    ['26. Vöcklabrucker Kinderzehnkampf','2026-09-19','09:30','Voralpenstadion Vöcklabruck','Wettkampf','["U12","U14","U16"]',25,'geplant'],
  ];
  const eid = {};
  events.forEach(([title,...rest]) => {
    const r = db.run('INSERT INTO events (title,date,time,location,type,groups,helpers_needed,status,created_by) VALUES (?,?,?,?,?,?,?,?,?)',[title,...rest,uid['Walter Regl']]);
    eid[title]=r.lastInsertRowid;
  });
  console.log('✓ Events');

  [
    ['Zeitnahme / Zeitmessung','Sparkassen Meeting',uid['Maria Bruneder'],'hoch','erledigt','2026-06-06','Technik'],
    ['Kampfrichter Kugelstoß','Kinderzehnkampf',uid['Thomas Regl'],'mittel','bestätigt','2026-09-19','Kampfgericht'],
    ['Siegerehrung moderieren','Sparkassen Meeting',uid['Sandra Kirchner'],'niedrig','bestätigt','2026-06-06','Moderation'],
    ['Erste Hilfe Betreuung','Alle Events',uid['Petra Mayr'],'hoch','bestätigt',null,'Sanitäter'],
    ['Aufbau Sprunganlage','Kinderzehnkampf',uid['Felix Gruber'],'hoch','offen','2026-09-18','Aufbau'],
    ['Catering koordinieren','Stadtlauf',null,'mittel','offen','2026-05-30','Logistik'],
    ['Auf- und Abbau Tribüne','Kinderzehnkampf',null,'hoch','offen','2026-09-18','Aufbau'],
    ['Vereinsshop betreuen','Kinderzehnkampf',null,'mittel','offen','2026-09-19','Verkauf'],
  ].forEach(([title,el,at,prio,status,due,cat]) => {
    db.run('INSERT INTO tasks (title,event_label,assigned_to,group_name,priority,status,due_date,category,created_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [title,el,at,'Alle',prio,status,due,cat,uid['Walter Regl']]);
  });
  console.log('✓ Tasks');

  const pr = db.run('INSERT INTO training_plans (group_name,name,week,year,created_by) VALUES (?,?,?,?,?)',['U16','Wochenplan KW 23',23,2026,uid['Thomas Regl']]);
  [
    ['Montag','Technik','100m',90,'moderat','Startblocktraining, Reaktion'],
    ['Mittwoch','Kraft','Kugelstoß',75,'intensiv','Kraftzirkel + Technik'],
    ['Freitag','Schnelligkeit','200m',90,'intensiv','Tempowechselläufe'],
    ['Samstag','Ausdauer','800m',60,'locker','Regeneration + Dehnen'],
  ].forEach(([day,type,disc,dur,int,notes],i) => {
    db.run('INSERT INTO training_units (plan_id,day,type,discipline,duration_min,intensity,notes,sort_order) VALUES (?,?,?,?,?,?,?,?)',
      [pr.lastInsertRowid,day,type,disc,dur,int,notes,i+1]);
  });

  [
    [uid['Lena Mayr'],   '100m',      '12.45s',12.45,'OÖ LM U16','2026-05-10',1,'U16'],
    [uid['Jonas Kraft'], '400m',      '52.10s',52.10,'OÖ LM U16','2026-05-10',3,'U16'],
    [uid['Anna Berger'], 'Hochsprung','1.65m', 1.65, 'Kreismeist.','2026-04-20',2,'U16'],
    [uid['Felix Gruber'],'Weitsprung','4.80m', 4.80, 'Kindercup','2026-05-03',1,'U12'],
    [uid['Mia Fuchs'],   '200m',      '26.30s',26.30,'Kreismeist.','2026-04-20',2,'U16'],
  ].forEach(args => db.run('INSERT INTO results (user_id,discipline,result,result_num,event_name,event_date,place,group_name) VALUES (?,?,?,?,?,?,?,?)',args));

  console.log('\n✅ Datenbank erfolgreich befüllt!');
  console.log('👤 Passwort für alle Nutzer: lcav2026');
  console.log('📧 Beispiel-Logins:');
  console.log('   walterr@lcav-jodl.at  (Vorstand)');
  console.log('   thomas.regl@lcav.at   (Trainer U16)');
  console.log('   lena.mayr@lcav.at     (Mitglied U16)');
}

seed().catch(err => { console.error('Seed-Fehler:', err); process.exit(1); });
