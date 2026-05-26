import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Hash, Lock, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CHANNELS = [
  { id: 'allgemein',  name: 'Allgemein',       type: 'public',  group: null,     icon: Hash },
  { id: 'trainer',    name: 'Trainer-Kanal',    type: 'private', group: null,     icon: Lock, trainerOnly: true },
  { id: 'vorstand',   name: 'Vorstand',         type: 'private', group: null,     icon: Lock, vorstandOnly: true },
  { id: 'u12',        name: 'Gruppe U12',       type: 'group',   group: 'U12',    icon: Hash },
  { id: 'u14',        name: 'Gruppe U14',       type: 'group',   group: 'U14',    icon: Hash },
  { id: 'u16',        name: 'Gruppe U16',       type: 'group',   group: 'U16',    icon: Hash },
  { id: 'u18',        name: 'Gruppe U18',       type: 'group',   group: 'U18',    icon: Hash },
  { id: 'aktive',     name: 'Aktive',           type: 'group',   group: 'Aktive', icon: Hash },
  { id: 'events',     name: 'Veranstaltungen',  type: 'public',  group: null,     icon: Hash },
];

const INITIAL_MESSAGES = {
  allgemein: [
    { id: 1, from: 'Walter Regl',     avatar: 'WR', text: 'Willkommen im neuen LCAV-Portal! 🎉 Bitte stellt euch kurz vor.',  time: '09:00', date: 'Heute' },
    { id: 2, from: 'Maria Bruneder',  avatar: 'MB', text: 'Hallo zusammen! Freue mich auf die neue Plattform. Die U12 ist bereit!', time: '09:15', date: 'Heute' },
    { id: 3, from: 'Thomas Regl',     avatar: 'TR', text: 'Der neue Trainingsplan für U16 ist ab sofort unter Trainingsplanung abrufbar.', time: '10:30', date: 'Heute' },
  ],
  u16: [
    { id: 1, from: 'Thomas Regl',     avatar: 'TR', text: 'Hi Leute! Trainingseinheit Dienstag beginnt 10min früher – ab 17:20 Uhr.', time: '08:00', date: 'Gestern' },
    { id: 2, from: 'Lena Mayr',       avatar: 'LM', text: 'Danke für die Info! Ich komme etwas später, ca. 17:45.',              time: '08:22', date: 'Gestern' },
    { id: 3, from: 'Thomas Regl',     avatar: 'TR', text: 'Kein Problem Lena. Für Samstag: bitte Spikes mitbringen, wir machen Bahntraining.', time: '14:00', date: 'Heute' },
  ],
  trainer: [
    { id: 1, from: 'Sandra Kirchner', avatar: 'SK', text: 'Wer kann beim Meeting in Linz als Kampfrichter einspringen?',          time: '11:00', date: 'Heute' },
    { id: 2, from: 'Thomas Regl',     avatar: 'TR', text: 'Ich kann Fr-So dabei sein.',                                           time: '11:35', date: 'Heute' },
  ],
  events: [
    { id: 1, from: 'Walter Regl',     avatar: 'WR', text: 'Wichtig: Für den Kinderzehnkampf am 19.09. brauchen wir noch 8 Helfer. Bitte meldet euch!', time: '16:00', date: 'Gestern' },
    { id: 2, from: 'Maria Bruneder',  avatar: 'MB', text: 'Ich melde mich für den Aufbau am Vorabend.',                           time: '16:30', date: 'Gestern' },
  ],
};

