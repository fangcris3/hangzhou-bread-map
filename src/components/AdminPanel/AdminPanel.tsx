import { useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Slider from '@radix-ui/react-slider'
import * as Label from '@radix-ui/react-label'
import type { Store } from '../../data/types'
import { exportJSON, exportCSV } from '../../data/storage'
import { X, Upload, MapPin } from 'lucide-react'

interface Props {
  store: Store
  isNew?: boolean
  onSave: (store: Store) => void
  onDelete?: (id: string) => void
  onClose: () => void
  onPlaceOnMap?: (store: Store) => void
  onClearPin?: (id: string) => void
  allStores: Store[]
  onStoresChange: (stores: Store[]) => void
}

export default function AdminPanel({ store, isNew, onSave, onDelete, onClose, onPlaceOnMap, onClearPin, allStores, onStoresChange }: Props) {
  const [draft, setDraft] = useState<Store>({ ...store })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  function handleImageFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const MAX = 900
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#F5EBD6'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.82)
        fetch('/api/save-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: draft.id, dataUrl: compressed }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.ok) {
              setDraft(d => ({ ...d, photo: data.url }))
            } else {
              setDraft(d => ({ ...d, photo: compressed }))
            }
          })
          .catch(() => setDraft(d => ({ ...d, photo: compressed })))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleImageFile(file)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Store[]
        onStoresChange(data)
        onClose()
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog.Root open onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[10000]" />
        <Dialog.Content className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
          <div className="bg-paper rounded-sm shadow-card-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/15">
              <Dialog.Title className="font-display text-3xl font-bold text-ink leading-none">{isNew ? 'New Entry' : 'Edit Entry'}</Dialog.Title>
              <Dialog.Close className="text-ink opacity-40 hover:opacity-80 transition-opacity">
                <X size={18} />
              </Dialog.Close>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* photo upload */}
              <div>
                <Label.Root className="font-mono text-[10px] tracking-widest uppercase text-sepia block mb-2">
                  Photo
                </Label.Root>
                <div
                  className={`border-2 border-dashed rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragging ? 'border-terracotta bg-paper' : 'border-ink/15 hover:border-sepia'}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {draft.photo ? (
                    <img src={draft.photo} alt="" className="h-full w-full object-cover rounded-sm" />
                  ) : (
                    <>
                      <Upload size={20} className="text-sepia mb-2" />
                      <span className="font-mono text-xs text-sepia">Drop image or click to upload</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f) }} />
              </div>

              {/* name */}
              <Field label="Name">
                <input
                  className="w-full bg-ink/5 border border-ink/10 focus:border-terracotta rounded-sm px-3 py-2 font-serif text-sm text-ink outline-none"
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                />
              </Field>

              {/* address */}
              <Field label="Address">
                <input
                  className="w-full bg-ink/5 border border-ink/10 focus:border-terracotta rounded-sm px-3 py-2 font-serif text-sm text-ink outline-none"
                  value={draft.address}
                  onChange={e => setDraft(d => ({ ...d, address: e.target.value }))}
                />
              </Field>

              {/* neighborhood */}
              <Field label="Neighborhood">
                <input
                  className="w-full bg-ink/5 border border-ink/10 focus:border-terracotta rounded-sm px-3 py-2 font-serif text-sm text-ink outline-none"
                  value={draft.neighborhood}
                  onChange={e => setDraft(d => ({ ...d, neighborhood: e.target.value }))}
                />
              </Field>

              {/* review */}
              <Field label="Review">
                <textarea
                  rows={3}
                  className="w-full bg-ink/5 border border-ink/10 focus:border-terracotta rounded-sm px-3 py-2 font-serif text-sm text-ink outline-none resize-none"
                  value={draft.shortReview}
                  onChange={e => setDraft(d => ({ ...d, shortReview: e.target.value }))}
                />
              </Field>

              {/* ratings */}
              <div className="space-y-4">
                <Label.Root className="font-mono text-[10px] tracking-widest uppercase text-sepia block">
                  Ratings
                </Label.Root>
                {(['bitter', 'sweetness', 'power'] as const).map(key => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink w-20 capitalize shrink-0">
                      {key}
                    </span>
                    <Slider.Root
                      className="relative flex items-center flex-1 h-5"
                      min={1} max={5} step={1}
                      value={[draft.ratings[key]]}
                      onValueChange={([v]) => setDraft(d => ({ ...d, ratings: { ...d.ratings, [key]: v } }))}
                    >
                      <Slider.Track className="relative grow rounded-full h-1.5 bg-ink/10">
                        <Slider.Range className="absolute bg-terracotta rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-4 h-4 bg-terracotta rounded-full shadow focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
                    </Slider.Root>
                    <span className="font-mono text-xs text-ink w-4 text-right">{draft.ratings[key]}</span>
                  </div>
                ))}
              </div>

              {/* map number + chain toggle + region + pin placement */}
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-end gap-4 flex-wrap">
                  <Field label="Map Number">
                    <input
                      type="number" min={1}
                      className="w-20 bg-ink/5 border border-ink/10 focus:border-terracotta rounded-sm px-3 py-2 font-mono text-sm text-ink outline-none"
                      value={draft.mapNumber}
                      onChange={e => setDraft(d => ({ ...d, mapNumber: Number(e.target.value) }))}
                    />
                  </Field>
                  <label className="flex items-center gap-2 pb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-terracotta w-4 h-4"
                      checked={!!draft.isChain}
                      onChange={e => setDraft(d => ({ ...d, isChain: e.target.checked || undefined }))}
                    />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-sepia">Chain</span>
                  </label>
                  <div className="flex items-center gap-2 pb-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-sepia">Region</span>
                    {(['north', 'south', undefined] as const).map(r => (
                      <label key={String(r)} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          className="accent-terracotta"
                          checked={draft.region === r}
                          onChange={() => setDraft(d => ({ ...d, region: r }))}
                        />
                        <span className="font-mono text-[10px] tracking-widest uppercase text-ink capitalize">
                          {r ?? 'none'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {onPlaceOnMap && !isNew && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { onSave(draft); onPlaceOnMap(draft) }}
                      className="font-mono text-[10px] tracking-widest uppercase border border-ink/60 text-ink px-3 py-2 hover:bg-paper flex items-center gap-1.5"
                    >
                      <MapPin size={12} />
                      {draft.mapCoords ? 'Move Pin' : 'Place on Map'}
                    </button>
                    {draft.mapCoords && onClearPin && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Remove this pin from the map?')) {
                            onClearPin(draft.id)
                            setDraft(d => { const { mapCoords: _, ...rest } = d; return rest })
                          }
                        }}
                        className="font-mono text-[10px] tracking-widest uppercase border border-terracotta/60 text-terracotta px-3 py-2 hover:bg-terracotta hover:text-paper transition-colors flex items-center gap-1.5"
                      >
                        <X size={12} />
                        Clear Pin
                      </button>
                    )}
                  </div>
                )}
              </div>
              {onPlaceOnMap && isNew && (
                <p className="font-mono text-[10px] text-sepia">Save first, then you can place the pin on the map.</p>
              )}
            </div>

            {/* footer */}
            <div className="px-6 py-4 border-t border-ink/15 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  className="font-mono text-[10px] tracking-widest uppercase text-sepia hover:text-ink transition-colors"
                  onClick={() => exportCSV(allStores)}
                >
                  Export CSV
                </button>
                <span className="text-paper">·</span>
                <button
                  className="font-mono text-[10px] tracking-widest uppercase text-sepia hover:text-ink transition-colors"
                  onClick={() => exportJSON(allStores)}
                >
                  JSON
                </button>
                <span className="text-paper">·</span>
                <button
                  className="font-mono text-[10px] tracking-widest uppercase text-sepia hover:text-ink transition-colors"
                  onClick={() => importRef.current?.click()}
                >
                  Import
                </button>
                <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              </div>
              <div className="flex gap-3 items-center">
                {!isNew && onDelete && (
                  <button
                    className="font-mono text-[10px] tracking-widest uppercase text-terracotta/70 hover:text-terracotta transition-colors"
                    onClick={() => { if (confirm(`Delete "${store.name}"?`)) onDelete(store.id) }}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="font-mono text-xs text-ink opacity-50 hover:opacity-80 transition-opacity"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="font-mono text-xs tracking-widest uppercase bg-ink text-paper px-4 py-2 rounded-sm hover:bg-ink transition-colors"
                  onClick={() => onSave(draft)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label.Root className="font-mono text-[10px] tracking-widest uppercase text-sepia block mb-2">
        {label}
      </Label.Root>
      {children}
    </div>
  )
}
