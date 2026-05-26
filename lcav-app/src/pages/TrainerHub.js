import React, { useState } from 'react';
import {
    Users, MessageSquare, Send, Hash, ChevronRight,
    TrendingUp, Activity, Heart, AlertTriangle, Star,
    Filter, Download, Plus, Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ATHLETES, TRAINING_LOGS, LACTATE_TESTS, FEELING_COLORS } from '../utils/trainingData';

// ── Discipline-based chat channels ──────────────────────────────────────────
const CHANNELS = [
    { id: 'sprint',     name: 'Sprint',         icon: '⚡', disciplines: ['60m','100m','200m','400m'] },
    { id: 'mittel',     name: 'Mittelstrecke',  icon: '🏃', disciplines: ['800m','1500m','3000m','5000m'] },
    { id: 'lang',       name: 'Langstrecke',    icon: '🌄', disciplines: ['10000m','Marathon','Crosslauf'] },
    { id: 'sprung',     name: 'Sprung',         icon: '🦘', disciplines: ['Weitsprung','Hochsprung','Dreisprung','Stabhochsprung'] },
    { id: 'wurf',       name: 'Wurf',           icon: '🎯', disciplines: ['Kugelstoß','Diskuswurf','Speerwurf','Hammerwurf'] },
    { id: 'hurden',     name: 'Hürden',         icon: '🚧', disciplines: ['100m Hürden','110m Hürden','400m Hürden'] },
    { id: 'allgemein',  name: 'Allgemein',      icon: '💬', disciplines: [] },
];

const INIT_MESSAGES = {
    sprint:  [
        { id: 1, from: 'Thomas Regl',  avatar: 'TR', text: 'Morgen fokussieren wir uns auf die Startreaktion – Blöcke mitbringen!', time: '14:00', isTrainer: true },
        { id: 2, from: 'Lena Mayr',    avatar: 'LM', text: 'Kann ich auch mit Spikes kommen?', time: '14:05', isTrainer: false },
        { id: 3, from: 'Thomas Regl',  avatar: 'TR', text: 'Ja, unbedingt! Bahn 3 und 4 sind reserviert.', time: '14:08', isTrainer: true },
    ],
    mittel:  [
        { id: 1, from: 'Thomas Regl',  avatar: 'TR', text: 'Samstag: 3×1000m mit 3min Pause – Zieltempo 3:30/km', time: '10:00', isTrainer: true },
        { id: 2, from: 'Jonas Kraft',  avatar: 'JK', text: 'Passt! Soll ich mein Garmin Daten danach schicken?', time: '10:15', isTrainer: false },
    ],
    allgemein: [
        { id: 1, from: 'Thomas Regl',  avatar: 'TR', text: 'Hallo alle! Neues Portal ist live – hier können wir uns absprechen 🎉', time: '09:00', isTrainer: true },
    ],
};