export default function Chat() {
  const { currentUser } = useApp();
  const [activeChannel, setActiveChannel] = useState('allgemein');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const isTrainer = currentUser.role === 'trainer' || currentUser.role === 'vorstand';
  const isVorstand = currentUser.role === 'vorstand';

  const visibleChannels = CHANNELS.filter(ch => {
    if (ch.trainerOnly && !isTrainer) return false;
    if (ch.vorstandOnly && !isVorstand) return false;
    return true;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel, messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: currentUser.name,
      avatar: currentUser.avatar,
      text: input.trim(),
      time: new Date().toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' }),
      date: 'Heute',
      isOwn: true,
    };
    setMessages(prev => ({ ...prev, [activeChannel]: [...(prev[activeChannel] || []), newMsg] }));
    setInput('');
  };

  const ch = CHANNELS.find(c => c.id === activeChannel);
  const msgs = messages[activeChannel] || [];

  return (
    <div style={{ padding: 28, maxWidth: 1200, height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, background: 'rgba(26,90,171,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={20} color="var(--blue-light)" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, textTransform: 'uppercase' }}>Kommunikation</h1>
          <p style={{ fontSize: 13, color: 'var(--grey-400)' }}>Gruppen- & Vereinskanäle</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, minHeight: 0 }}>
        {/* Channel list */}
        <div style={{
          background: 'var(--navy-mid)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(26,90,171,0.2)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kanäle</span>
            {isTrainer && <Plus size={14} color="var(--blue-light)" style={{ cursor: 'pointer' }} />}
          </div>
          <div style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
            {[
              { section: 'Öffentlich', items: visibleChannels.filter(c => c.type === 'public') },
              { section: 'Trainer / Vorstand', items: visibleChannels.filter(c => c.type === 'private') },
              { section: 'Trainingsgruppen', items: visibleChannels.filter(c => c.type === 'group') },
            ].map(({ section, items }) => items.length > 0 && (
              <div key={section} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--grey-600)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{section}</div>
                {items.map(ch => {
                  const active = activeChannel === ch.id;
                  const Icon = ch.icon;
                  return (
                    <button key={ch.id} onClick={() => setActiveChannel(ch.id)} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                      padding: '6px 10px', borderRadius: 6,
                      background: active ? 'rgba(26,90,171,0.3)' : 'transparent',
                      border: 'none', color: active ? 'var(--white)' : 'var(--grey-400)',
                      fontSize: 13, cursor: 'pointer', fontWeight: active ? 600 : 400,
                    }}>
                      <Icon size={13} />
                      {ch.name}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{
          background: 'var(--navy-mid)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(26,90,171,0.2)',
          display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          {/* Header */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(26,90,171,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {ch && <ch.icon size={16} color="var(--blue-light)" />}
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{ch?.name}</span>
            {ch?.type === 'private' && <span className="tag tag-gold">Privat</span>}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {msgs.map((m, i) => {
              const isOwn = m.from === currentUser.name;
              const showDate = i === 0 || msgs[i - 1].date !== m.date;
              return (
                <React.Fragment key={m.id}>
                  {showDate && (
                    <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--grey-600)', padding: '4px 0' }}>
                      <span style={{ padding: '3px 12px', background: 'rgba(26,90,171,0.1)', borderRadius: 10 }}>{m.date}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isOwn ? 'var(--blue-bright)' : 'var(--navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {m.avatar}
                    </div>
                    <div style={{ maxWidth: '70%' }}>
                      {!isOwn && <div style={{ fontSize: 11, color: 'var(--blue-light)', fontWeight: 600, marginBottom: 3 }}>{m.from}</div>}
                      <div style={{
                        padding: '9px 13px',
                        background: isOwn ? 'linear-gradient(135deg, var(--blue), var(--blue-bright))' : 'rgba(255,255,255,0.05)',
                        border: isOwn ? 'none' : '1px solid rgba(26,90,171,0.15)',
                        borderRadius: isOwn ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                        fontSize: 13, lineHeight: 1.5,
                      }}>{m.text}</div>
                      <div style={{ fontSize: 10, color: 'var(--grey-600)', marginTop: 3, textAlign: isOwn ? 'right' : 'left' }}>{m.time}</div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(26,90,171,0.15)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={`Nachricht an #${ch?.name}...`}
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(26,90,171,0.25)',
                  borderRadius: 8, color: 'var(--white)', fontSize: 13, outline: 'none',
                }}
              />
              <button onClick={sendMessage} style={{
                width: 40, height: 40, borderRadius: 8,
                background: 'var(--blue)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <Send size={16} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
