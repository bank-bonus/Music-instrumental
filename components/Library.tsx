import React, { useEffect, useState } from 'react';
import { recorder } from '../services/recorder';
import { Song } from '../types';

interface Props {
  onLoad: () => void;
}

const Library: React.FC<Props> = ({ onLoad }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const refreshSongs = () => {
    setSongs(recorder.getSavedSongs());
  };

  useEffect(() => {
    refreshSongs();
  }, []);

  const handleLoad = (song: Song) => {
    if (isSelectionMode) {
        toggleSelection(song.id);
        return;
    }
    if (confirm(`Загрузить проект "${song.title}"? Текущий прогресс будет потерян.`)) {
        recorder.loadSong(song);
        onLoad();
    }
  };

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => 
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirm('Удалить эту запись навсегда?')) {
          recorder.deleteSong(id);
          refreshSongs();
      }
  };

  const handleShare = (e: React.MouseEvent, song: Song) => {
      e.stopPropagation();
      if (window.vkBridge) {
          const message = `🎵 Я записал новый трек "${song.title}" в приложении "Создай Мелодию"! \n\nВ нем ${song.tracks.length} дорожек. Попробуй и ты создать свой хит! https://vk.com/app54060719`;
          window.vkBridge.send('VKWebAppShowWallPostBox', {
              message: message,
              attachments: 'https://vk.com/app54060719'
          }).catch((err: any) => console.log(err));
      } else {
          alert('Шеринг доступен только ВКонтакте');
      }
  };

  const handlePreview = (e: React.MouseEvent, song: Song) => {
      e.stopPropagation();
      if (previewId === song.id) {
          recorder.stopPreview();
          setPreviewId(null);
      } else {
          recorder.stopPreview();
          recorder.previewSong(song);
          setPreviewId(song.id);
          setTimeout(() => {
              if (previewId === song.id) setPreviewId(null);
          }, 30000);
      }
  };

  const handleMerge = () => {
      const songsToMerge = songs.filter(s => selectedIds.includes(s.id));
      if (songsToMerge.length < 2) return;
      
      const title = prompt('Название для объединенного трека:', `Микс из ${songsToMerge.length} треков`);
      if (title) {
          recorder.mergeSongs(songsToMerge, title);
          refreshSongs();
          setSelectedIds([]);
          setIsSelectionMode(false);
          alert('Треки успешно объединены!');
      }
  };

  return (
    <div className="w-full max-w-lg p-4 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="text-4xl">📂</span> Библиотека
        </h2>
        {songs.length > 1 && (
            <button 
                onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setSelectedIds([]);
                }}
                className={`text-sm font-bold px-4 py-2 rounded-full border transition-all ${isSelectionMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'glass-panel border-white/10 text-slate-300 hover:bg-white/10'}`}
            >
                {isSelectionMode ? 'Отмена' : 'Выбрать'}
            </button>
        )}
      </div>

      {/* Merge Action Bar */}
      {isSelectionMode && selectedIds.length > 1 && (
          <div className="mb-6 p-4 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl flex items-center justify-between animate-fade-in backdrop-blur-md">
              <span className="text-indigo-200 font-medium">Выбрано: {selectedIds.length}</span>
              <button 
                onClick={handleMerge}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-colors"
              >
                  Объединить
              </button>
          </div>
      )}

      {songs.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border-dashed border-2 border-slate-700">
              <div className="text-4xl mb-4">🎵</div>
              <p className="text-slate-400 font-medium">Нет сохраненных записей</p>
              <p className="text-slate-600 text-sm mt-2">Запишите свой первый хит!</p>
          </div>
      ) : (
          <div className="grid gap-4">
              {songs.map(song => (
                  <div 
                    key={song.id} 
                    onClick={() => handleLoad(song)}
                    className={`
                        group relative glass-panel rounded-2xl p-5 flex justify-between items-center cursor-pointer transition-all duration-300 hover:translate-x-1
                        ${selectedIds.includes(song.id) ? 'border-indigo-500 bg-indigo-900/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'hover:bg-slate-800/60 hover:shadow-lg'}
                    `}
                  >
                      <div className="flex items-center gap-5">
                          {isSelectionMode && (
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedIds.includes(song.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 bg-black/20'}`}>
                                  {selectedIds.includes(song.id) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                              </div>
                          )}
                          
                          {/* Preview Button */}
                          <button
                            onClick={(e) => handlePreview(e, song)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${previewId === song.id ? 'bg-indigo-500 text-white shadow-indigo-500/40 scale-110' : 'bg-slate-700/50 text-slate-300 hover:bg-indigo-500 hover:text-white'}`}
                          >
                              {previewId === song.id ? (
                                  <div className="flex gap-1">
                                      <div className="w-1 h-3 bg-white animate-[bounce_1s_infinite]"/>
                                      <div className="w-1 h-3 bg-white animate-[bounce_1s_infinite_0.1s]"/>
                                      <div className="w-1 h-3 bg-white animate-[bounce_1s_infinite_0.2s]"/>
                                  </div>
                              ) : (
                                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              )}
                          </button>

                          <div>
                              <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-300 transition-colors">{song.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-black/30 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                                   {new Date(song.date).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-400">{song.tracks.length} дорожек</span>
                              </div>
                          </div>
                      </div>

                      {!isSelectionMode && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={(e) => handleShare(e, song)}
                                className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                                title="Поделиться"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                            <button 
                                onClick={(e) => handleDelete(e, song.id)}
                                className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                title="Удалить"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                      )}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default Library;