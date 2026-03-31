import { useState } from 'react'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { productsApi } from '@/lib/api/products'
import { dummyProducts } from '@/lib/constants/dummyProducts'

function DummyProductsSeederPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [logs, setLogs] = useState([])

  const appendLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${message}`])
  }

  const seedDummyProducts = async () => {
    setIsSeeding(true)
    setLogs([])

    let successCount = 0
    let failureCount = 0

    for (const product of dummyProducts) {
      try {
        appendLog(`Creating product: ${product.name}`)

        const createdProduct = await productsApi.create({
          name: product.name,
          brand: product.brand,
          description: product.description,
          shortDescription: product.shortDescription,
          gender: product.gender,
          shoeType: product.shoeType,
          category: product.category,
          basePrice: product.basePrice,
          featuredProduct: product.featuredProduct,
          newArrival: product.newArrival,
        })

        if (product.images?.length) {
          await productsApi.addImages(
            createdProduct.id,
            product.images.map((imageUrl, index) => ({
              imageUrl,
              altText: `${product.name} image ${index + 1}`,
              position: index,
              isThumbnail: index === 0,
            })),
          )
        }

        if (product.specification) {
          await productsApi.updateSpecification(createdProduct.id, product.specification)
        }

        if (product.variants?.length) {
          for (const variant of product.variants) {
            await productsApi.createVariant(createdProduct.id, {
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              material: variant.material,
              width: variant.width,
              price: variant.price,
            })
          }
        }

        successCount += 1
        appendLog(`Created ${product.name} with variants and images`)
      } catch (error) {
        failureCount += 1
        appendLog(`Failed ${product.name}: ${error.response?.data?.message || error.message}`)
      }
    }

    setIsSeeding(false)

    if (failureCount === 0) {
      toast.success(`Seeded ${successCount} dummy products successfully`)
    } else {
      toast.warning(`Seed complete: ${successCount} succeeded, ${failureCount} failed`)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dummy Product Seeder"
        description="Populate the catalog with sample shoes for demos and UI testing."
        actions={
          <button
            type="button"
            onClick={seedDummyProducts}
            disabled={isSeeding}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSeeding ? (
              <span className="inline-flex items-center gap-1">
                <LoaderCircle className="h-4 w-4 animate-spin" /> Seeding...
              </span>
            ) : (
              'Seed Dummy Products'
            )}
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-slate-900">Seed Inventory</h2>
        <p className="mt-2 text-sm text-slate-600">
          This creates {dummyProducts.length} products with images, variants, and specifications.
        </p>

        <div className="mt-4 max-h-[340px] overflow-auto rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-100">
          {logs.length ? (
            logs.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)
          ) : (
            <p className="text-slate-400">No seeding activity yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DummyProductsSeederPage
