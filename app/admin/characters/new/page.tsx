'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Tag,
  Users,
  Briefcase,
  Compass,
  BookOpen,
  Sparkles,
  Zap,
  Flame,
  Sliders,
} from 'lucide-react';
import { Character } from '@/types/character';
import CharacterAvatar from '@/components/game/CharacterAvatar';

const PRESET_DEVIL_FRUIT_TYPES = [
  'Paramecia',
  'Special Paramecia',
  'Zoan',
  'Ancient Zoan',
  'Mythical Zoan',
  'Artificial Zoan',
  'SMILE',
  'Logia',
  'None',
  'Unknown',
];

const PRESET_RACES = [
  'Human',
  'Fish-Man',
  'Merfolk',
  'Mink',
  'Giant',
  'Ancient Giant',
  'Lunarian',
  'Buccaneer',
  'Oni',
  'Cyborg',
  'Sky Island',
  'Three-Eye Tribe',
  'Longleg Tribe',
  'Longarm Tribe',
  'Snakeneck Tribe',
  'Tontatta (Dwarf)',
  'Kuja',
  'Animal',
  'Pacifista / Seraphim',
  'Unknown',
  'Other',
];

const PRESET_GENDERS = ['Male', 'Female', 'Unknown', 'Other'];

const PRESET_STATUSES = [
  'Alive',
  'Dead',
  'Unknown',
  'Imprisoned',
  'Frozen / Incapacitated',
  'Deceased (Flashback)',
];

const SUGGESTED_ADVANCED_HAKI = [
  'Observation',
  'Armament',
  'Conqueror',
  "Advanced Conqueror's (ACoC)",
  'Advanced Armament (Ryou)',
  'Future Sight Observation',
  'Emission',
  'Internal Destruction',
  'Voice of All Things',
  'Color of Arms Hardening',
];

const SUGGESTED_AFFILIATIONS = [
  'Straw Hat Pirates',
  'Marines',
  'Revolutionary Army',
  'Cross Guild',
  'Red Hair Pirates',
  'Blackbeard Pirates',
  'Whitebeard Pirates',
  'Beasts Pirates',
  'Big Mom Pirates',
  'Heart Pirates',
  'Kid Pirates',
  'Roger Pirates',
  'Seven Warlords of the Sea',
  'CP0',
  'CP9',
  'Baroque Works',
  'Sun Pirates',
  'Kozuki Clan',
  'Kuja Pirates',
  'Donquixote Pirates',
];

const SUGGESTED_OCCUPATIONS = [
  'Captain',
  'Swordsman',
  'Combatant',
  'Navigator',
  'Sniper',
  'Cook',
  'Doctor',
  'Archaeologist',
  'Shipwright',
  'Musician',
  'Helmsman',
  'Fleet Admiral',
  'Admiral',
  'Vice Admiral',
  'Rear Admiral',
  'Captain (Marine)',
  'Marine',
  'Shogun',
  'Samurai',
  'Ninja',
  'Scientist',
  'King',
  'Queen',
  'Princess',
  'Emperor',
  'Assassin',
  'Thief',
  'Bounty Hunter',
];

const SUGGESTED_ORIGINS = [
  'East Blue',
  'West Blue',
  'North Blue',
  'South Blue',
  'Grand Line',
  'Paradise',
  'New World',
  'Red Line',
  'Mary Geoise',
  'Fish-Man Island',
  'Sky Island / Skypiea',
  'Wano Country',
  'Elbaf',
  'Zou',
  'Egghead',
  'God Valley',
  'Ohara',
  'Germa Kingdom',
  'Sorbet Kingdom',
  'Amazon Lily',
  'Unknown',
];

