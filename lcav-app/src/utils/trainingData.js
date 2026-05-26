// Shared seed data used across TrainerHub, Kalender, AthletenDetail

export const ATHLETES = [
    { id: 1,  name: 'Lena Mayr',             group: 'U16', avatar: 'LM', dob: '2010-05-14', disciplines: ['100m','200m','Weitsprung'] },
    { id: 2,  name: 'Jonas Kraft',            group: 'U16', avatar: 'JK', dob: '2011-01-10', disciplines: ['400m','800m'] },
    { id: 3,  name: 'Anna Berger',            group: 'U16', avatar: 'AB', dob: '2010-12-03', disciplines: ['Hochsprung','100m Hürden'] },
    { id: 4,  name: 'Mia Fuchs',              group: 'U16', avatar: 'MF', dob: '2010-07-18', disciplines: ['Weitsprung','200m'] },
    { id: 5,  name: 'Felix Gruber',           group: 'U12', avatar: 'FG', dob: '2013-08-20', disciplines: ['Weitsprung','60m'] },
    { id: 6,  name: 'Valerie Aschenberger',   group: 'U14', avatar: 'VA', dob: '2012-03-25', disciplines: ['100m','200m'] },
    { id: 7,  name: 'Lilly Schweitzer',       group: 'U14', avatar: 'LS', dob: '2012-09-11', disciplines: ['100m','Weitsprung'] },
    { id: 8,  name: 'Hannah Kirchweger',      group: 'U14', avatar: 'HK', dob: '2012-06-07', disciplines: ['800m','1500m'] },
    { id: 9,  name: 'Linus Wagner',           group: 'U14', avatar: 'LW', dob: '2012-11-29', disciplines: ['1000m','1500m'] },
];

export const TRAINING_PLANS = [
    {
        id: 1, group: 'U16', name: 'Wochenplan KW 23', week: 23, year: 2026, createdBy: 'Thomas Regl',
        days: {
            Montag:    [{ id: 101, type: 'Technik',       discipline: '100m',      duration: 90, intensity: 'moderat',  notes: 'Startblocktraining, Reaktion' }],
            Dienstag:  [],
            Mittwoch:  [{ id: 102, type: 'Kraft',          discipline: 'Kugelstoß', duration: 75, intensity: 'intensiv', notes: 'Kraftzirkel + Technik' }],
            Donnerstag:[],
            Freitag:   [{ id: 103, type: 'Schnelligkeit',  discipline: '200m',      duration: 90, intensity: 'intensiv', notes: 'Tempowechselläufe 6×150m' }],
            Samstag:   [{ id: 104, type: 'Ausdauer',       discipline: '800m',      duration: 60, intensity: 'locker',   notes: 'Regeneration + Dehnen' }],
            Sonntag:   [],
        },
    },
    {
        id: 2, group: 'U14', name: 'Wochenplan KW 23', week: 23, year: 2026, createdBy: 'Klaus Hofmann',
        days: {
            Montag:    [{ id: 201, type: 'Koordination',  discipline: '60m',       duration: 60, intensity: 'moderat', notes: 'ABC-Läufe, Skipping' }],
            Dienstag:  [],
            Mittwoch:  [{ id: 202, type: 'Technik',       discipline: 'Weitsprung',duration: 75, intensity: 'moderat', notes: 'Anlauf + Absprung' }],
            Donnerstag:[],
            Freitag:   [{ id: 203, type: 'Schnelligkeit', discipline: '100m',      duration: 60, intensity: 'intensiv',notes: 'Steigerungen, Sprints' }],
            Samstag:   [],
            Sonntag:   [],
        },
    },
];

