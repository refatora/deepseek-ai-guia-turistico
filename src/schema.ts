import { z } from 'zod'

const citySchema = z.object({
  name: z.string(),
  nameNormalized: z.string(),
  region: z.enum(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']),
})

export const citiesSchema = z.array(citySchema)

export type City = z.infer<typeof citySchema>