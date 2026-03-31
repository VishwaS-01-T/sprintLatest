import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { productsApi } from '@/lib/api/products'

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters),
    staleTime: 60 * 1000,
  })
}

export function useProduct(productId) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.get(productId),
    enabled: Boolean(productId),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success('Product created successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }) => productsApi.update(productId, data),
    onSuccess: (_, variables) => {
      toast.success('Product updated successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product')
    },
  })
}

export function useArchiveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.archive,
    onSuccess: () => {
      toast.success('Product archived successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to archive product')
    },
  })
}

export function useBulkUpdateProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productIds, status }) => productsApi.bulkUpdateStatus(productIds, status),
    onSuccess: () => {
      toast.success('Product statuses updated')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update statuses')
    },
  })
}
