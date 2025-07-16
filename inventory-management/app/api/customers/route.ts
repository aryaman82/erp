import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'customers' })

export const { GET, POST } = handlers
