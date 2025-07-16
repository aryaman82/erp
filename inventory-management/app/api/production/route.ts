import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'production' })

export const { GET, POST } = handlers
