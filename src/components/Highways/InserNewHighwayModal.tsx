import * as Modal from '@/src/components/Modal'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Highway as HighwayZod,
  highwaySchema
} from '@/src/infra/http/dtos/highway-schema'
import * as FormSearch from '@/src/components/FormSearch'
import { FormEvent, useEffect } from 'react'

interface InsertNewHighwayModalProps {
  handleOnSubmit: (args: HighwayZod) => void
  handleOnReset?: () => void
  show?: boolean
}

export default function InsertNewHighwayModal({
  handleOnSubmit: handleOnExternalSubmitFunc,
  handleOnReset,
  show
}: InsertNewHighwayModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<HighwayZod>({
    resolver: zodResolver(highwaySchema)
  })

  const { hasConcessionaire } = useWatch({
    control,
    defaultValue: {
      hasConcessionaire: false
    }
  })

  function handleResetFormData() {
    reset({
      code: '',
      concessionaireLink: null,
      concessionaireName: null,
      description: '',
      emergencyContacts: '',
      hasConcessionaire: false,
      name: ''
    })
  }

  function handleOnSubmitEventWrapper(event: FormEvent<HTMLFormElement>) {
    handleSubmit(
      highway => {
        handleOnExternalSubmitFunc(highway)
        handleResetFormData()
      },
      errors => console.log(errors)
    )(event)
  }

  useEffect(() => {
    if (!hasConcessionaire) {
      reset({
        concessionaireLink: null,
        concessionaireName: null
      })
    }
  }, [hasConcessionaire])

  return (
    <Modal.Root show={show}>
      <Modal.Mask />
      <Modal.ModalContainer
        onSubmit={handleOnSubmitEventWrapper}
        onReset={() => {
          handleResetFormData()
          handleOnReset?.()
        }}
        className="pl-10 pr-[100px]"
      >
        <Modal.Title>Inserir Rodovia</Modal.Title>
        <Modal.ContainerField>
          <label htmlFor="">Nome</label>
          <input
            {...register('name')}
            type="text"
            autoFocus
            placeholder="Informe o nome da rodovia"
            className={`
              my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
              ${
                (errors.name?.message &&
                  `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                ''
              }
            `}
          />
          {errors.name?.message && (
            <p className="max-w-xs text-sm italic text-red-500">
              {errors.name.message}
            </p>
          )}
        </Modal.ContainerField>
        <Modal.ContainerField>
          <label htmlFor="">Código</label>
          <input
            {...register('code')}
            type="text"
            placeholder="BR-000"
            className={`
              my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
              ${
                (errors.code?.message &&
                  `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                ''
              }
            `}
          />
          {errors.code?.message && (
            <p className="max-w-xs text-sm italic text-red-500">
              {errors.code.message}
            </p>
          )}
        </Modal.ContainerField>
        <Modal.ContainerField>
          <label htmlFor="">Descrição</label>
          <textarea
            {...register('description')}
            title="description"
            placeholder="..."
            rows={2}
            className={`
              my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
              ${
                (errors.description?.message &&
                  `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                ''
              }
            `}
          />
          {errors.description?.message && (
            <p className="max-w-xs text-sm italic text-red-500">
              {errors.description.message}
            </p>
          )}
        </Modal.ContainerField>
        <Modal.ContainerField>
          <div className="flex w-fit items-center">
            <input
              placeholder="Selecione"
              type="checkbox"
              className="my-2 mr-2 cursor-pointer rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              {...register('hasConcessionaire')}
            />
            <label htmlFor="">Possui concessionária?</label>
          </div>
        </Modal.ContainerField>
        {hasConcessionaire && (
          <>
            <Modal.ContainerField hidden={!hasConcessionaire}>
              <label htmlFor="">Nome concessionária</label>
              <input
                type="text"
                {...register('concessionaireName')}
                placeholder="Informe o nome da concessionária"
                className={`
                  my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
                  ${
                    (errors.concessionaireName?.message &&
                      `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                    ''
                  }
                `}
              />
              {errors.concessionaireName?.message && (
                <p className="max-w-xs text-sm italic text-red-500">
                  {errors.concessionaireName.message}
                </p>
              )}
            </Modal.ContainerField>
            <Modal.ContainerField hidden={!hasConcessionaire}>
              <label htmlFor="">Link externo da concessionária</label>
              <input
                type="text"
                {...register('concessionaireLink')}
                placeholder="https://"
                className={`
                  my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
                  ${
                    (errors.concessionaireLink?.message &&
                      `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                    ''
                  }
                `}
              />
              {errors.concessionaireLink?.message && (
                <p className="max-w-xs text-sm italic text-red-500">
                  {errors.concessionaireLink.message}
                </p>
              )}
            </Modal.ContainerField>
          </>
        )}
        <Modal.ContainerField hidden={!hasConcessionaire}>
          <label htmlFor="">Descrição contatos de emergência</label>
          <textarea
            title="description"
            placeholder="..."
            {...register('emergencyContacts')}
            rows={2}
            className={`
                  my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
                  ${
                    (errors.emergencyContacts?.message &&
                      `border-red-400 focus:border-red-400 focus:ring-red-400`) ??
                    ''
                  }
                `}
          />
          {errors.emergencyContacts?.message && (
            <p className="max-w-xs text-sm italic text-red-500">
              {errors.emergencyContacts.message}
            </p>
          )}
        </Modal.ContainerField>

        <Modal.ContainerField>
          <div className="flex">
            <FormSearch.Button
              type="submit"
              className="mx-0 bg-green-600 text-white hover:bg-green-500 focus:ring-green-600 sm:mx-0"
            >
              Salvar
            </FormSearch.Button>
            <FormSearch.Button
              type="reset"
              className="mx-2 bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-500"
            >
              Cancelar
            </FormSearch.Button>
          </div>
        </Modal.ContainerField>
      </Modal.ModalContainer>
    </Modal.Root>
  )
}
