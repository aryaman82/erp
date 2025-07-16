import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'designs' })

export const { GET, PUT, DELETE } = handlers
