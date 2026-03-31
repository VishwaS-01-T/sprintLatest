import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '@/components/forms/ProductForm'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'
import { useProduct, useUpdateProduct } from '@/hooks/useProducts'

function ProductEditPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(productId)
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct()

  const handleSubmit = async (values) => {
    await updateProduct({
      productId,
      data: {
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
      },
    })

    navigate(`/products/${productId}`)
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading product..." />
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        Product not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description={`Update details for ${product.name}`} />
      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        submitting={isPending}
      />
    </div>
  )
}

export default ProductEditPage
