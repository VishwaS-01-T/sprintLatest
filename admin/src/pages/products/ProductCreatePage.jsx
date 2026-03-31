import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ProductForm from '@/components/forms/ProductForm'
import PageHeader from '@/components/shared/PageHeader'
import { useCreateProduct } from '@/hooks/useProducts'
import { productsApi } from '@/lib/api/products'

function ProductCreatePage() {
  const navigate = useNavigate()
  const { mutateAsync: createProduct, isPending } = useCreateProduct()

  const handleSubmit = async (values) => {
    const createdProduct = await createProduct({
      name: values.name,
      brand: values.brand,
      description: values.description,
      shortDescription: values.shortDescription,
      gender: values.gender,
      shoeType: values.shoeType,
      category: values.category,
      basePrice: values.basePrice,
      releaseDate: values.releaseDate,
      featuredProduct: values.featuredProduct,
      newArrival: values.newArrival,
    })

    if (!createdProduct?.id) {
      toast.error('Product created but no ID was returned')
      return
    }

    if (values.images?.length) {
      await productsApi.addImages(
        createdProduct.id,
        values.images.map((imageUrl, index) => ({
          imageUrl,
          altText: `${values.name} image ${index + 1}`,
          position: index,
          isThumbnail: index === 0,
        })),
      )
    }

    if (values.specification) {
      await productsApi.updateSpecification(createdProduct.id, values.specification)
    }

    if (values.variants?.length) {
      for (const variant of values.variants) {
        await productsApi.createVariant(createdProduct.id, {
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          material: variant.material || undefined,
          width: variant.width || undefined,
          price: Number(variant.price),
        })
      }
    }

    navigate(`/products/${createdProduct.id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        description="Add a new shoe with variants, images, and specifications."
      />

      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" submitting={isPending} />
    </div>
  )
}

export default ProductCreatePage
