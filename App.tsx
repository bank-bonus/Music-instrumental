import React, { useState } from 'react';
import DrumPad from './components/DrumPad';
import SynthKeys from './components/SynthKeys';
import StringInstrument from './components/StringInstrument';
import StudioControls from './components/StudioControls';
import Library from './components/Library';
import { ViewState } from './types';
import { audioEngine } from './services/audioEngine';
import { recorder } from './services/recorder';
import { GUITAR_TUNING, BASS_TUNING } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.MENU);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [songName, setSongName] = useState('');

  const handleNav = (target: ViewState) => {
    // Initialize audio context on first user interaction
    audioEngine.init();
    setView(target);
  };

  const handleSave = () => {
    if (!songName.trim()) return;
    recorder.saveSong(songName);
    setShowSaveModal(false);
    setSongName('');
    alert('Проект сохранен в библиотеку!');
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.DRUMS:
        return <DrumPad />;
      case ViewState.SYNTH:
        return <SynthKeys />;
      case ViewState.GUITAR:
        return <StringInstrument type="guitar" tuning={GUITAR_TUNING} />;
      case ViewState.BASS:
        return <StringInstrument type="bass" tuning={BASS_TUNING} />;
      case ViewState.LIBRARY:
        return <Library onLoad={() => setView(ViewState.MENU)} />;
      case ViewState.MENU:
      default:
        return (
          <div className="grid grid-cols-1 gap-6 w-full max-w-sm px-4 perspective-1000">
            <button
              onClick={() => handleNav(ViewState.DRUMS)}
              className="group relative p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
              <div className="relative flex items-center gap-6">
                <div className="text-5xl drop-shadow-lg transform group-hover:rotate-12 transition-transform duration-300">🥁</div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">Барабаны</div>
                  <div className="text-rose-100 font-medium text-sm mt-1 opacity-90">Биты и ритмы</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleNav(ViewState.SYNTH)}
              className="group relative p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
              <div className="relative flex items-center gap-6">
                <div className="text-5xl drop-shadow-lg transform group-hover:-rotate-12 transition-transform duration-300">🎹</div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">Синтезатор</div>
                  <div className="text-indigo-100 font-medium text-sm mt-1 opacity-90">Пианино, Пад, 8-Бит</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleNav(ViewState.GUITAR)}
              className="group relative p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay" />
              <div className="relative flex items-center gap-6">
                <div className="text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">🎸</div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">Гитара</div>
                  <div className="text-amber-100 font-medium text-sm mt-1 opacity-90">Акустика и Соло</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleNav(ViewState.BASS)}
              className="group relative p-6 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700 to-purple-800 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-6">
                <div className="text-5xl drop-shadow-lg transform group-hover:translate-x-2 transition-transform duration-300">🎸</div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">Бас-гитара</div>
                  <div className="text-purple-100 font-medium text-sm mt-1 opacity-90">Грув и Бас</div>
                </div>
              </div>
            </button>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-4" />

            <button
              onClick={() => handleNav(ViewState.LIBRARY)}
              className="glass-panel p-4 rounded-2xl hover:bg-slate-800/60 transition-all flex items-center justify-center gap-3 text-slate-200 font-bold border border-white/10 shadow-lg"
            >
               <span className="text-xl">📂</span> Библиотека записей
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/50">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-40 border-b-0 border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView(ViewState.MENU)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-sm">
              STUDIO<span className="text-indigo-400">.AI</span>
            </h1>
          </div>
          
          {view !== ViewState.MENU && (
             <button 
               onClick={() => setView(ViewState.MENU)}
               className="px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-sm font-bold text-slate-300 transition-all border border-white/10 backdrop-blur-md"
             >
               Меню
             </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start pb-36">
        {renderContent()}
      </main>

      {/* Studio Controls */}
      <StudioControls 
        onSaveRequest={() => setShowSaveModal(true)} 
        currentView={view} 
      />

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/50 p-8 rounded-3xl w-full max-w-sm shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
             
             <h3 className="text-2xl font-black text-white mb-2 relative z-10">Сохранить трек</h3>
             <p className="text-slate-400 text-sm mb-6 relative z-10">Дайте название вашему шедевру</p>
             
             <input
               autoFocus
               type="text"
               placeholder="Название..."
               className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-8 transition-all relative z-10"
               value={songName}
               onChange={(e) => setSongName(e.target.value)}
             />
             <div className="flex gap-4 relative z-10">
               <button 
                 onClick={() => setShowSaveModal(false)}
                 className="flex-1 py-3 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors"
               >
                 Отмена
               </button>
               <button 
                 onClick={handleSave}
                 className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
               >
                 Сохранить
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;