import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'batches' })

export const { GET, POST } = handlers
