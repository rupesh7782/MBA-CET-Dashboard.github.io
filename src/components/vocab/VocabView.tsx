import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Type, Plus, Search, Sparkles, Volume2, RotateCw, 
  CheckCircle2, XCircle, Award, Star, Trash2, Edit3
} from 'lucide-react';
import { VocabWord } from '../../types';
import { Modal } from '../common/Modal';

export const VocabView: React.FC = () => {
  const { vocabWords, addVocabWord, updateVocabWord, deleteVocabWord, updateVocabMastery, triggerConfetti } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [flippedWordId, setFlippedWordId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(30);

  // Edit Word Form State
  const [editWord, setEditWord] = useState('');
  const [editPronunciation, setEditPronunciation] = useState('');
  const [editMeaning, setEditMeaning] = useState('');
  const [editSynonyms, setEditSynonyms] = useState('');
  const [editAntonyms, setEditAntonyms] = useState('');
  const [editExample, setEditExample] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Quiz Mode State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // New Word Form State
  const [newWord, setNewWord] = useState('');
  const [newPronunciation, setNewPronunciation] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newSynonyms, setNewSynonyms] = useState('');
  const [newAntonyms, setNewAntonyms] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const filteredWords = vocabWords.filter(w => {
    const matchesDiff = selectedDifficulty === 'All' || w.difficulty === selectedDifficulty;
    const matchesSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    addVocabWord({
      word: newWord,
      pronunciation: newPronunciation,
      meaning: newMeaning,
      synonyms: newSynonyms.split(',').map(s => s.trim()).filter(Boolean),
      antonyms: newAntonyms.split(',').map(a => a.trim()).filter(Boolean),
      example: newExample,
      difficulty: newDifficulty,
      revisionDate: new Date().toISOString().split('T')[0],
      masteryLevel: 1,
    });

    setIsAddOpen(false);
    setNewWord('');
    setNewMeaning('');
    setNewSynonyms('');
    setNewAntonyms('');
    setNewExample('');
  };

  const openEditModal = (word: VocabWord) => {
    setEditingWord(word);
    setEditWord(word.word);
    setEditPronunciation(word.pronunciation || '');
    setEditMeaning(word.meaning);
    setEditSynonyms(word.synonyms ? word.synonyms.join(', ') : '');
    setEditAntonyms(word.antonyms ? word.antonyms.join(', ') : '');
    setEditExample(word.example || '');
    setEditDifficulty(word.difficulty || 'Medium');
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWord || !editWord.trim() || !editMeaning.trim()) return;

    updateVocabWord(editingWord.id, {
      word: editWord.trim(),
      pronunciation: editPronunciation.trim(),
      meaning: editMeaning.trim(),
      synonyms: editSynonyms.split(',').map(s => s.trim()).filter(Boolean),
      antonyms: editAntonyms.split(',').map(a => a.trim()).filter(Boolean),
      example: editExample.trim(),
      difficulty: editDifficulty,
    });

    setIsEditOpen(false);
    setEditingWord(null);
  };

  // Speak word aloud
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quiz Logic
  const currentQuizWord = vocabWords[quizIndex % vocabWords.length];
  // Generate options (1 correct meaning + 3 distractor meanings)
  const quizOptions = React.useMemo(() => {
    if (!currentQuizWord) return [];
    const correct = currentQuizWord.meaning;
    const distractors = vocabWords
      .filter(w => w.id !== currentQuizWord.id)
      .map(w => w.meaning)
      .slice(0, 3);
    const options = [correct, ...distractors];
    return options.sort(() => Math.random() - 0.5);
  }, [quizIndex, currentQuizWord, vocabWords]);

  const handleAnswerSelect = (opt: string) => {
    if (quizSubmitted) return;
    setSelectedAnswer(opt);
    setQuizSubmitted(true);
    if (opt === currentQuizWord.meaning) {
      setQuizScore(prev => prev + 1);
      updateVocabMastery(currentQuizWord.id, 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    if (quizIndex + 1 >= Math.min(10, vocabWords.length)) {
      triggerConfetti();
    }
    setQuizIndex(prev => prev + 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[22px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span className="font-bold text-base text-[#FF7A00] leading-none flex items-center justify-center">Aa</span>
            <span>MBA CET Vocabulary Builder & Flashcards</span>
          </h2>
          <p className="text-xs text-[#A9A9A9] mt-1">
            Master high-frequency GRE/CAT/CET words with spaced repetition and quizzes
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsQuizMode(!isQuizMode)}
            className={`px-4 py-2.5 rounded-[14px] font-bold text-xs flex items-center space-x-2 transition-all border ${
              isQuizMode 
                ? 'bg-[#38E27A] text-black border-[#38E27A]' 
                : 'bg-[#141414] text-white border-white/10 hover:border-[#FF7A00]'
            }`}
            id="vocab-quiz-toggle-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isQuizMode ? 'Exit Quiz' : 'Quiz Mode'}</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] text-xs flex items-center space-x-1.5"
            id="vocab-add-word-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      {/* QUIZ MODE DISPLAY */}
      {isQuizMode ? (
        <div className="bg-[#0a0a0a] border border border-white/10 rounded-[22px] p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-xs font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-3 py-1 rounded-full">
              Question {quizIndex + 1} of {Math.min(10, vocabWords.length)}
            </span>
            <span className="text-sm font-bold text-white">Score: {quizScore}</span>
          </div>

          <div className="text-center py-4">
            <h3 className="text-3xl font-black text-white tracking-wide">{currentQuizWord?.word}</h3>
            {currentQuizWord?.pronunciation && (
              <p className="text-xs text-[#A9A9A9] mt-1 font-mono">{currentQuizWord.pronunciation}</p>
            )}
            <p className="text-xs text-[#707070] mt-3">Select the correct definition below:</p>
          </div>

          <div className="space-y-3">
            {quizOptions.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuizWord?.meaning;

              let btnStyle = 'bg-[#141414] border-white/5 hover:border-white/20 text-white';
              if (quizSubmitted) {
                if (isCorrect) btnStyle = 'bg-[#38E27A]/20 border-[#38E27A] text-[#38E27A] font-bold';
                else if (isSelected) btnStyle = 'bg-[#FF5A5A]/20 border-[#FF5A5A] text-[#FF5A5A]';
              }

              return (
                <button
                  key={i}
                  disabled={quizSubmitted}
                  onClick={() => handleAnswerSelect(opt)}
                  className={`w-full p-4 text-left rounded-[16px] border text-xs leading-relaxed transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={handleNextQuizQuestion}
                className="px-6 py-2.5 bg-[#FF7A00] text-black font-bold rounded-[14px] text-xs hover:bg-[#FFB547]"
              >
                Next Word →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* NORMAL FLASHCARD GRID */
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    selectedDifficulty === diff 
                      ? 'bg-[#FF7A00] text-black' 
                      : 'bg-[#0a0a0a] text-[#A9A9A9] border border-white/5 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#707070] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vocabulary..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Flashcards Grid */}
          <div className="flex items-center justify-between text-xs text-[#A9A9A9] pb-1">
            <span>Showing <strong className="text-white">{Math.min(visibleCount, filteredWords.length)}</strong> of <strong className="text-[#FF7A00]">{filteredWords.length}</strong> words</span>
            {filteredWords.length > visibleCount && (
              <button
                onClick={() => setVisibleCount(prev => prev + 60)}
                className="text-xs text-[#FF7A00] hover:underline font-semibold"
              >
                Show All {filteredWords.length} Words
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.slice(0, visibleCount).map(word => {
              const isFlipped = flippedWordId === word.id;

              return (
                <div
                  key={word.id}
                  className="bg-[#0a0a0a] border border-white/5 hover:border-[#FF7A00]/40 rounded-[22px] p-6 flex flex-col justify-between transition-all min-h-[220px] relative group"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        word.difficulty === 'Easy' ? 'bg-[#38E27A]/20 text-[#38E27A]' :
                        word.difficulty === 'Medium' ? 'bg-[#F4B400]/20 text-[#F4B400]' :
                        'bg-[#FF5A5A]/20 text-[#FF5A5A]'
                      }`}>
                        {word.difficulty}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => speakWord(word.word)}
                          className="p-1.5 text-[#707070] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
                          title="Listen pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(word)}
                          className="p-1.5 text-[#707070] hover:text-[#FFB547] rounded-lg hover:bg-white/5 cursor-pointer"
                          title="Edit word"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVocabWord(word.id)}
                          className="p-1.5 text-[#707070] hover:text-[#FF5A5A] rounded-lg hover:bg-white/5 cursor-pointer"
                          title="Delete word"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Word & Pronunciation */}
                    {!isFlipped ? (
                      <div className="mt-4">
                        <h3 className="text-2xl font-black text-white tracking-wide">{word.word}</h3>
                        {word.pronunciation && (
                          <p className="text-xs text-[#A9A9A9] font-mono mt-1">{word.pronunciation}</p>
                        )}
                        <p className="text-xs text-white/90 mt-3 font-medium leading-relaxed">
                          {word.meaning}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2 text-xs">
                        <p className="text-[#A9A9A9] italic">"{word.example}"</p>
                        <div className="pt-2">
                          <p className="text-[10px] text-[#707070] uppercase font-bold">Synonyms:</p>
                          <p className="text-white font-medium">{word.synonyms.join(', ') || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#707070] uppercase font-bold">Antonyms:</p>
                          <p className="text-[#A9A9A9]">{word.antonyms.join(', ') || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          onClick={() => updateVocabMastery(word.id, i + 1 - word.masteryLevel)}
                          className={`w-3.5 h-3.5 cursor-pointer ${
                            i < word.masteryLevel ? 'text-[#FFB547] fill-[#FFB547]' : 'text-[#262626]'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setFlippedWordId(isFlipped ? null : word.id)}
                      className="text-xs text-[#FF7A00] font-bold flex items-center space-x-1 hover:underline"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Show Meaning' : 'Examples & Synonyms'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWords.length > visibleCount && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 60)}
                className="px-6 py-3 bg-[#0a0a0a] border border-white/10 hover:border-[#FF7A00] text-white font-bold rounded-[16px] text-xs transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Load More Words ({filteredWords.length - visibleCount} remaining)</span>
              </button>
              <button
                onClick={() => setVisibleCount(filteredWords.length)}
                className="px-6 py-3 bg-[#FF7A00] text-black font-bold rounded-[16px] text-xs transition-all flex items-center space-x-2 hover:bg-[#FF7A00]/90 cursor-pointer"
              >
                <span>Show All {filteredWords.length} Words</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Word Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Word to Vocabulary"
        subtitle="Build your personal CET dictionary"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Word</label>
              <input
                type="text"
                required
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. Perspicacious"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Pronunciation (Optional)</label>
              <input
                type="text"
                value={newPronunciation}
                onChange={(e) => setNewPronunciation(e.target.value)}
                placeholder="/pər.spɪˈkeɪ.ʃəs/"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Meaning / Definition</label>
            <textarea
              rows={2}
              required
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              placeholder="e.g. Having a ready insight into and understanding of things..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Synonyms (Comma separated)</label>
              <input
                type="text"
                value={newSynonyms}
                onChange={(e) => setNewSynonyms(e.target.value)}
                placeholder="Shrewd, Astute, Wise"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e: any) => setNewDifficulty(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Usage Sentence Example</label>
            <textarea
              rows={2}
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="e.g. The perspicacious analyst quickly spotted the accounting anomaly..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-[#A9A9A9] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547]"
            >
              Save Word
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Word Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingWord(null);
        }}
        title="Edit Vocabulary Word"
        subtitle="Update word definition, synonyms, or difficulty"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Word</label>
              <input
                type="text"
                required
                value={editWord}
                onChange={(e) => setEditWord(e.target.value)}
                placeholder="e.g. Perspicacious"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Pronunciation (Optional)</label>
              <input
                type="text"
                value={editPronunciation}
                onChange={(e) => setEditPronunciation(e.target.value)}
                placeholder="/pər.spɪˈkeɪ.ʃəs/"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Meaning / Definition</label>
            <textarea
              rows={2}
              required
              value={editMeaning}
              onChange={(e) => setEditMeaning(e.target.value)}
              placeholder="e.g. Having a ready insight into and understanding of things..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Synonyms (Comma separated)</label>
              <input
                type="text"
                value={editSynonyms}
                onChange={(e) => setEditSynonyms(e.target.value)}
                placeholder="Shrewd, Astute, Wise"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Antonyms (Comma separated)</label>
              <input
                type="text"
                value={editAntonyms}
                onChange={(e) => setEditAntonyms(e.target.value)}
                placeholder="Foolish, Ignorant"
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[#A9A9A9] mb-1 font-medium">Difficulty</label>
              <select
                value={editDifficulty}
                onChange={(e: any) => setEditDifficulty(e.target.value)}
                className="w-full bg-[#111111] border border-white/10 rounded-[16px] px-3.5 py-2 text-white focus:outline-none focus:border-[#FF7A00]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A9A9A9] mb-1 font-medium">Usage Sentence Example</label>
            <textarea
              rows={2}
              value={editExample}
              onChange={(e) => setEditExample(e.target.value)}
              placeholder="e.g. The perspicacious analyst quickly spotted the accounting anomaly..."
              className="w-full bg-[#111111] border border-white/10 rounded-[16px] p-3 text-white focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsEditOpen(false);
                setEditingWord(null);
              }}
              className="px-4 py-2 text-[#A9A9A9] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF7A00] text-black font-bold rounded-[14px] hover:bg-[#FFB547] cursor-pointer"
            >
              Update Word
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
