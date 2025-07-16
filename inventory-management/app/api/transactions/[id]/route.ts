import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'transactions' })

export const { GET, PUT, DELETE } = handlers
