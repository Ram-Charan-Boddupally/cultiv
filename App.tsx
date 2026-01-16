
import React, { useState, useEffect, useMemo } from 'react';
import { Habit, Completion, TreeHealth } from './types';
import { dbService } from './services/db';
import { calculateHabitState } from './utils/tree.utils';
import { getTodayStr, isScheduledForDate, formatDate } from './utils/date.utils';
import HabitCard from './components/HabitCard';
import TodayStatus from './components/TodayStatus';
import Tree from './components/Tree';
import CalendarHeatmap from './components/CalendarHeatmap';
import YearlyGarden from './components/YearlyGarden';

const DEFAULT_TAGS = ['Fitness', 'Mind', 'Work', 'Social', 'Nature'];

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'detail' | 'add' | 'garden'>('home');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [commentInput, setCommentInput] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<Habit>>({
    name: '',
    description: '',
    tags: [],
    schedule: { type: 'daily', interval: 1 },
    startDate: getTodayStr()
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        await dbService.init();
        const [h, c] = await Promise.all([dbService.getAllHabits(), dbService.getAllCompletions()]);
        setHabits(h);
        setCompletions(c);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  const habitStates = useMemo(() => {
    const states: Record<string, any> = {};
    habits.forEach(h => states[h.id] = calculateHabitState(h, completions));
    return states;
  }, [habits, completions]);

  const allCompletionsDates = useMemo(() => {
    return Array.from(new Set(completions.map(c => c.date)));
  }, [completions]);

  const todayHabits = habits.filter(h => isScheduledForDate(h, new Date()));
  const completedTodayCount = todayHabits.filter(h => habitStates[h.id]?.isCompletedToday).length;

  const handleToggleHabit = async (habitId: string) => {
    const today = getTodayStr();
    const existing = completions.find(c => c.habitId === habitId && c.date === today);

    if (existing) {
      await dbService.removeCompletion(habitId, today);
      setCompletions(prev => prev.filter(c => c.id !== existing.id));
    } else {
      const newC = { id: crypto.randomUUID(), habitId, date: today };
      await dbService.saveCompletion(newC);
      setCompletions(prev => [...prev, newC]);
    }
  };

  const handleUpdateComment = async () => {
    if (!selectedHabitId) return;
    const today = getTodayStr();
    let comp = completions.find(c => c.habitId === selectedHabitId && c.date === today);

    if (!comp) {
      comp = { id: crypto.randomUUID(), habitId: selectedHabitId, date: today, comment: commentInput };
    } else {
      comp = { ...comp, comment: commentInput };
    }

    await dbService.saveCompletion(comp);
    setCompletions(prev => prev.some(c => c.id === comp!.id) ? prev.map(c => c.id === comp!.id ? comp! : c) : [...prev, comp!]);
    setCommentInput('');
  };

  const handleSaveHabit = async () => {
    if (!formData.name) return;
    const habit: Habit = {
      id: selectedHabitId || crypto.randomUUID(),
      name: formData.name,
      description: formData.description || '',
      tags: formData.tags || [],
      schedule: formData.schedule as any,
      startDate: formData.startDate || getTodayStr(),
      createdAt: new Date().toISOString(),
    };
    await dbService.saveHabit(habit);
    setHabits(prev => selectedHabitId ? prev.map(h => h.id === selectedHabitId ? habit : h) : [...prev, habit]);
    setView('home');
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const selectedState = selectedHabitId ? habitStates[selectedHabitId] : null;

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-[900] text-stone-200 tracking-tighter text-4xl italic animate-pulse">CULTIV</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-28 bg-stone-50 overflow-x-hidden relative">
      {view === 'home' && (
        <div className="px-6 pt-10 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-[900] text-stone-900 tracking-tighter italic uppercase">CULTIV</h1>
            <button onClick={() => { setSelectedHabitId(null); setFormData({ name: '', description: '', tags: [], schedule: { type: 'daily', interval: 1 }, startDate: getTodayStr() }); setView('add'); }} className="w-12 h-12 bg-stone-900 text-white rounded-[1.1rem] flex items-center justify-center shadow-2xl active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <TodayStatus total={todayHabits.length} completed={completedTodayCount} />
          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-20 px-10 text-stone-300">
                <p className="font-bold text-lg italic tracking-tighter">Roots empty.</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] mt-3">Planted seeds appear here.</p>
              </div>
            ) : habits.map(h => (
              <HabitCard key={h.id} habit={h} state={habitStates[h.id]} onToggle={handleToggleHabit} onClick={(id) => { setSelectedHabitId(id); setView('detail'); }} />
            ))}
          </div>
        </div>
      )}

      {view === 'garden' && (
        <div className="px-5 pt-10 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-[900] text-stone-900 tracking-tighter italic uppercase">HARVEST</h1>
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-stone-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" /></svg>
            </div>
          </div>
          <YearlyGarden allCompletions={allCompletionsDates} />
        </div>
      )}

      {view === 'detail' && selectedHabit && selectedState && (
        <div className="px-6 pt-10 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setView('home')} className="p-3 -ml-3 text-stone-400 hover:text-stone-900 transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={() => { setFormData(selectedHabit); setView('add'); }} className="text-stone-900 font-black text-[10px] uppercase tracking-widest bg-white border border-stone-200 px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all">Edit Habit</button>
          </div>

          <div className="flex flex-col items-center mb-8 bg-white py-10 rounded-[3rem] border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="relative group">
              <Tree stage={selectedState.growthStage} health={selectedState.health} size="lg" />
            </div>
            <h2 className="text-3xl font-[900] mt-6 tracking-tighter text-stone-900 uppercase italic">{selectedHabit.name}</h2>
            {selectedHabit.description && (
              <p className="text-stone-400 text-sm mt-3 px-10 text-center leading-relaxed font-semibold">
                {selectedHabit.description}
              </p>
            )}
          </div>

          <div className="bg-stone-50 rounded-[2rem] p-5 mb-6 text-stone-900 relative overflow-hidden shadow-sm border border-stone-100">
            <div className="flex justify-between items-center relative z-10">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Growth Pulse</p>
                <p className="text-4xl font-[900] tracking-tighter italic">{selectedState.currentStreak}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Max</p>
                <p className="text-2xl font-black text-stone-300 italic">{selectedState.maxStreak}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2.5 relative z-10">
              <span className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-green-700">
                {selectedState.health}
              </span>
              <span className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-600">
                Phase {selectedState.growthStage}/5
              </span>
            </div>
          </div>

          <div className="mb-8">
            <CalendarHeatmap completions={completions.filter(c => c.habitId === selectedHabitId).map(c => c.date)} title="Metabolic Spectrum" />
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm mb-10">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4">Daily Sync</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={selectedState.isCompletedToday ? "Log output..." : "Sync disabled"}
                disabled={!selectedState.isCompletedToday}
                className="flex-grow bg-stone-50 rounded-[1.2rem] px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 ring-stone-900/5 placeholder:text-stone-200"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              />
              <button onClick={handleUpdateComment} disabled={!selectedState.isCompletedToday} className="bg-stone-900 text-white px-6 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-10 transition-all">Log</button>
            </div>
            {completions.find(c => c.habitId === selectedHabitId && c.date === getTodayStr())?.comment && (
              <div className="mt-4 p-4 bg-green-50 rounded-[1.5rem] border border-green-100 italic font-bold text-xs text-green-800 leading-relaxed shadow-sm">
                "{completions.find(c => c.habitId === selectedHabitId && c.date === getTodayStr())?.comment}"
              </div>
            )}
          </div>

          <button onClick={async () => { if (confirm('Terminate manifest data for this root?')) { await dbService.deleteHabit(selectedHabit.id); setHabits(habits.filter(h => h.id !== selectedHabit.id)); setView('home'); } }} className="w-full text-stone-300 font-black text-[10px] uppercase tracking-[0.4em] py-12 hover:text-rose-400 transition-colors italic">Uproot Root</button>
        </div>
      )}

      {view === 'add' && (
        <div className="px-6 pt-10 h-screen bg-white animate-in slide-in-from-right-8 duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <button onClick={() => setView(selectedHabitId ? 'detail' : 'home')} className="text-stone-300 font-black uppercase text-[10px] tracking-widest">Cancel</button>
            <h2 className="text-xl font-[900] tracking-tighter italic">{selectedHabitId ? 'MODIFY' : 'PLANT'}</h2>
            <button onClick={handleSaveHabit} className={`font-black text-[10px] uppercase tracking-widest py-2.5 px-6 rounded-full transition-all ${formData.name ? 'bg-stone-900 text-white shadow-xl' : 'bg-stone-50 text-stone-200'}`} disabled={!formData.name}>Commit</button>
          </div>

          <div className="space-y-10 flex-grow overflow-y-auto pb-10 scrollbar-hide px-2">
            <div>
              <input type="text" placeholder="Habit Name..." className="w-full text-3xl font-[900] outline-none border-b-4 border-stone-50 focus:border-stone-900 pb-3 transition-all placeholder:text-stone-100 italic tracking-tighter" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} autoFocus />
            </div>

            <div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block mb-4">Description</label>
              <textarea
                placeholder="Mission objective..."
                className="w-full bg-stone-50 rounded-[1.5rem] p-5 text-sm font-bold text-stone-800 outline-none focus:ring-8 ring-stone-900/5 min-h-[120px] resize-none border-2 border-transparent focus:border-stone-900/10 transition-all shadow-inner"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block mb-4">Focus Tags</label>
              <div className="flex flex-wrap gap-2.5">
                {[...DEFAULT_TAGS, ...(formData.tags || []).filter(t => !DEFAULT_TAGS.includes(t))].map(t => (
                  <button key={t} onClick={() => setFormData({ ...formData, tags: formData.tags?.includes(t) ? formData.tags.filter(tg => tg !== t) : [...(formData.tags || []), t] })} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.tags?.includes(t) ? 'bg-stone-900 text-white shadow-lg' : 'bg-stone-50 text-stone-300'}`}>{t}</button>
                ))}
                <div className="flex gap-2">
                  <input type="text" placeholder="+ New" className="w-20 bg-white rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none border-2 border-stone-100 focus:border-stone-900 transition-all" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newTag) { setFormData({ ...formData, tags: [...(formData.tags || []), newTag] }); setNewTag(''); } }} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] block mb-4">Growth Pattern</label>
              <div className="flex gap-2.5 p-2 bg-stone-50 rounded-[1.8rem]">
                <button onClick={() => setFormData({ ...formData, schedule: { type: 'daily', interval: 1 } })} className={`flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.schedule?.type === 'daily' ? 'bg-white shadow-md text-stone-900' : 'text-stone-300'}`}>DAILY</button>
                <button onClick={() => setFormData({ ...formData, schedule: { type: 'weekly', weekdays: [1, 2, 3, 4, 5] } })} className={`flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.schedule?.type === 'weekly' ? 'bg-white shadow-md text-stone-900' : 'text-stone-300'}`}>TARGET</button>
              </div>
              {formData.schedule?.type === 'weekly' && (
                <div className="flex justify-between mt-8 px-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                    <button key={i}
                      onClick={() => { const days = formData.schedule?.weekdays || []; setFormData({ ...formData, schedule: { ...formData.schedule!, weekdays: days.includes(i) ? days.filter(v => v !== i) : [...days, i] } }); }}
                      className={`w-11 h-11 rounded-[1.1rem] text-[10px] font-black transition-all ${formData.schedule?.weekdays?.includes(i) ? 'bg-stone-900 text-white shadow-xl scale-110' : 'bg-stone-200 text-stone-900'}`}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Fixed Bottom Navigation Bar - Minimalist and Trend-aligned */}
      {view !== 'add' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-100 bottom-nav-container flex justify-around items-center z-50">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center gap-1.5 pt-3 transition-all ${view === 'home' || view === 'detail' ? 'text-stone-900' : 'text-stone-300 hover:text-stone-400'}`}
          >
            <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${view === 'home' || view === 'detail' ? 'bg-stone-100' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[9px] font-[900] uppercase tracking-widest">ROOTS</span>
          </button>
          <button
            onClick={() => setView('garden')}
            className={`flex flex-col items-center gap-1.5 pt-3 transition-all ${view === 'garden' ? 'text-stone-900' : 'text-stone-300 hover:text-stone-400'}`}
          >
            <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-colors ${view === 'garden' ? 'bg-stone-100' : ''}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
              </svg>
            </div>
            <span className="text-[9px] font-[900] uppercase tracking-widest">HARVEST</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
