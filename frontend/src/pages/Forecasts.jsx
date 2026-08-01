import { useCallback, useEffect, useState } from 'react'
import { Edit2, Plus, Sparkles, Trash2 } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import forecastsService from '../services/forecasts'
import inventoryService from '../services/inventory'
import festivalsService from '../services/festivals'
import recommendationsService from '../services/recommendations'
import { fetchAllPages } from '../services/api/pagination'
import { getFriendlyErrorMessage } from '../services/api/errors'

const emptyForecast = { product_id: '', festival_id: '', forecast_date: '', predicted_demand: '' }

const Forecasts = () => {
  const [forecasts, setForecasts] = useState([])
  const [products, setProducts] = useState([])
  const [festivals, setFestivals] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [productId, setProductId] = useState('')
  const [festivalId, setFestivalId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [form, setForm] = useState(emptyForecast)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingForecastId, setDeletingForecastId] = useState(null)
  const [generatingForecastId, setGeneratingForecastId] = useState(null)
  const [generatedRecommendation, setGeneratedRecommendation] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await forecastsService.list({
        page,
        per_page: 20,
        product_id: productId || undefined,
        festival_id: festivalId || undefined,
      })

      if (response.meta?.total_pages > 0 && page > response.meta.total_pages) {
        setPage(response.meta.total_pages)
        return
      }

      setForecasts(response.data.forecasts || [])
      setMeta(response.meta)
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, 'We could not load forecasts. Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [page, productId, festivalId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    let isMounted = true

    const loadOptions = async () => {
      setOptionsLoading(true)
      setOptionsError('')
      try {
        const [allProducts, allFestivals] = await Promise.all([
          fetchAllPages(inventoryService.list, 'products'),
          fetchAllPages(festivalsService.list, 'festivals'),
        ])

        if (isMounted) {
          setProducts(allProducts)
          setFestivals(allFestivals)
        }
      } catch (requestError) {
        if (isMounted) setOptionsError(getFriendlyErrorMessage(requestError, 'We could not load products and festivals for forecasts. Please try again.'))
      } finally {
        if (isMounted) setOptionsLoading(false)
      }
    }

    loadOptions()
    return () => { isMounted = false }
  }, [])

  const forecastForm = (forecast) => ({
    product_id: String(forecast.product_id),
    festival_id: String(forecast.festival_id),
    forecast_date: forecast.forecast_date,
    predicted_demand: String(forecast.predicted_demand),
  })

  const resetFilters = () => {
    setPage(1)
    setProductId('')
    setFestivalId('')
  }

  const openCreateForm = () => {
    setEditing(null)
    setForm(emptyForecast)
    setOpen(true)
  }

  const save = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        product_id: Number(form.product_id),
        festival_id: Number(form.festival_id),
        predicted_demand: Number(form.predicted_demand),
      }
      if (editing) {
        await forecastsService.update(editing.forecast_id, {
          festival_id: payload.festival_id,
          forecast_date: payload.forecast_date,
          predicted_demand: payload.predicted_demand,
        })
      } else {
        await forecastsService.create(payload)
      }
      setOpen(false)
      setEditing(null)
      setForm(emptyForecast)
      if (!editing && page !== 1) setPage(1)
      else await load()
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, 'We could not save this forecast. Please review the details and try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async (forecast) => {
    if (!window.confirm('Delete this forecast?')) return
    setDeletingForecastId(forecast.forecast_id)
    setError('')

    try {
      await forecastsService.remove(forecast.forecast_id)
      await load()
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, 'We could not delete this forecast. Please try again.'))
    } finally {
      setDeletingForecastId(null)
    }
  }

  const generateAiRecommendation = async (forecast) => {
    setGeneratingForecastId(forecast.forecast_id)
    setError('')

    try {
      const response = await recommendationsService.generate(forecast.forecast_id)
      setGeneratedRecommendation({
        forecast,
        recommendation: response.data.recommendation,
        ai: response.data.ai_recommendation,
      })
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, 'We could not generate a recommendation for this forecast. Please try again.', {
        serviceMessage: 'AI recommendation generation is taking longer than expected. Please try again shortly.',
      }))
    } finally {
      setGeneratingForecastId(null)
    }
  }

  const productName = (id) => products.find((product) => product.product_id === id)?.product_name || `Product #${id}`; const festivalName = (id) => festivals.find((festival) => festival.festival_id === id)?.festival_name || `Festival #${id}`
  const hasActiveFilters = Boolean(productId || festivalId)
  const showPagination = meta && meta.total_pages > 1
  const canCreateForecast = products.length > 0 && festivals.length > 0 && !optionsLoading
  const priorityTone = (priority) => ({ urgent: 'danger', high: 'warning', medium: 'primary', low: 'success' })[priority] || 'neutral'
  const rows = forecasts.map((forecast) => [forecast.forecast_id, productName(forecast.product_id), festivalName(forecast.festival_id), forecast.forecast_date, forecast.predicted_demand, <div key={forecast.forecast_id} className="flex gap-1"><Button variant="ghost" size="sm" title="Generate AI Recommendation" aria-label="Generate AI Recommendation" isLoading={generatingForecastId === forecast.forecast_id} disabled={deletingForecastId === forecast.forecast_id} onClick={() => generateAiRecommendation(forecast)}><Sparkles className="h-3.5 w-3.5 text-[#00D9FF]" /></Button><Button variant="ghost" size="sm" disabled={deletingForecastId === forecast.forecast_id || generatingForecastId === forecast.forecast_id} onClick={() => { setEditing(forecast); setForm(forecastForm(forecast)); setOpen(true) }}><Edit2 className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" isLoading={deletingForecastId === forecast.forecast_id} disabled={generatingForecastId === forecast.forecast_id} onClick={() => remove(forecast)}><Trash2 className="h-3.5 w-3.5 text-[#EF4444]" /></Button></div>])

  return <div className="space-y-8 animate-fade-in"><Header title="Forecasts" description="Review and maintain product forecasts." badge="Live API" actions={<Button variant="primary" size="sm" disabled={!canCreateForecast} onClick={openCreateForm}><Plus className="h-3.5 w-3.5" /> Add Forecast</Button>} /><div className="grid gap-3 xl:grid-cols-[1fr_1fr_auto] xl:items-center"><select value={productId} disabled={optionsLoading} onChange={(event) => { setPage(1); setProductId(event.target.value) }} className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">{optionsLoading ? 'Loading products...' : 'All products'}</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select><select value={festivalId} disabled={optionsLoading} onChange={(event) => { setPage(1); setFestivalId(event.target.value) }} className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">{optionsLoading ? 'Loading festivals...' : 'All festivals'}</option>{festivals.map((festival) => <option key={festival.festival_id} value={festival.festival_id}>{festival.festival_name}</option>)}</select>{hasActiveFilters ? <Button variant="outline" size="sm" onClick={resetFilters}>Clear</Button> : null}</div>{optionsError ? <p className="text-xs text-[#EF4444]">{optionsError}</p> : null}{generatedRecommendation ? <Card title="Generated AI recommendation" subtitle={`Saved as Recommendation #${generatedRecommendation.recommendation.recommendation_id}`}><div className="grid gap-4 text-sm text-[#94A3B8] md:grid-cols-4"><div><p className="text-xs uppercase text-[#64748B]">Product</p><p className="mt-1 text-[#F8FAFC]">{productName(generatedRecommendation.forecast.product_id)}</p></div><div><p className="text-xs uppercase text-[#64748B]">Quantity</p><p className="mt-1 text-[#F8FAFC]">{generatedRecommendation.ai.recommended_quantity}</p></div><div><p className="text-xs uppercase text-[#64748B]">Priority</p><Badge tone={priorityTone(generatedRecommendation.ai.priority)}>{generatedRecommendation.ai.priority}</Badge></div><div><p className="text-xs uppercase text-[#64748B]">Status</p><Badge tone="neutral">{generatedRecommendation.recommendation.status}</Badge></div></div><p className="mt-4 text-sm text-[#F8FAFC]">{generatedRecommendation.ai.reason}</p></Card> : null}{loading ? <LoadingSpinner label="Loading forecasts..." /> : error ? <ErrorState description={error} onRetry={load} /> : forecasts.length === 0 ? <EmptyState title="No forecasts found" description={hasActiveFilters ? 'No forecasts match the selected product or festival.' : canCreateForecast ? 'Create a forecast for a product and festival.' : 'Create at least one product and one festival before adding forecasts.'} action={hasActiveFilters ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : canCreateForecast ? <Button variant="primary" onClick={openCreateForm}>Add Forecast</Button> : null} /> : <Card title="Forecast records" subtitle={`${meta?.total || forecasts.length} forecasts`}><Table columns={['ID', 'Product', 'Festival', 'Forecast date', 'Demand', 'Actions']} rows={rows} /></Card>}{showPagination ? <div className="flex justify-between text-xs text-[#94A3B8]"><span>Page {meta.page} of {meta.total_pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div></div> : null}<Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Update Forecast' : 'Add Forecast'}><form className="space-y-4" onSubmit={save}>{!editing ? <select required value={form.product_id} disabled={optionsLoading} onChange={(event) => setForm({ ...form, product_id: event.target.value })} className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">Select product</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select> : <p className="text-sm text-[#94A3B8]">{productName(editing.product_id)}</p>}<select required value={form.festival_id} disabled={optionsLoading} onChange={(event) => setForm({ ...form, festival_id: event.target.value })} className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">Select festival</option>{festivals.map((festival) => <option key={festival.festival_id} value={festival.festival_id}>{festival.festival_name}</option>)}</select><Input label="Forecast date" type="date" value={form.forecast_date} onChange={(event) => setForm({ ...form, forecast_date: event.target.value })} required /><Input label="Predicted demand" type="number" min="0" value={form.predicted_demand} onChange={(event) => setForm({ ...form, predicted_demand: event.target.value })} required /><div className="flex justify-end gap-2"><Button variant="ghost" disabled={isSaving} onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" variant="primary" isLoading={isSaving}>Save Forecast</Button></div></form></Modal></div>
}

export default Forecasts
