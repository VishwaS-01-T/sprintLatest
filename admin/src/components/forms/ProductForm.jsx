import { useMemo, useState } from 'react'
import { baseCategories, baseShoeTypes, productGenders } from '@/lib/constants/productForm'

const initialVariant = {
  sku: '',
  size: '',
  color: '',
  material: '',
  width: '',
  price: '',
}

function ProductForm({ initialValues, onSubmit, submitLabel = 'Save Product', submitting = false }) {
  const [form, setForm] = useState({
    name: initialValues?.name || '',
    brand: initialValues?.brand || '',
    description: initialValues?.description || '',
    shortDescription: initialValues?.shortDescription || '',
    gender: initialValues?.gender || 'UNISEX',
    shoeType: initialValues?.shoeType || '',
    category: initialValues?.category || '',
    basePrice: initialValues?.basePrice || '',
    releaseDate: initialValues?.releaseDate ? String(initialValues.releaseDate).slice(0, 10) : '',
    featuredProduct: Boolean(initialValues?.featuredProduct),
    newArrival: Boolean(initialValues?.newArrival),
    variants: initialValues?.variants?.length
      ? initialValues.variants.map((variant) => ({
          sku: variant.sku || '',
          size: variant.size || '',
          color: variant.color || '',
          material: variant.material || '',
          width: variant.width || '',
          price: variant.price || '',
        }))
      : [],
    images: initialValues?.images?.map((image) => image.imageUrl) || [],
    specification: {
      material: initialValues?.shoeSpecification?.material || '',
      soleMaterial: initialValues?.shoeSpecification?.soleMaterial || '',
      upperMaterial: initialValues?.shoeSpecification?.upperMaterial || '',
      closureType: initialValues?.shoeSpecification?.closureType || '',
      waterproof: Boolean(initialValues?.shoeSpecification?.waterproof),
      breathable: Boolean(initialValues?.shoeSpecification?.breathable),
    },
  })
  const [variantDraft, setVariantDraft] = useState(initialVariant)

  const isValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.brand.trim() &&
      form.shoeType.trim() &&
      form.category.trim() &&
      Number(form.basePrice) > 0
    )
  }, [form])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateSpecification = (field, value) => {
    setForm((prev) => ({
      ...prev,
      specification: {
        ...prev.specification,
        [field]: value,
      },
    }))
  }

  const addVariant = () => {
    if (!variantDraft.sku || !variantDraft.size || !variantDraft.color || !Number(variantDraft.price)) {
      return
    }

    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...variantDraft, price: Number(variantDraft.price) }],
    }))
    setVariantDraft(initialVariant)
  }

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const addImageUrl = () => {
    const input = prompt('Paste image URL')
    if (!input) return
    setForm((prev) => ({ ...prev, images: [...prev.images, input] }))
  }

  const removeImageUrl = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isValid) return

    onSubmit({
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim() || undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      gender: form.gender,
      shoeType: form.shoeType.trim(),
      category: form.category.trim(),
      basePrice: Number(form.basePrice),
      releaseDate: form.releaseDate || undefined,
      featuredProduct: form.featuredProduct,
      newArrival: form.newArrival,
      variants: form.variants,
      images: form.images,
      specification: form.specification,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900">Basic Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Product Name</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="Nike Air Max 90"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Brand</span>
            <input
              value={form.brand}
              onChange={(event) => updateField('brand', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="Nike"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Gender</span>
            <select
              value={form.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
            >
              {productGenders.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Base Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              onChange={(event) => updateField('basePrice', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="129.99"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Category</span>
            <input
              value={form.category}
              list="category-options"
              onChange={(event) => updateField('category', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="Athletic Shoes"
            />
            <datalist id="category-options">
              {baseCategories.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Shoe Type</span>
            <input
              value={form.shoeType}
              list="shoe-type-options"
              onChange={(event) => updateField('shoeType', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
              placeholder="Running"
            />
            <datalist id="shoe-type-options">
              {baseShoeTypes.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </label>
        </div>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Short Description</span>
          <textarea
            value={form.shortDescription}
            onChange={(event) => updateField('shortDescription', event.target.value)}
            className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
            placeholder="Compact summary for product cards"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            className="h-28 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-brand-500 focus:ring-2"
            placeholder="Detailed product description"
          />
        </label>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              checked={form.featuredProduct}
              onChange={(event) => updateField('featuredProduct', event.target.checked)}
            />
            Featured Product
          </label>
          <label className="inline-flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              checked={form.newArrival}
              onChange={(event) => updateField('newArrival', event.target.checked)}
            />
            New Arrival
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Product Images</h2>
          <button
            type="button"
            onClick={addImageUrl}
            className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
          >
            Add Image URL
          </button>
        </div>

        {form.images.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {form.images.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="rounded-xl border border-slate-200 p-2">
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="h-28 w-full rounded-lg object-cover"
                  onError={(event) => {
                    event.currentTarget.src = 'https://placehold.co/600x400?text=Image+Error'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="mt-2 w-full rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No images added yet.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900">Variants</h2>

        <div className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-6">
          <input
            value={variantDraft.sku}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, sku: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="SKU"
          />
          <input
            value={variantDraft.size}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, size: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="Size"
          />
          <input
            value={variantDraft.color}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, color: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="Color"
          />
          <input
            value={variantDraft.material}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, material: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="Material"
          />
          <input
            value={variantDraft.width}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, width: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="Width"
          />
          <input
            type="number"
            value={variantDraft.price}
            onChange={(event) => setVariantDraft((prev) => ({ ...prev, price: event.target.value }))}
            className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
            placeholder="Price"
          />
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
        >
          Add Variant
        </button>

        {form.variants.length ? (
          <div className="space-y-2">
            {form.variants.map((variant, index) => (
              <div key={`${variant.sku}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <p className="text-slate-700">
                  {variant.sku} | {variant.size} | {variant.color} | ${variant.price}
                </p>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No variants added yet.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900">Specifications</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.specification.material}
            onChange={(event) => updateSpecification('material', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Material"
          />
          <input
            value={form.specification.soleMaterial}
            onChange={(event) => updateSpecification('soleMaterial', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Sole Material"
          />
          <input
            value={form.specification.upperMaterial}
            onChange={(event) => updateSpecification('upperMaterial', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Upper Material"
          />
          <input
            value={form.specification.closureType}
            onChange={(event) => updateSpecification('closureType', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Closure Type"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.specification.waterproof}
              onChange={(event) => updateSpecification('waterproof', event.target.checked)}
            />
            Waterproof
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.specification.breathable}
              onChange={(event) => updateSpecification('breathable', event.target.checked)}
            />
            Breathable
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
