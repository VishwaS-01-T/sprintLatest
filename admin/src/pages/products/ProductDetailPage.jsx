import { Link, useParams } from 'react-router-dom'
import { PencilLine } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import PageHeader from '@/components/shared/PageHeader'
import { useProduct } from '@/hooks/useProducts'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

function ProductDetailPage() {
  const { productId } = useParams()
  const { data: product, isLoading, isError } = useProduct(productId)

  if (isLoading) {
    return <LoadingSpinner label="Loading product details..." />
  }

  if (isError || !product) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        Failed to load product details.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`${product.brand} • ${product.category} • ${product.shoeType}`}
        actions={
          <Link
            to={`/products/${product.id}/edit`}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <span className="inline-flex items-center gap-1">
              <PencilLine className="h-4 w-4" /> Edit Product
            </span>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Overview</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Status</p>
                <StatusBadge status={product.status} />
              </div>
              <div>
                <p className="text-slate-500">Base Price</p>
                <p className="font-semibold text-slate-900">{formatCurrency(product.basePrice)}</p>
              </div>
              <div>
                <p className="text-slate-500">Gender</p>
                <p className="font-medium text-slate-800">{product.gender}</p>
              </div>
              <div>
                <p className="text-slate-500">Release Date</p>
                <p className="font-medium text-slate-800">{formatDate(product.releaseDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Created</p>
                <p className="font-medium text-slate-800">{formatDateTime(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-500">Updated</p>
                <p className="font-medium text-slate-800">{formatDateTime(product.updatedAt)}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Short Description</p>
                <p className="text-slate-700">{product.shortDescription || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">Description</p>
                <p className="text-slate-700">{product.description || '-'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Variants</h2>
            <div className="mt-4 space-y-2">
              {product.variants?.length ? (
                product.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{variant.sku}</p>
                      <p className="text-slate-500">
                        Size {variant.size} • {variant.color} • {variant.material || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(variant.price)}</p>
                      <p className="text-xs text-slate-500">Stock: {variant.inventory?.availableStock ?? 0}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No variants yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Flags</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>Featured: {product.featuredProduct ? 'Yes' : 'No'}</p>
              <p>New Arrival: {product.newArrival ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Images</h2>
            {product.images?.length ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {product.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.imageUrl}
                    alt={image.altText || product.name}
                    className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No images available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