export default function TrainerHub() {
    const { currentUser, setActivePage } = useApp();
    const isTrainer = currentUser?.role === 'trainer' || currentUser?.role === 'vorstand';

    const [activeTab,    setActiveTab]    = useState('athletes');
    const [activeChannel, setChannel]    = useState('sprint');
    const [messages,     setMessages]    = useState(INIT_MESSAGES);
    const [input,        setInput]       = useState('');
    const [groupFilter,  setGroupFilter] = useState('alle');
    const [selectedAthlete, setAthlete]  = useState(null);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const sendMessage = () => {
        if (!input.trim()) return;
        const msg = {
            id: Date.now(),
            from: currentUser.name,
            avatar: currentUser.avatar || 'XX',
            text: input.trim(),
            time: new Date().toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' }),
            isTrainer,
        };
        setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), msg] }));
        setInput('');
    };

    const getAthleteStats = (athlete) => {
        const logs = TRAINING_LOGS.filter(l => l.athleteId === athlete.id);
        const feelingAvg = logs.length ? (logs.reduce((s, l) => s + (l.feeling || 0), 0) / logs.length).toFixed(1) : '–';
        const lastLog    = logs.sort((a, b) => b.date.localeCompare(a.date))[0];
        const lactat     = LACTATE_TESTS.find(t => t.athleteId === athlete.id);
        const lastLaktat = lactat?.stages?.slice(-1)[0]?.lactate;
        return { logCount: logs.length, feelingAvg, lastLog, lastLaktat };
    };

    const filteredAthletes = groupFilter === 'alle'
        ? ATHLETES
        : ATHLETES.filter(a => a.group === groupFilter);

    const groups = [...new Set(ATHLETES.map(a => a.group))];
    const ch     = CHANNELS.find(c => c.id === activeChannel);
    const msgs   = messages[activeChannel] || [];

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ padding: 28, maxWidth: 1300 }}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={20} color="var(--blue-light)" />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Trainer Hub</h1>
                        <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Athleten-Übersicht · Disziplin-Chats · Trainingssteuerung</p>
                    </div>
                </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: 'var(--navy-mid)', padding: 4, borderRadius: 10, border: '1px solid rgba(26,90,171,0.2)', width: 'fit-content' }}>
                {[
                    { key: 'athletes', label: 'Athleten-Übersicht', icon: Users },
                    { key: 'chat',     label: 'Disziplin-Chats',   icon: MessageSquare },
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setActiveTab(key)} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                        background: activeTab === key ? 'var(--blue)' : 'transparent',
                        border: 'none', color: activeTab === key ? 'white' : 'var(--grey-400)', cursor: 'pointer',
                    }}>
                        <Icon size={14} />{label}
                    </button>
                ))}
            </div>

            {/* ── ATHLETES VIEW ───────────────────────────────────────────────────── */}
            {activeTab === 'athletes' && (
                <>
                    {/* Group filter */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {['alle', ...groups].map(g => (
                            <button key={g} onClick={() => setGroupFilter(g)} style={{
                                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                background: groupFilter === g ? 'var(--blue)' : 'rgba(26,90,171,0.1)',
                                border: `1px solid ${groupFilter === g ? 'var(--blue)' : 'rgba(26,90,171,0.25)'}`,
                                color: groupFilter === g ? 'white' : 'var(--grey-400)', cursor: 'pointer',
                            }}>{g === 'alle' ? 'Alle Gruppen' : g}</button>
                        ))}
                    </div>

                    {/* Athlete cards grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                        {filteredAthletes.map(athlete => {
                            const stats = getAthleteStats(athlete);
                            const feelingColor = FEELING_COLORS[Math.round(parseFloat(stats.feelingAvg))] || 'var(--grey-400)';
                            return (
                                <div key={athlete.id} style={{
                                    background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)',
                                    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                                    transition: 'border-color 0.15s',
                                }}>
                                    {/* Card header */}
                                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,90,171,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--blue-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                                            {athlete.avatar}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>{athlete.name}</div>
                                            <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                                                <span className="tag tag-blue">{athlete.group}</span>
                                                {athlete.disciplines.slice(0, 2).map(d => <span key={d} className="tag tag-grey" style={{ fontSize: 9 }}>{d}</span>)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
                                        <StatCell label="Trainings" value={stats.logCount} icon={Activity} color="var(--blue-light)" />
                                        <StatCell label="Ø Feeling" value={stats.feelingAvg} icon={Heart} color={feelingColor} border />
                                        <StatCell label="Letztes Laktat" value={stats.lastLaktat ? `${stats.lastLaktat} mmol` : '–'} icon={TrendingUp} color="var(--accent)" border />
                                    </div>

                                    {/* Last log preview */}
                                    {stats.lastLog && (
                                        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(26,90,171,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ fontSize: 10, color: 'var(--grey-600)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Letzter Eintrag</div>
                                            <div style={{ fontSize: 12, color: 'var(--grey-400)' }}>
                                                <span style={{ color: 'var(--white)', fontWeight: 500 }}>{stats.lastLog.date}</span>
                                                {' · '}{stats.lastLog.discipline}
                                                {stats.lastLog.maxHr && <span style={{ color: '#f87171', marginLeft: 6 }}>♥ {stats.lastLog.maxHr} bpm</span>}
                                                {stats.lastLog.avgPace && <span style={{ color: 'var(--blue-light)', marginLeft: 6 }}>⏱ {stats.lastLog.avgPace}/km</span>}
                                            </div>
                                            {stats.lastLog.notes && <div style={{ fontSize: 11, color: 'var(--grey-600)', marginTop: 2, fontStyle: 'italic' }}>„{stats.lastLog.notes}"</div>}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(26,90,171,0.1)', display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => { setActivePage('athletendetail'); setAthlete(athlete); localStorage.setItem('lcav_selected_athlete', JSON.stringify(athlete)); }}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: 'rgba(26,90,171,0.15)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 7, color: 'var(--blue-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            <Eye size={13} /> Detailansicht
                                        </button>
                                        <button
                                            onClick={() => { setActivePage('trainingsplan_kalender'); localStorage.setItem('lcav_selected_athlete', JSON.stringify(athlete)); }}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: 'rgba(26,90,171,0.15)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 7, color: 'var(--blue-light)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            <Activity size={13} /> Kalender
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* ── CHAT VIEW ───────────────────────────────────────────────────────── */}
            {activeTab === 'chat' && (
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, height: 600 }}>
                    {/* Channel list */}
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(26,90,171,0.15)' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disziplin-Kanäle</div>
                            <div style={{ fontSize: 10, color: 'var(--grey-600)', marginTop: 2 }}>Trainer ↔ Athleten</div>
                        </div>
                        <div style={{ padding: 8, flex: 1, overflowY: 'auto' }}>
                            {CHANNELS.map(c => (
                                <button key={c.id} onClick={() => setChannel(c.id)} style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 10px', borderRadius: 7,
                                    background: activeChannel === c.id ? 'rgba(26,90,171,0.3)' : 'transparent',
                                    border: 'none', color: activeChannel === c.id ? 'white' : 'var(--grey-400)',
                                    fontSize: 13, cursor: 'pointer', fontWeight: activeChannel === c.id ? 600 : 400,
                                    marginBottom: 2,
                                }}>
                                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div>{c.name}</div>
                                        {c.disciplines.length > 0 && (
                                            <div style={{ fontSize: 9, color: 'var(--grey-600)', lineHeight: 1.2 }}>
                                                {c.disciplines.slice(0, 3).join(', ')}{c.disciplines.length > 3 ? '…' : ''}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat window */}
                    <div style={{ background: 'var(--navy-mid)', border: '1px solid rgba(26,90,171,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{ch?.icon}</span>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{ch?.name}</div>
                                {ch?.disciplines.length > 0 && (
                                    <div style={{ fontSize: 11, color: 'var(--grey-400)' }}>{ch?.disciplines.join(' · ')}</div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {msgs.map(m => {
                                const isOwn = m.from === currentUser?.name;
                                return (
                                    <div key={m.id} style={{ display: 'flex', gap: 10, flexDirection: isOwn ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, background: m.isTrainer ? 'var(--blue)' : 'var(--navy-light)' }}>
                                            {m.avatar}
                                        </div>
                                        <div style={{ maxWidth: '70%' }}>
                                            <div style={{ fontSize: 11, color: m.isTrainer ? 'var(--blue-light)' : 'var(--grey-400)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                                                {m.from}
                                                {m.isTrainer && <span className="tag tag-gold" style={{ fontSize: 9 }}>Trainer</span>}
                                            </div>
                                            <div style={{ padding: '9px 13px', borderRadius: isOwn ? '14px 14px 4px 14px' : '4px 14px 14px 14px', background: isOwn ? 'linear-gradient(135deg,var(--blue),var(--blue-bright))' : 'rgba(255,255,255,0.05)', border: isOwn ? 'none' : '1px solid rgba(26,90,171,0.15)', fontSize: 13, lineHeight: 1.5 }}>
                                                {m.text}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--grey-600)', marginTop: 2, textAlign: isOwn ? 'right' : 'left' }}>{m.time}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(26,90,171,0.15)', display: 'flex', gap: 10 }}>
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                   placeholder={`Nachricht an ${ch?.name}…`}
                                   style={{ flex: 1, padding: '9px 13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(26,90,171,0.25)', borderRadius: 8, color: 'white', fontSize: 13, outline: 'none' }} />
                            <button onClick={sendMessage} style={{ width: 40, height: 40, background: 'var(--blue)', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Send size={16} color="white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCell({ label, value, icon: Icon, color, border }) {
    return (
        <div style={{ padding: '10px 14px', borderLeft: border ? '1px solid rgba(26,90,171,0.1)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <Icon size={11} color={color} />
                <span style={{ fontSize: 10, color: 'var(--grey-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value}</div>
        </div>
    );
}