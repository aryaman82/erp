import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'designs' })

export const { GET, POST } = handlers
