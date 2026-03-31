import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Plus, Archive } from 'lucide-react'
import { createColumnHelper } from '@tanstack/react-table'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useArchiveProduct, useBulkUpdateProductStatus, useProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'

const columnHelper = createColumnHelper()

function ProductsListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
  })
  const { data, isLoading } = useProducts(filters)
  const { mutate: archiveProduct, isPending: isArchiving } = useArchiveProduct()
  const { mutate: bulkUpdateStatus, isPending: isBulkUpdating } = useBulkUpdateProductStatus()

  const products = data?.products || []

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Product',
        cell: ({ row }) => {
          const product = row.original
          const image = product.images?.[0]?.imageUrl || 'https://placehold.co/200x200?text=Shoe'
          return (
            <div className="flex items-center gap-3">
              <img src={image} alt={product.name} className="h-11 w-11 rounded-lg border border-slate-200 object-cover" />
              <div>
                <p className="font-medium text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.brand}</p>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => <span className="text-slate-700">{info.getValue()}</span>,
      }),
      columnHelper.accessor('shoeType', {
        header: 'Shoe Type',
        cell: (info) => <span className="text-slate-700">{info.getValue()}</span>,
      }),
      columnHelper.accessor('basePrice', {
        header: 'Base Price',
        cell: (info) => <span className="font-semibold text-slate-900">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex items-center gap-2">
              <Link
                to={`/products/${product.id}`}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"
              >
                View
              </Link>
              <Link
                to={`/products/${product.id}/edit`}
                className="rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700"
              >
                <span className="inline-flex items-center gap-1">
                  <Edit className="h-3.5 w-3.5" /> Edit
                </span>
              </Link>
              <button
                type="button"
                disabled={isArchiving}
                onClick={() => archiveProduct(product.id)}
                className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700"
              >
                <span className="inline-flex items-center gap-1">
                  <Trash2 className="h-3.5 w-3.5" /> Archive
                </span>
              </button>
            </div>
          )
        },
      }),
    ],
    [archiveProduct, isArchiving],
  )

  if (isLoading) {
    return <LoadingSpinner label="Loading products..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, variants, and merchandising status."
        actions={
          <>
            <button
              type="button"
              disabled={isBulkUpdating}
              onClick={() => {
                const selectedIds = products.slice(0, 3).map((product) => product.id)
                if (selectedIds.length) {
                  bulkUpdateStatus({ productIds: selectedIds, status: 'ACTIVE' })
                }
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              <span className="inline-flex items-center gap-1">
                <Archive className="h-4 w-4" /> Activate 3 Sample
              </span>
            </button>
            <Link
              to="/products/new"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <span className="inline-flex items-center gap-1">
                <Plus className="h-4 w-4" /> New Product
              </span>
            </Link>
            <Link
              to="/products/seed"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
            >
              Seed Dummy Products
            </Link>
          </>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="text-sm font-medium text-slate-600">
            Status Filter
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            >
              <option value="">All</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </label>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchPlaceholder="Search products by name, brand, category"
          onSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
        />
      </div>
    </div>
  )
}

export default ProductsListPage
