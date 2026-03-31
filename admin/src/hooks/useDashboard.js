import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'
import { inventoryApi } from '@/lib/api/inventory'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [dashboard, sales] = await Promise.all([
        analyticsApi.dashboard(),
        analyticsApi.sales({ period: 'daily' }),
      ])

      return {
        ...dashboard,
        sales,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useLowInventoryAlerts() {
  return useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: () => inventoryApi.alerts(10),
    staleTime: 60 * 1000,
  })
}