const SUGGESTED_ARCS = [
  'Romance Dawn',
  'Orange Town',
  'Syrup Village',
  'Baratie',
  'Arlong Park',
  'Loguetown',
  'Reverse Mountain',
  'Whiskey Peak',
  'Little Garden',
  'Drum Island',
  'Alabasta',
  'Jaya',
  'Skypiea',
  'Long Ring Long Land',
  'Water 7',
  'Enies Lobby',
  'Post-Enies Lobby',
  'Thriller Bark',
  'Sabaody Archipelago',
  'Amazon Lily',
  'Impel Down',
  'Marineford',
  'Post-War',
  'Return to Sabaody',
  'Fish-Man Island',
  'Punk Hazard',
  'Dressrosa',
  'Zou',
  'Whole Cake Island',
  'Levely',
  'Wano Country',
  'Egghead',
  'Elbaf',
];

function NewCharacterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams?.get('from');

  const handleGoBack = () => {
    if (fromParam) {
      router.push(fromParam);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/admin/characters');
    }
  };

  const [character, setCharacter] = useState<Partial<Character>>({
    name: '',
    japanese_name: '',
    alias: '',
    gender: 'Male',
    race: 'Human',
    status: 'Alive',
    bounty: null,
    age: null,
    height: null,
    origin: 'East Blue',
    first_appearance: '',
    first_arc: 'Romance Dawn',
    birthday: '',
    blood_type: '',
    description: '',
    devil_fruit_name: '',
    devil_fruit_type: 'None',
    devil_fruit_model: '',
    image_url: '',
    verification_status: 'verified',
  });

  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [occupations, setOccupations] = useState<string[]>([]);
  const [hakiList, setHakiList] = useState<{ haki_type: string; custom_haki?: string }[]>([]);
  const [aliases, setAliases] = useState<{ alias: string; alias_type: string }[]>([]);

  // Input states
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newHaki, setNewHaki] = useState('');

  // Custom field modes toggles
  const [customFruitMode, setCustomFruitMode] = useState(false);
  const [customRaceMode, setCustomRaceMode] = useState(false);
  const [customGenderMode, setCustomGenderMode] = useState(false);
  const [customStatusMode, setCustomStatusMode] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = () => {
    if (!character.name?.trim()) {
      setErrorMsg('Character name is required');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const aliasString = aliases.map((a) => a.alias).filter(Boolean).join(', ');

    const payload = {
      ...character,
      alias: aliasString || character.alias || null,
      romanized_name: aliasString || character.alias || null,
      verification_status: 'verified',
      is_active: true,
      is_canon: true,
    };

    fetch('/api/admin/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character: payload,
        affiliations,
        occupations,
        haki: hakiList,
        aliases,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.id) {
          setSaveSuccess(true);
          setCreatedId(data.id);
          setShowSuccessModal(true);
        } else {
          setErrorMsg(data.error || 'Failed to create character');
        }
      })
      .catch(() => setErrorMsg('Network error creating character'))
      .finally(() => setIsSaving(false));
  };

  // Helper functions for Haki
  const toggleStandardHaki = (type: string) => {
    const exists = hakiList.some((h) => h.haki_type === type);
    if (exists) {
      setHakiList(hakiList.filter((h) => h.haki_type !== type));
    } else {
      setHakiList([...hakiList, { haki_type: type }]);
    }
  };

  const addCustomHaki = (hakiName: string) => {
    const trimmed = hakiName.trim();
    if (!trimmed) return;
    if (!hakiList.some((h) => (h.custom_haki || h.haki_type).toLowerCase() === trimmed.toLowerCase())) {
      setHakiList([...hakiList, { haki_type: trimmed, custom_haki: trimmed }]);
    }
    setNewHaki('');
  };

  const removeHaki = (index: number) => {
    setHakiList(hakiList.filter((_, idx) => idx !== index));
  };

  // Helper functions for tags
  const addAlias = (aliasText: string) => {
    const trimmed = aliasText.trim();
    if (!trimmed) return;
    if (!aliases.some((a) => a.alias.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...aliases, { alias: trimmed, alias_type: 'alias' }];
      setAliases(updated);
      setCharacter({
        ...character,
        alias: updated.map((a) => a.alias).join(', '),
      });
    }
    setNewAlias('');
  };

  const removeAlias = (index: number) => {
    const updated = aliases.filter((_, idx) => idx !== index);
    setAliases(updated);
    setCharacter({
      ...character,
      alias: updated.map((a) => a.alias).join(', '),
    });
  };

  const addAffiliation = (aff: string) => {
    const trimmed = aff.trim();
    if (!trimmed) return;
    if (!affiliations.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setAffiliations([...affiliations, trimmed]);
    }
    setNewAffiliation('');
  };

  const removeAffiliation = (index: number) => {
    setAffiliations(affiliations.filter((_, idx) => idx !== index));
  };

  const addOccupation = (occ: string) => {
    const trimmed = occ.trim();
    if (!trimmed) return;
    if (!occupations.some((o) => o.toLowerCase() === trimmed.toLowerCase())) {
      setOccupations([...occupations, trimmed]);
    }
    setNewOccupation('');
  };

  const removeOccupation = (index: number) => {
    setOccupations(occupations.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/95 backdrop-blur-md p-4 border border-slate-800 rounded-xl sticky top-[116px] z-30 shadow-2xl">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
              <span>{character.name || 'New Canonical Character'}</span>
            </h1>
            <p className="text-xs text-slate-400">Add a new One Piece character with custom attributes</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleSave}
            disabled={isSaving || !character.name?.trim()}
            className="px-5 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Create & Verify Character</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-950/80 border border-green-500/50 rounded-xl text-green-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Character created & verified successfully!</span>
        </div>
      )}

      {/* Creation & Verification Success Small Modal Popup */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/70 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center space-y-4 animate-card-flip">
            {/* Top Icon & Close */}
            <div className="relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (createdId) {
                    const redirectUrl = fromParam
                      ? `/admin/characters/${createdId}?from=${encodeURIComponent(fromParam)}`
                      : `/admin/characters/${createdId}`;
                    router.push(redirectUrl);
                  }
                }}
                className="absolute top-0 right-0 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-tight">
                Verified & Saved!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <strong className="text-amber-300 font-bold">{character.name}</strong> details have been saved and added to canonical characters.
              </p>
            </div>

            {/* Mini Character Badge */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3 text-left">
              <CharacterAvatar
                src={character.image_url}
                name={character.name || 'New'}
                size="md"
                className="border border-amber-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-slate-100 text-xs truncate">{character.name}</div>
                {character.alias && (
                  <div className="text-[10px] text-amber-400 font-semibold truncate">
                    &quot;{character.alias}&quot;
                  </div>
                )}
                <div className="text-[10px] text-slate-400 truncate">
                  {character.devil_fruit_type || 'None'} • {character.origin || 'East Blue'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (createdId) {
                    const redirectUrl = fromParam
                      ? `/admin/characters/${createdId}?from=${encodeURIComponent(fromParam)}`
                      : `/admin/characters/${createdId}`;
                    router.push(redirectUrl);
                  }
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase transition cursor-pointer"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 py-2 gold-button rounded-lg text-xs font-black uppercase shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Portrait */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Identity & Portrait</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Canonical Name *</label>
                <input
                  type="text"
                  value={character.name || ''}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  placeholder="e.g. Yamato, Kozuki Momonosuke"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Japanese Name</label>
                <input
                  type="text"
                  value={character.japanese_name || ''}
                  onChange={(e) => setCharacter({ ...character, japanese_name: e.target.value })}
                  placeholder="e.g. ヤマト"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Alias / Epithets String (Comma-Separated)</label>
                <input
                  type="text"
                  value={character.alias || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter({ ...character, alias: val });
                    const split = val
                      .split(/,\s*/)
                      .filter(Boolean)
                      .map((a) => ({ alias: a.trim(), alias_type: 'alias' }));
                    setAliases(split);
                  }}
                  placeholder="e.g. Oni Princess, Son of Kaido, Oden"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-semibold focus:border-amber-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Image URL (Portrait / Avatar)</label>
                <div className="flex items-center space-x-3">
                  <CharacterAvatar
                    src={character.image_url}
                    name={character.name || 'New'}
                    size="lg"
                    className="border border-amber-600/50 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={character.image_url || ''}
                      onChange={(e) => setCharacter({ ...character, image_url: e.target.value })}
                      placeholder="https://cdn.myanimelist.net/images/characters/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 text-xs"
                    />
                    <p className="text-[11px] text-slate-400">
                      💡 Direct HTTPS links from MyAnimeList, Supabase Storage, or Imgur work best.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Aliases Tag Editor */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Aliases & Epithets Manager ({aliases.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {aliases.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No individual aliases added yet.</span>
              ) : (
                aliases.map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold"
                  >
                    <span>&quot;{a.alias}&quot;</span>
                    <button
                      type="button"
                      onClick={() => removeAlias(idx)}
                      className="text-amber-400/60 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAlias(newAlias);
                  }
                }}
                placeholder="Type a new alias and press Enter..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => addAlias(newAlias)}
                disabled={!newAlias.trim()}
                className="px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Devil Fruit & Powers (with Custom Type Option) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Devil Fruit Powers</span>
              </h3>
              <button
                type="button"
                onClick={() => setCustomFruitMode(!customFruitMode)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{customFruitMode ? 'Switch to Standard Dropdown' : '+ Add Custom Fruit Type'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Name</label>
                <input
                  type="text"
                  value={character.devil_fruit_name || ''}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_name: e.target.value })}
                  placeholder="e.g. Inu Inu no Mi, Model: Okuchi no Makami, SMILE Fruit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Devil Fruit Type {customFruitMode && <span className="text-amber-400 font-bold">(Custom Mode)</span>}
                </label>

                {customFruitMode ? (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={character.devil_fruit_type || ''}
                        onChange={(e) => setCharacter({ ...character, devil_fruit_type: e.target.value })}
                        placeholder="e.g. Artificial Zoan, SMILE, Special Zoan..."
                        className="flex-1 bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomFruitMode(false)}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-[10px] font-bold"
                      >
                        Presets
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {['Artificial Zoan', 'SMILE', 'Special Paramecia', 'Mythical Zoan', 'Ancient Zoan', 'Zoan', 'Paramecia', 'Logia'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCharacter({ ...character, devil_fruit_type: s })}
                          className="text-[10px] px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-amber-300/80 rounded border border-slate-800"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <select
                    value={character.devil_fruit_type || 'None'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomFruitMode(true);
                      } else {
                        setCharacter({ ...character, devil_fruit_type: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold focus:border-amber-500"
                  >
                    {PRESET_DEVIL_FRUIT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="__custom__">+ Add Custom Type...</option>
                  </select>
                )}
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Model (Optional)</label>
                <input
                  type="text"
                  value={character.devil_fruit_model || ''}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_model: e.target.value })}
                  placeholder="e.g. Okuchi no Makami, Seiryu, Nika..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Haki & Abilities Manager (Standard + Custom Haki Types) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Haki Mastery & Specialized Abilities ({hakiList.length})</span>
            </h3>

            {/* Standard 3 Haki Quick Toggles */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-semibold mb-2">Standard Haki Types:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Observation', 'Armament', 'Conqueror'].map((ht) => {
                  const isChecked = hakiList.some((h) => h.haki_type === ht);
                  return (
                    <button
                      key={ht}
                      type="button"
                      onClick={() => toggleStandardHaki(ht)}
                      className={`p-3 rounded-lg border text-left flex items-center justify-between font-bold transition cursor-pointer ${
                        isChecked
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{ht} Haki</span>
                      <input type="checkbox" checked={isChecked} readOnly className="accent-amber-500 pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom & Advanced Haki Tag List */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <label className="block text-slate-400 font-semibold mb-1">
                Active Haki & Advanced Techniques ({hakiList.length}):
              </label>

              <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                {hakiList.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No Haki types logged.</span>
                ) : (
                  hakiList.map((h, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold"
                    >
                      <span>{h.custom_haki || h.haki_type}</span>
                      <button
                        type="button"
                        onClick={() => removeHaki(idx)}
                        className="text-amber-400/60 hover:text-red-400 ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Custom Haki Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newHaki}
                  onChange={(e) => setNewHaki(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomHaki(newHaki);
                    }
                  }}
                  placeholder="Type any custom Haki (e.g. 'Advanced Conqueror's (ACoC)', 'Future Sight')..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => addCustomHaki(newHaki)}
                  disabled={!newHaki.trim()}
                  className="px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Haki</span>
                </button>
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_ADVANCED_HAKI.map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => addCustomHaki(sugg)}
                      className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition cursor-pointer"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Attributes & Status */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Physical Attributes & Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Race */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Race</label>
                  <button
                    type="button"
                    onClick={() => setCustomRaceMode(!customRaceMode)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    {customRaceMode ? 'Presets' : '+ Custom'}
                  </button>
                </div>

                {customRaceMode ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={character.race || ''}
                      onChange={(e) => setCharacter({ ...character, race: e.target.value })}
                      placeholder="e.g. Buccaneer, Lunarian, Seraphim..."
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-400"
                    />
                    <div className="flex flex-wrap gap-1">
                      {['Buccaneer', 'Lunarian', 'Ancient Giant', 'Oni', 'Pacifista / Seraphim', 'Three-Eye Tribe', 'Tontatta', 'Cyborg'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCharacter({ ...character, race: r })}
                          className="text-[9px] px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-amber-300/80 rounded border border-slate-800"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <select
                    value={character.race || 'Human'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomRaceMode(true);
                      } else {
                        setCharacter({ ...character, race: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                  >
                    {PRESET_RACES.map((race) => (
                      <option key={race} value={race}>{race}</option>
                    ))}
                    <option value="__custom__">+ Add Custom Race...</option>
                  </select>
                )}
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Gender</label>
                  <button
                    type="button"
                    onClick={() => setCustomGenderMode(!customGenderMode)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    {customGenderMode ? 'Presets' : '+ Custom'}
                  </button>
                </div>

                {customGenderMode ? (
                  <input
                    type="text"
                    value={character.gender || ''}
                    onChange={(e) => setCharacter({ ...character, gender: e.target.value })}
                    placeholder="e.g. Okama, Non-Binary..."
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-400"
                  />
                ) : (
                  <select
                    value={character.gender || 'Unknown'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomGenderMode(true);
                      } else {
                        setCharacter({ ...character, gender: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                  >
                    {PRESET_GENDERS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                    <option value="__custom__">+ Add Custom Gender...</option>
                  </select>
                )}
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Status</label>
                  <button
                    type="button"
                    onClick={() => setCustomStatusMode(!customStatusMode)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    {customStatusMode ? 'Presets' : '+ Custom'}
                  </button>
                </div>

                {customStatusMode ? (
                  <input
                    type="text"
                    value={character.status || ''}
                    onChange={(e) => setCharacter({ ...character, status: e.target.value })}
                    placeholder="e.g. Imprisoned, Frozen..."
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-400"
                  />
                ) : (
                  <select
                    value={character.status || 'Alive'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomStatusMode(true);
                      } else {
                        setCharacter({ ...character, status: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-semibold"
                  >
                    {PRESET_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="__custom__">+ Add Custom Status...</option>
                  </select>
                )}
              </div>

              {/* Bounty */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Bounty (Berries)</label>
                  <div className="flex items-center space-x-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, bounty: 0 })}
                      className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                        character.bounty === 0
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => setCharacter({ ...character, bounty: null })}
                      className={`px-1.5 py-0.5 rounded border transition cursor-pointer ${
                        character.bounty === null || character.bounty === undefined
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      Unknown
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  placeholder="e.g. 3000000000"
                  value={character.bounty ?? ''}
                  onChange={(e) =>
                    setCharacter({
                      ...character,
                      bounty: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-bold focus:border-amber-500"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={character.age ?? ''}
                  onChange={(e) => setCharacter({ ...character, age: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 28"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={character.height ?? ''}
                  onChange={(e) => setCharacter({ ...character, height: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 263"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Affiliations Manager */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Affiliations & Crews ({affiliations.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {affiliations.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No affiliations specified.</span>
              ) : (
                affiliations.map((aff, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sky-950/60 border border-sky-500/40 text-sky-300 rounded-lg text-xs font-bold"
                  >
                    <span>{aff}</span>
                    <button
                      type="button"
                      onClick={() => removeAffiliation(idx)}
                      className="text-sky-400/60 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAffiliation}
                onChange={(e) => setNewAffiliation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAffiliation(newAffiliation);
                  }
                }}
                placeholder="Type any crew, organization, or group name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => addAffiliation(newAffiliation)}
                disabled={!newAffiliation.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_AFFILIATIONS.slice(0, 10).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => addAffiliation(sugg)}
                    className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occupations Manager */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Occupations & Roles ({occupations.length})</span>
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              {occupations.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No occupations specified.</span>
              ) : (
                occupations.map((occ, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold"
                  >
                    <span>{occ}</span>
                    <button
                      type="button"
                      onClick={() => removeOccupation(idx)}
                      className="text-emerald-400/60 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newOccupation}
                onChange={(e) => setNewOccupation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOccupation(newOccupation);
                  }
                }}
                placeholder="Type any career, rank, or position..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => addOccupation(newOccupation)}
                disabled={!newOccupation.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_OCCUPATIONS.slice(0, 10).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => addOccupation(sugg)}
                    className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gameplay Story & Debut Lore */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Origin & Story Debut Facts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Origin *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={character.origin || ''}
                    onChange={(e) => setCharacter({ ...character, origin: e.target.value })}
                    placeholder="e.g. East Blue, Wano Country..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setCharacter({ ...character, origin: e.target.value });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 text-slate-400 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Presets</option>
                    {SUGGESTED_ORIGINS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">First Appearance (Chapter / Ep)</label>
                <input
                  type="text"
                  value={character.first_appearance || ''}
                  onChange={(e) => setCharacter({ ...character, first_appearance: e.target.value })}
                  placeholder="e.g. Chapter 983"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">First Storyline Arc</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={character.first_arc || ''}
                    onChange={(e) => setCharacter({ ...character, first_arc: e.target.value })}
                    placeholder="e.g. Wano Country"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setCharacter({ ...character, first_arc: e.target.value });
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 text-slate-400 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Arc Presets</option>
                    {SUGGESTED_ARCS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Birthday</label>
                  <input
                    type="text"
                    value={character.birthday || ''}
                    onChange={(e) => setCharacter({ ...character, birthday: e.target.value })}
                    placeholder="e.g. November 3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={character.blood_type || ''}
                    onChange={(e) => setCharacter({ ...character, blood_type: e.target.value })}
                    placeholder="e.g. X, F, S, XF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={character.description || ''}
                  onChange={(e) => setCharacter({ ...character, description: e.target.value })}
                  placeholder="Canonical background notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-lg sticky top-[116px]">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Portrait Preview
            </h3>
            <div className="w-48 aspect-[3/4] max-h-72 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-slate-950 mb-3 shadow-2xl relative flex items-center justify-center">
              {character.image_url && (
                <img
                  src={character.image_url}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                />
              )}
              <img
                src={character.image_url || 'https://via.placeholder.com/200x260?text=One+Piece'}
                alt={character.name || 'New Character'}
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain p-1.5 drop-shadow-md"
              />
            </div>
            <div className="font-extrabold text-slate-100 text-sm">{character.name || 'Character Name'}</div>
            {character.japanese_name && (
              <div className="text-xs text-amber-400 font-semibold">{character.japanese_name}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminNewCharacterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-slate-400 text-xs font-semibold">Loading character creator...</p>
        </div>
      }
    >
      <NewCharacterContent />
    </Suspense>
  );
}
