import { useCallback, useEffect, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import festivalsService from '../services/festivals'

const emptyFestival = { festival_name: '', festival_date: '', season: '' }

const Festivals = () => {
  const [festivals, setFestivals] = useState([]), [meta, setMeta] = useState(null), [page, setPage] = useState(1), [search, setSearch] = useState(''), [loading, setLoading] = useState(true), [error, setError] = useState(''), [form, setForm] = useState(emptyFestival), [editing, setEditing] = useState(null), [open, setOpen] = useState(false)
  const load = useCallback(async () => { setLoading(true); setError(''); try { const response = await festivalsService.list({ page, per_page: 20, search: search || undefined }); setFestivals(response.data.festivals); setMeta(response.meta) } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load festivals.') } finally { setLoading(false) } }, [page, search])
  useEffect(() => { load() }, [load])
  const save = async (event) => { event.preventDefault(); try { if (editing) await festivalsService.update(editing.festival_id, form); else await festivalsService.create(form); setOpen(false); setEditing(null); setForm(emptyFestival); load() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save festival.') } }
  const remove = async (festival) => { if (!window.confirm(`Delete ${festival.festival_name}?`)) return; try { await festivalsService.remove(festival.festival_id); load() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete festival.') } }
  const rows = festivals.map((festival) => [festival.festival_id, festival.festival_name, festival.festival_date, festival.season, <div key={festival.festival_id} className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => { setEditing(festival); setForm(festival); setOpen(true) }}><Edit2 className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => remove(festival)}><Trash2 className="h-3.5 w-3.5 text-[#EF4444]" /></Button></div>])
  return <div className="space-y-8 animate-fade-in"><Header title="Festivals" description="Maintain the global festival calendar." badge="Live API" actions={<Button variant="primary" size="sm" onClick={() => { setEditing(null); setForm(emptyFestival); setOpen(true) }}><Plus className="h-3.5 w-3.5" /> Add Festival</Button>} /><SearchBar placeholder="Search festivals..." value={search} onChange={(event) => { setPage(1); setSearch(event.target.value) }} />{loading ? <LoadingSpinner label="Loading festivals..." /> : error ? <ErrorState description={error} onRetry={load} /> : festivals.length === 0 ? <EmptyState title="No festivals found" /> : <Card title="Festival calendar"><Table columns={['ID', 'Festival', 'Date', 'Season', 'Actions']} rows={rows} /></Card>}{meta ? <div className="flex justify-between text-xs text-[#94A3B8]"><span>Page {meta.page} of {meta.total_pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div></div> : null}<Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Update Festival' : 'Add Festival'}><form className="space-y-4" onSubmit={save}><Input label="Festival name" value={form.festival_name} onChange={(event) => setForm({ ...form, festival_name: event.target.value })} required /><Input label="Festival date" type="date" value={form.festival_date} onChange={(event) => setForm({ ...form, festival_date: event.target.value })} required /><Input label="Season" value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" variant="primary">Save Festival</Button></div></form></Modal></div>
}

export default Festivals
