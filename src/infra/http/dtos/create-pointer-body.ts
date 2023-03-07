import * as zod from 'zod'

const pointerSchema = zod.object({
  accuracyInMeters: zod
    .number()
    .max(150, {
      message: 'accuracyInMeters should up to a maximum of 150'
    })
    .min(0),

  city: zod.string().regex(/^[A-Z]{1}.*/, {
    message:
      'city needs to respect names of entities, such as places, names and other'
  }),

  direction: zod.string().nullable(),

  km: zod.number().min(0, {
    message: 'it is not possible to contain km markers with less than zero'
  }),

  marker: zod.number().min(0, {
    message: 'it is not possible to contain markers with less than zero'
  }),

  position: zod
    .number()
    .array()
    .refine(arr => arr.length === 2, {
      message: 'position is malformed because not have a 2 length'
    }),

  rodId: zod.number().optional(),

  uf: zod.string().regex(/^[A-Z]{2}$/, {
    message: 'uf malformed'
  })
})

type Input = zod.input<typeof pointerSchema>
type Output = zod.output<typeof pointerSchema> & {
  position: [number, number]
}

export function createPointerBody(data: Input) {
  return pointerSchema.parse(data) as Output
}
