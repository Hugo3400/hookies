import { useEffect, useMemo, useState } from 'react';
import {
  FaComments,
  FaFolderPlus,
  FaHashtag,
  FaImage,
  FaPlus,
  FaSave,
  FaSearch,
} from 'react-icons/fa';
import type { AdminNotebookData } from './types';

const EMPTY_NOTEBOOK: AdminNotebookData = {
  categories: [{ id: 'cat-general', name: 'General', notes: [] }],
};

type Props = {
  data: AdminNotebookData | null;
  loading: boolean;
  onLoad: () => void;
  onSave: (payload: AdminNotebookData) => Promise<unknown>;
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function NotebookTab({ data, loading, onLoad, onSave }: Props) {
  const [draft, setDraft] = useState<AdminNotebookData>(EMPTY_NOTEBOOK);
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-general');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  useEffect(() => {
    if (data?.categories?.length) {
      setDraft(data);
      setSelectedCategoryId((prev) => {
        const exists = data.categories.some((category) => category.id === prev);
        return exists ? prev : data.categories[0].id;
      });
      return;
    }

    setDraft(EMPTY_NOTEBOOK);
    setSelectedCategoryId('cat-general');
    setSelectedNoteId(null);
  }, [data]);

  const selectedCategory = useMemo(
    () => draft.categories.find((category) => category.id === selectedCategoryId) || draft.categories[0],
    [draft.categories, selectedCategoryId]
  );

  const selectedNote = useMemo(
    () => selectedCategory?.notes.find((note) => note.id === selectedNoteId) || null,
    [selectedCategory, selectedNoteId]
  );

  const filteredNotes = useMemo(() => {
    if (!selectedCategory) return [];
    const needle = search.trim().toLowerCase();
    const tagNeedle = tagFilter.trim().toLowerCase();

    return selectedCategory.notes.filter((note) => {
      const haystack = `${note.title} ${note.content}`.toLowerCase();
      const matchesText = !needle || haystack.includes(needle);
      const matchesTag = !tagNeedle || note.tags.some((tag) => tag.toLowerCase().includes(tagNeedle));
      return matchesText && matchesTag;
    });
  }, [search, selectedCategory, tagFilter]);

  const setCategoryName = (categoryId: string, name: string) => {
    setDraft((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category
      ),
    }));
  };

  const addCategory = () => {
    const id = newId('cat');
    setDraft((prev) => ({
      categories: [...prev.categories, { id, name: 'Nouvelle categorie', notes: [] }],
    }));
    setSelectedCategoryId(id);
    setSelectedNoteId(null);
  };

  const removeCategory = (categoryId: string) => {
    if (draft.categories.length <= 1) return;
    if (!confirm('Supprimer cette categorie et toutes ses notes ?')) return;

    const nextCategories = draft.categories.filter((category) => category.id !== categoryId);
    setDraft({ categories: nextCategories });
    setSelectedCategoryId(nextCategories[0]?.id || 'cat-general');
    setSelectedNoteId(null);
  };

  const addNote = () => {
    if (!selectedCategory) return;

    const noteId = newId('note');
    const nextNote = {
      id: noteId,
      title: 'Nouveau sujet',
      content: '',
      tags: ['idee'],
      imageUrls: [] as string[],
      updatedAt: new Date().toISOString(),
    };

    setDraft((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, notes: [nextNote, ...category.notes] }
          : category
      ),
    }));
    setSelectedNoteId(noteId);
  };

  const removeNote = (noteId: string) => {
    if (!selectedCategory) return;
    if (!confirm('Supprimer ce sujet ?')) return;

    setDraft((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, notes: category.notes.filter((note) => note.id !== noteId) }
          : category
      ),
    }));

    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const updateSelectedNote = (patch: Partial<{ title: string; content: string; tags: string[]; imageUrls: string[] }>) => {
    if (!selectedCategory || !selectedNote) return;

    setDraft((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              notes: category.notes.map((note) =>
                note.id === selectedNote.id
                  ? { ...note, ...patch, updatedAt: new Date().toISOString() }
                  : note
              ),
            }
          : category
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-amber-200">Forum interne</h2>
          <p className="text-xs text-slate-400">Comme un forum Discord: salons, sujets, tags et contenu media.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-50"
        >
          <FaSave className="mr-1 inline" /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {loading && <p className="mb-4 text-sm text-slate-400">Chargement...</p>}

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-2xl border border-white/10 bg-[#1e1f22] p-3 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Salons</p>
            <button onClick={addCategory} className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20" title="Ajouter dossier">
              <FaFolderPlus />
            </button>
          </div>

          <div className="space-y-2">
            {draft.categories.map((category) => (
              <div key={category.id} className={`rounded-xl border p-2 ${selectedCategoryId === category.id ? 'border-amber-400/60 bg-amber-500/10' : 'border-white/10 bg-black/20'}`}>
                <button
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setSelectedNoteId(null);
                  }}
                  className="mb-2 w-full text-left text-sm font-semibold text-slate-100"
                >
                  <FaComments className="mr-1 inline text-[11px] text-slate-400" /> {category.name}
                </button>
                <input
                  value={category.name}
                  onChange={(event) => setCategoryName(category.id, event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-200"
                />
                <div className="mt-2 text-right">
                  <button
                    onClick={() => removeCategory(category.id)}
                    disabled={draft.categories.length <= 1}
                    className="text-xs text-red-300 underline disabled:opacity-40"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#2b2d31] p-3 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Sujets</p>
            <button onClick={addNote} className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/20" title="Nouveau sujet">
              <FaPlus />
            </button>
          </div>

          <div className="mb-3 space-y-2">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-2 top-2.5 text-xs text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un sujet"
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-7 pr-3 text-xs text-slate-200"
              />
            </div>
            <div className="relative">
              <FaHashtag className="pointer-events-none absolute left-2 top-2.5 text-xs text-slate-500" />
              <input
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                placeholder="Filtrer par tag"
                className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-7 pr-3 text-xs text-slate-200"
              />
            </div>
          </div>

          {!selectedCategory ? (
            <p className="text-xs text-slate-400">Aucune categorie selectionnee.</p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-xs text-slate-400">Aucun sujet trouve pour ce filtre.</p>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div key={note.id} className={`rounded-xl border p-2 ${selectedNoteId === note.id ? 'border-amber-400/60 bg-amber-500/10' : 'border-white/10 bg-black/20'}`}>
                  <button
                    onClick={() => setSelectedNoteId(note.id)}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-semibold text-slate-100">{note.title || 'Sans titre'}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{note.content || 'Aucun contenu'}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{new Date(note.updatedAt).toLocaleString('fr-FR')}</p>
                    {note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={`${note.id}-${tag}`} className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                  <div className="mt-2 text-right">
                    <button onClick={() => removeNote(note.id)} className="text-xs text-red-300 underline">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#313338] p-4 lg:col-span-5">
          {!selectedNote ? (
            <p className="text-sm text-slate-400">Selectionne un sujet ou cree un nouveau thread.</p>
          ) : (
            <div className="space-y-3">
              <input
                value={selectedNote.title}
                onChange={(event) => updateSelectedNote({ title: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-100"
                placeholder="Titre du sujet"
              />

              <input
                value={selectedNote.tags.join(', ')}
                onChange={(event) => {
                  const tags = event.target.value
                    .split(',')
                    .map((item) => item.trim().toLowerCase().replace(/\s+/g, '-'))
                    .filter(Boolean)
                    .slice(0, 8);
                  updateSelectedNote({ tags });
                }}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200"
                placeholder="tags ex: urgent, livraison, idee"
              />

              <textarea
                value={selectedNote.content}
                onChange={(event) => updateSelectedNote({ content: event.target.value })}
                rows={12}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100"
                placeholder="Contenu du sujet..."
              />

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-200/80">
                  <FaImage className="mr-1 inline" /> Images (une URL par ligne)
                </p>
                <textarea
                  value={selectedNote.imageUrls.join('\n')}
                  onChange={(event) => {
                    const imageUrls = event.target.value
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean);
                    updateSelectedNote({ imageUrls });
                  }}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100"
                  placeholder="https://..."
                />
              </div>

              {selectedNote.imageUrls.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedNote.imageUrls.map((url, index) => (
                    <img key={`${url}-${index}`} src={url} alt="Note" className="h-32 w-full rounded-lg border border-white/10 object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
