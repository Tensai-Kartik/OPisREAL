'use client';

import { useState, useEffect } from 'react';
import DynamicBackground from '@/components/game/DynamicBackground';
import CharacterSearchInput from '@/components/game/CharacterSearchInput';
import GiveUpButton from '@/components/game/GiveUpButton';
import GiveUpConfirmModal from '@/components/game/GiveUpConfirmModal';
import ComparisonTable from '@/components/game/ComparisonTable';
import CluesPanel from '@/components/game/CluesPanel';
import VictoryCardModal from '@/components/game/VictoryCardModal';
import LegendModal from '@/components/game/LegendModal';
import ThemeToggle from '@/components/game/ThemeToggle';
import FeedbackModal from '@/components/game/FeedbackModal';
import { GuessComparison, ClueItem } from '@/types/game';
import { Character } from '@/types/character';
import { Anchor, HelpCircle, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

export default function GamePage() {
  const [sessionToken, setSessionToken] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessComparison[]>([]);
  const [clues, setClues] = useState<ClueItem[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isSurrendered, setIsSurrendered] = useState<boolean>(false);
  const [isGivingUp, setIsGivingUp] = useState<boolean>(false);
  const [isConfirmGiveUpOpen, setIsConfirmGiveUpOpen] = useState<boolean>(false);
  const [winningCharacter, setWinningCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Initialize Game Session
  const initNewGame = () => {
    setIsLoading(true);
    setGuesses([]);
    setClues([]);
    setIsWon(false);
    setIsSurrendered(false);
    setIsGivingUp(false);
    setIsConfirmGiveUpOpen(false);
    setWinningCharacter(null);
    setErrorMsg(null);

    fetch('/api/game/start', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionToken) {
          setSessionToken(data.sessionToken);
          setGameId(data.gameId);
        } else {
          setErrorMsg('Failed to initialize game session.');
        }
      })
      .catch(() => setErrorMsg('Network error starting game.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    initNewGame();
  }, []);

  const handleGuess = (characterId: string) => {
    if (!sessionToken || isSubmitting || isWon || isSurrendered) return;

    setIsSubmitting(true);
    const nextCount = guesses.length + 1;

    fetch('/api/game/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken,
        guessCharacterId: characterId,
        guessCount: nextCount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.comparison) {
          setGuesses((prev) => [data.comparison, ...prev]);
          if (data.unlockedClues) setClues(data.unlockedClues);

          if (data.isCorrect) {
            setIsWon(true);
            setIsSurrendered(false);
            if (data.targetCharacterCard) {
              setWinningCharacter(data.targetCharacterCard);
            }
          }
        }
      })
      .catch(() => setErrorMsg('Failed to submit guess.'))
      .finally(() => setIsSubmitting(false));
  };

  const handleConfirmSurrender = async () => {
    if (!sessionToken || isSubmitting || isWon || isSurrendered || isGivingUp) return;

    setIsGivingUp(true);
    try {
      const res = await fetch('/api/game/give-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });
      const data = await res.json();
      if (data.targetCharacter) {
        setWinningCharacter(data.targetCharacter);
        setIsSurrendered(true);
        setIsWon(true);
        setIsConfirmGiveUpOpen(false);
      } else {
        setErrorMsg('Failed to reveal character.');
      }
    } catch {
      setErrorMsg('Failed to reveal character.');
    } finally {
      setIsGivingUp(false);
    }
  };

  const guessedIds = guesses.map((g) => g.character.id);
  const isDark = theme === 'dark';

  return (
    <main
      className={`min-h-screen relative flex flex-col justify-between p-3 md:p-6 transition-colors duration-500 ${
        isDark ? 'text-slate-100' : 'text-slate-900 light-theme'
      }`}
    >
      {/* Dynamic Background */}
      <DynamicBackground theme={theme} />

      {/* Top-right controls — Feedback + Theme Toggle */}
      <div className="fixed top-3 right-4 z-50 flex items-center space-x-2">
        <FeedbackModal theme={theme} />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
        {/* Header */}
        <header className="text-center my-3">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-1.5 backdrop-blur-md shadow-sm ${
            isDark
              ? 'bg-amber-950/70 border-amber-500/40 text-amber-400'
              : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
          }`}>
            <Anchor className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <span>One Piece Character Guessing Game</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase gold-gradient-text drop-shadow-md">
            ONE PIECE IS REAL
          </h1>
          <p className={`text-xs md:text-sm max-w-md mx-auto mt-1 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Test your anime & manga knowledge. Guess the hidden character!
          </p>

          <div className="flex items-center justify-center space-x-3 mt-2.5">
            <button
              onClick={() => setIsLegendOpen(true)}
              className={`group px-3.5 py-1.5 border rounded-xl text-xs font-extrabold uppercase flex items-center space-x-1.5 transition-all duration-200 backdrop-blur-md shadow-sm cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                isDark
                  ? 'bg-slate-900/85 border-amber-600/30 text-amber-400 hover:bg-slate-800 hover:border-amber-400 hover:shadow-[0_0_14px_rgba(245,158,11,0.25)]'
                  : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-amber-500 hover:shadow-md'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
              <span>How to Play</span>
            </button>
            <button
              onClick={initNewGame}
              className={`group px-3.5 py-1.5 border rounded-xl text-xs font-extrabold uppercase flex items-center space-x-1.5 transition-all duration-200 backdrop-blur-md shadow-sm cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                isDark
                  ? 'bg-slate-900/85 border-amber-600/30 text-slate-300 hover:bg-slate-800 hover:text-amber-300 hover:border-amber-500/50'
                  : 'bg-white/95 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-amber-800 hover:border-amber-500/50 hover:shadow-md'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Reset Game</span>
            </button>
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <div className="my-10 text-center text-amber-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-xs font-semibold">Selecting a random character from One Piece...</p>
          </div>
        ) : errorMsg ? (
          <div className="my-6 p-4 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
            <button onClick={initNewGame} className="underline font-bold ml-2">Retry</button>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {/* 4 Horizontal Hints & Clues Panel ABOVE Character Search */}
            <CluesPanel clues={clues} guessCount={guesses.length} theme={theme} />

            {/* Centered Search & Guess Bar with Give Up Box Beside It */}
            <div className="w-full max-w-2xl mx-auto flex items-center justify-center gap-3">
              <div className="flex-1 max-w-xl">
                <CharacterSearchInput
                  onSelectCharacter={handleGuess}
                  guessedIds={guessedIds}
                  disabled={isWon || isSubmitting || isSurrendered}
                  theme={theme}
                />
              </div>

              {/* Character-styled Give Up Box */}
              <GiveUpButton
                onGiveUp={() => setIsConfirmGiveUpOpen(true)}
                disabled={isWon || isSubmitting || isSurrendered || !sessionToken}
                isLoading={isGivingUp}
                theme={theme}
              />
            </div>

            {/* Comparison Table */}
            <ComparisonTable guesses={guesses} theme={theme} />
          </div>
        )}
      </div>

      {/* Give Up Confirmation Warning Modal (Tatakae vs Surrender) */}
      <GiveUpConfirmModal
        isOpen={isConfirmGiveUpOpen}
        onClose={() => setIsConfirmGiveUpOpen(false)}
        onConfirmSurrender={handleConfirmSurrender}
        isLoading={isGivingUp}
      />

      {/* Victory / Surrender Card Modal */}
      {isWon && winningCharacter && (
        <VictoryCardModal
          character={winningCharacter}
          guessCount={guesses.length}
          isSurrender={isSurrendered}
          onPlayAgain={initNewGame}
        />
      )}

      {/* Legend Modal */}
      <LegendModal isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />

      {/* Fan Disclaimer Footer */}
      <footer className={`mt-6 text-center text-[11px] py-2 border-t ${isDark ? 'text-slate-400/80 border-slate-800/80' : 'text-slate-500 border-slate-200'}`}>
        <p className="max-w-2xl mx-auto">
          One Piece and its characters are the property of Eiichiro Oda, Shueisha, Toei Animation, and respective rights holders.
          This is an unofficial, non-commercial fan-made project created for entertainment purposes.
        </p>
      </footer>
    </main>
  );
}
