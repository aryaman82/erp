import { createGenericRouteHandlers } from '@/lib/route-handler-factory'

const handlers = createGenericRouteHandlers({ entityName: 'materials' })

export const { GET, PUT, DELETE } = handlers
