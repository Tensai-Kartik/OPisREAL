'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ShieldCheck, Eye, Plus, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Character, CharacterFieldEvidence, HakiType } from '@/types/character';

export default function AdminCharacterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [evidence, setEvidence] = useState<CharacterFieldEvidence[]>([]);
  const [affiliations, setAffiliations] = useState<string[]>([]);
  const [occupations, setOccupations] = useState<string[]>([]);
  const [hakiList, setHakiList] = useState<{ haki_type: HakiType; custom_haki?: string }[]>([]);
  const [aliases, setAliases] = useState<{ alias: string; alias_type: string }[]>([]);

  const [newAffiliation, setNewAffiliation] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [newAlias, setNewAlias] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/admin/characters/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setErrorMsg(data.error);
        else {
          setCharacter(data.character);
          setEvidence(data.evidence || []);
          setAffiliations(data.affiliations || []);
          setOccupations(data.occupations || []);
          setHakiList(data.haki || []);
          setAliases(data.aliases || []);
        }
      })
      .catch(() => setErrorMsg('Failed to fetch character details.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!character) return;
    if (!confirm(`Are you sure you want to permanently delete "${character.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/characters/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/characters');
      } else {
        alert(data.error || 'Failed to delete character');
      }
    } catch {
      alert('Network error deleting character');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = () => {
    if (!character) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const verifiedPayload = {
      ...character,
      verification_status: 'verified' as const,
      is_active: true,
      is_canon: true,
    };
    setCharacter(verifiedPayload);

    fetch(`/api/admin/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character: verifiedPayload,
        affiliations,
        occupations,
        haki: hakiList,
        aliases,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } else {
          setErrorMsg(data.error || 'Failed to save');
        }
      })
      .catch(() => setErrorMsg('Save error'))
      .finally(() => setIsSaving(false));
  };

  const toggleHaki = (type: HakiType) => {
    const exists = hakiList.some((h) => h.haki_type === type);
    if (exists) {
      setHakiList(hakiList.filter((h) => h.haki_type !== type));
    } else {
      setHakiList([...hakiList, { haki_type: type }]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-slate-400 text-xs">Loading character editor...</p>
      </div>
    );
  }

  if (errorMsg || !character) {
    return (
      <div className="p-6 bg-slate-900 border border-red-500/40 rounded-xl text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-slate-300 text-sm">{errorMsg || 'Character not found'}</p>
        <Link href="/admin/characters" className="mt-4 inline-block px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-xl sticky top-20 z-30 shadow-xl">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/characters"
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
              <span>{character.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                {character.verification_status}
              </span>
            </h1>
            <p className="text-xs text-slate-400">Canonical Character Fact Verification & Evidence Inspector</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="px-3.5 py-2 bg-slate-950 border border-amber-600/40 text-amber-400 hover:bg-slate-800 rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{showEvidence ? 'Hide Sources' : 'Inspect Evidence'}</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>Delete</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="px-5 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Verification</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-950/80 border border-green-500/50 rounded-xl text-green-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Character canonical record updated and verified successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Images */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Identity & Image Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Canonical Name</label>
                <input
                  type="text"
                  value={character.name || ''}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Japanese Name</label>
                <input
                  type="text"
                  value={character.japanese_name || ''}
                  onChange={(e) => setCharacter({ ...character, japanese_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Romanized Name</label>
                <input
                  type="text"
                  value={character.romanized_name || ''}
                  onChange={(e) => setCharacter({ ...character, romanized_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={character.image_url || ''}
                  onChange={(e) => setCharacter({ ...character, image_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Physical & Attributes */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Physical Attributes & Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gender</label>
                <select
                  value={character.gender || 'Unknown'}
                  onChange={(e) => setCharacter({ ...character, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Race</label>
                <select
                  value={character.race || 'Human'}
                  onChange={(e) => setCharacter({ ...character, race: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Human">Human</option>
                  <option value="Fish-Man">Fish-Man</option>
                  <option value="Merfolk">Merfolk</option>
                  <option value="Mink">Mink</option>
                  <option value="Giant">Giant</option>
                  <option value="Lunarian">Lunarian</option>
                  <option value="Cyborg">Cyborg</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Status</label>
                <select
                  value={character.status || 'Alive'}
                  onChange={(e) => setCharacter({ ...character, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Alive">Alive</option>
                  <option value="Dead">Dead</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
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
                      None (0)
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
                <div className="text-[10px] text-slate-500 mt-1">
                  {character.bounty === 0
                    ? 'Status: None (0 Berries)'
                    : character.bounty === null || character.bounty === undefined
                      ? 'Status: Unknown / Undisclosed'
                      : `Status: ${character.bounty.toLocaleString()} Berries`}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={character.age ?? ''}
                  onChange={(e) => setCharacter({ ...character, age: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={character.height ?? ''}
                  onChange={(e) => setCharacter({ ...character, height: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Devil Fruit & Haki Multi-select */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Powers: Devil Fruit & Haki
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Name</label>
                <input
                  type="text"
                  value={character.devil_fruit_name || ''}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_name: e.target.value })}
                  placeholder="e.g. Hito Hito no Mi, Model: Nika"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Devil Fruit Type</label>
                <select
                  value={character.devil_fruit_type || 'None'}
                  onChange={(e) => setCharacter({ ...character, devil_fruit_type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="Paramecia">Paramecia</option>
                  <option value="Zoan">Zoan</option>
                  <option value="Ancient Zoan">Ancient Zoan</option>
                  <option value="Mythical Zoan">Mythical Zoan</option>
                  <option value="Logia">Logia</option>
                  <option value="None">None (No Fruit)</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Haki Multi-Select Checklist */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <label className="block text-slate-400 font-semibold mb-2">Verified Haki Types (Multi-Select)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Observation', 'Armament', 'Conqueror', 'Other'] as HakiType[]).map((ht) => {
                  const isChecked = hakiList.some((h) => h.haki_type === ht);
                  return (
                    <button
                      key={ht}
                      type="button"
                      onClick={() => toggleHaki(ht)}
                      className={`p-3 rounded-lg border text-left flex items-center justify-between font-bold transition ${
                        isChecked
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{ht}</span>
                      <input type="checkbox" checked={isChecked} readOnly className="accent-amber-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Image Preview & Evidence Inspector */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Selected Image Preview
            </h3>
            <div className="w-36 h-36 mx-auto rounded-xl overflow-hidden border-2 border-amber-600/40 bg-slate-950 mb-3 shadow-lg">
              <img
                src={character.image_url || 'https://via.placeholder.com/150?text=OP'}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Source: <span className="text-slate-200">{character.image_source_name || 'Wiki Dataset'}</span>
            </div>
          </div>

          {/* Evidence Inspector Modal/Box */}
          {showEvidence && (
            <div className="p-5 bg-slate-900 border border-amber-600/50 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Source Evidence Inspector</span>
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
                {evidence.length === 0 ? (
                  <p className="text-slate-500 italic">No external source evidence logged yet.</p>
                ) : (
                  evidence.map((ev) => (
                    <div key={ev.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span className="capitalize">{ev.field_name}</span>
                        <span className="text-amber-400">{ev.source_id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Value: <span className="text-slate-100">{ev.normalized_value}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
