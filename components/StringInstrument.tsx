import React, { useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { getNextNote } from '../constants';
import { StringConfig } from '../types';
import { recorder } from '../services/recorder';

interface Props {
  type: 'guitar' | 'bass';
  tuning: StringConfig[];
}

const StringInstrument: React.FC<Props> = ({ type, tuning }) => {
  // We'll show 5 frets + open string
  const FRETS_COUNT = 5;
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playString = (baseNote: string, fretIndex: number) => {
    const noteToPlay = getNextNote(baseNote, fretIndex);
    if (type === 'guitar') {
      audioEngine.playGuitarString(noteToPlay);
    } else {
      audioEngine.playBassString(noteToPlay);
    }
    
    recorder.logEvent(type, noteToPlay, 'note');
    
    // Visual feedback
    setActiveNote(`${baseNote}-${fretIndex}`);
    setTimeout(() => setActiveNote(null), 150);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full select-none">
      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-8 tracking-tight uppercase">
        {type === 'guitar' ? 'Гитара' : 'Бас-гитара'}
      </h2>
      
      {/* Fretboard Container */}
      <div className="relative bg-[#18181b] rounded-xl shadow-2xl shadow-black/60 p-1 overflow-hidden w-full max-w-2xl border border-white/5">
        
        {/* Wood Texture / Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 opacity-90" />

        {/* Frets (Vertical Lines) */}
        <div className="absolute inset-0 flex pointer-events-none pl-12 sm:pl-16">
          {[...Array(FRETS_COUNT)].map((_, i) => (
             <div key={i} className="flex-1 border-r-[3px] border-neutral-500/30 h-full shadow-[1px_0_2px_rgba(0,0,0,0.5)] flex items-end justify-center pb-2">
                <div className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center">
                    <span className="text-[10px] text-white/40 font-bold">{i + 1}</span>
                </div>
             </div>
          ))}
        </div>

        {/* Strings (Horizontal Lines) */}
        <div className="flex flex-col gap-8 relative z-10 py-6 px-2">
          {tuning.map((stringConfig, stringIndex) => {
            const isPlaying = activeNote?.startsWith(stringConfig.note);
            return (
                <div key={stringConfig.note} className="relative flex items-center h-4">
                
                {/* String visual */}
                <div 
                    className={`absolute w-full top-1/2 -translate-y-1/2 shadow-sm transition-all duration-75
                    ${type === 'bass' ? 'h-[3px] bg-slate-400' : 'h-[1px] bg-amber-100/60'}
                    ${isPlaying ? 'animate-pulse bg-white shadow-[0_0_8px_white]' : ''}
                    `}
                />

                {/* Fret Zones (Invisible buttons) */}
                <div className="flex w-full h-12 -my-4 relative">
                    {/* Open String (Left side label/button) */}
                    <button
                    className={`
                        w-12 sm:w-16 h-12 -ml-2 rounded-lg flex items-center justify-center 
                        text-white font-bold text-sm shrink-0 z-20 transition-all border
                        ${activeNote === `${stringConfig.note}-0` 
                            ? 'bg-amber-600 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-95' 
                            : 'bg-neutral-800 border-white/10 hover:bg-neutral-700'
                        }
                    `}
                    onMouseDown={() => playString(stringConfig.note, 0)}
                    onTouchStart={(e) => { e.preventDefault(); playString(stringConfig.note, 0); }}
                    >
                    {stringConfig.label}
                    </button>

                    {/* Frets 1-5 */}
                    {[...Array(FRETS_COUNT)].map((_, fretIndex) => (
                    <div 
                        key={fretIndex} 
                        className="flex-1 h-full cursor-pointer relative group"
                        onMouseDown={() => playString(stringConfig.note, fretIndex + 1)}
                        onTouchStart={(e) => { e.preventDefault(); playString(stringConfig.note, fretIndex + 1); }}
                    >
                        {/* Hover hint */}
                        <div className="hidden group-hover:block absolute inset-0 bg-white/5 rounded mx-1" />
                        
                        {activeNote === `${stringConfig.note}-${fretIndex + 1}` && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500 blur-sm animate-ping opacity-80"/>
                        )}
                        {activeNote === `${stringConfig.note}-${fretIndex + 1}` && (
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white] z-30"/>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            )
          })}
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-sm font-medium">
        Зажимайте лады или играйте открытые струны
      </p>
    </div>
  );
};

export default StringInstrument;