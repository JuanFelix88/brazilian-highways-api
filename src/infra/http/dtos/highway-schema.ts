import * as zod from 'zod'

export const highwaySchema = zod
  .object({
    name: zod
      .string({
        required_error: 'O nome precisa ser informado'
      })
      .min(4, { message: 'O nome precisa conter ao menos 4 caracteres' }),
    description: zod
      .string({
        required_error: 'A descrição precisa ser informada'
      })
      .min(6, { message: 'A descrição precisar conter ao menos 6 caracteres' }),
    code: zod.string().regex(/^[A-Z]{2}-[0-9]{1,4}$/, {
      message: 'O código é inválido, tente algo como BR-000'
    }),
    hasConcessionaire: zod.boolean(),
    concessionaireName: zod.string().nullable(),
    emergencyContacts: zod
      .string({
        required_error:
          'É necessário informar uma descrição de contatos de emergência'
      })
      .min(10, {
        message:
          'O(s) contato(s) de emergência precisam conter ao menos 10 caracteres'
      }),
    concessionaireLink: zod.string().nullable()
  })
  .refine(
    ({ hasConcessionaire, concessionaireName }) =>
      hasConcessionaire ? Boolean(concessionaireName) : true,
    {
      message: 'O nome da concessionária precisa ser informado',
      path: ['concessionaireName']
    }
  )
  .refine(
    ({ hasConcessionaire, concessionaireLink }) =>
      hasConcessionaire ? Boolean(concessionaireLink) : true,
    {
      message: 'O link do website da concessionária precisa ser informado',
      path: ['concessionaireLink']
    }
  )

export type Highway = zod.infer<typeof highwaySchema>