// Training logs per athlete per date
export const TRAINING_LOGS = [
    { id: 1,  athleteId: 1, date: '2026-06-02', planId: 1, unitId: 101, discipline: '100m',      restingHr: 52, maxHr: 178, avgPace: '3:45', feeling: 8, lactate: null, notes: 'Gutes Training, Start hat gut geklappt' },
    { id: 2,  athleteId: 1, date: '2026-06-04', planId: 1, unitId: 102, discipline: 'Kugelstoß', restingHr: 54, maxHr: 162, avgPace: null,   feeling: 7, lactate: null, notes: 'Körper etwas müde' },
    { id: 3,  athleteId: 1, date: '2026-06-06', planId: 1, unitId: 103, discipline: '200m',      restingHr: 51, maxHr: 185, avgPace: '3:38', feeling: 9, lactate: 4.2,  notes: 'Bestzeit annähernd erreicht!' },
    { id: 4,  athleteId: 2, date: '2026-06-02', planId: 1, unitId: 101, discipline: '100m',      restingHr: 55, maxHr: 174, avgPace: '3:55', feeling: 6, lactate: null, notes: 'Knie leicht unangenehm' },
    { id: 5,  athleteId: 2, date: '2026-06-06', planId: 1, unitId: 103, discipline: '200m',      restingHr: 53, maxHr: 181, avgPace: '3:42', feeling: 8, lactate: 5.1,  notes: 'Tempo gut gehalten' },
    { id: 6,  athleteId: 3, date: '2026-06-02', planId: 1, unitId: 101, discipline: '100m',      restingHr: 50, maxHr: 172, avgPace: null,   feeling: 9, lactate: null, notes: 'Top Form heute' },
    { id: 7,  athleteId: 4, date: '2026-06-04', planId: 1, unitId: 102, discipline: 'Kugelstoß', restingHr: 56, maxHr: 158, avgPace: null,   feeling: 5, lactate: null, notes: 'Nicht gut geschlafen vorher' },
    { id: 8,  athleteId: 6, date: '2026-06-02', planId: 2, unitId: 201, discipline: '60m',       restingHr: 60, maxHr: 175, avgPace: null,   feeling: 8, lactate: null, notes: '' },
    { id: 9,  athleteId: 7, date: '2026-06-04', planId: 2, unitId: 202, discipline: 'Weitsprung',restingHr: 58, maxHr: 168, avgPace: null,   feeling: 7, lactate: null, notes: 'Absprung verbessert' },
];

// Laktat Stufentests
export const LACTATE_TESTS = [
    { id: 1, athleteId: 1, date: '2026-05-15', stages: [
            { stage: 1, load: '3:00 min/km', pace: '3:00', lactate: 1.2, hr: 135, notes: '' },
            { stage: 2, load: '2:50 min/km', pace: '2:50', lactate: 1.8, hr: 148, notes: '' },
            { stage: 3, load: '2:40 min/km', pace: '2:40', lactate: 2.4, hr: 158, notes: '' },
            { stage: 4, load: '2:30 min/km', pace: '2:30', lactate: 3.5, hr: 169, notes: 'Anaerobe Schwelle ca. hier' },
            { stage: 5, load: '2:20 min/km', pace: '2:20', lactate: 5.8, hr: 180, notes: '' },
            { stage: 6, load: '2:10 min/km', pace: '2:10', lactate: 8.2, hr: 188, notes: 'Abbruch wg. Erschöpfung' },
        ]},
    { id: 2, athleteId: 2, date: '2026-05-15', stages: [
            { stage: 1, load: '3:10 min/km', pace: '3:10', lactate: 1.4, hr: 130, notes: '' },
            { stage: 2, load: '3:00 min/km', pace: '3:00', lactate: 2.0, hr: 142, notes: '' },
            { stage: 3, load: '2:50 min/km', pace: '2:50', lactate: 2.8, hr: 155, notes: '' },
            { stage: 4, load: '2:40 min/km', pace: '2:40', lactate: 4.1, hr: 166, notes: 'Schwelle überschritten' },
            { stage: 5, load: '2:30 min/km', pace: '2:30', lactate: 6.9, hr: 177, notes: '' },
        ]},
];

export const FEELING_COLORS = {
    1: '#ef4444', 2: '#ef4444', 3: '#f97316', 4: '#f97316',
    5: '#f59e0b', 6: '#f59e0b', 7: '#84cc16', 8: '#22c55e',
    9: '#22c55e', 10: '#10b981',
};

export const INTENSITY_COLORS = {
    locker: '#22c55e', moderat: '#3b82f6', intensiv: '#f59e0b', wettkampf: '#ef4444',
};