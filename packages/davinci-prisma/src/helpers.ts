import { AUTO_INCREMENT, CUID, DB_GENERATED, NOW, UUID } from '@pmaltese/prisma-schema-generator'

export const DefaultValueFunctions = {
  AUTO_INCREMENT: { callee: AUTO_INCREMENT },
  NOW: { callee: NOW },
  CUID: { callee: CUID },
  UUID: { callee: UUID },
  DB_GENERATED: { callee: DB_GENERATED },
}
