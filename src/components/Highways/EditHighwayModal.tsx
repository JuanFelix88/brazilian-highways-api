import * as Modal from '@/src/components/Modal'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Highway as HighwayZod,
  highwaySchema
} from '@/src/infra/http/dtos/highway-schema'
import { Highway } from '@/src/application/entities/highway'
import * as FormSearch from '@/src/components/FormSearch'
import { FormEvent, MouseEvent, useEffect } from 'react'

interface EditHighwayModalProps {
  handleOnSubmit: (args: HighwayZod & { id: number }) => void
  handleOnDelete: (e: { id: number }) => void
  highwayId?: number
  handleOnReset?: () => void
  show?: boolean
  highwayData?: Highway
}

export default function EditHighwayModal({
  handleOnSubmit: handleOnExternalSubmitFunc,
  handleOnDelete: handleOnExternalDeleteFunc,
  highwayId,
  highwayData,
  handleOnReset,
  show
}: EditHighwayModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm<HighwayZod>({
    resolver: zodResolver(highwaySchema)
  })

  useEffect(() => {
    if (highwayData) {
      reset({
        ...highwayData
      })
    }
  }, [highwayData])

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
        handleOnExternalSubmitFunc({
          id: highwayId!,
          ...highway
        })
        handleResetFormData()
      },
      errors => console.log(errors)
    )(event)
  }

  function handleOnDeleteEventWrapper() {
    handleOnExternalDeleteFunc({ id: highwayId! })
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
        <Modal.Title>Editar Rodovia</Modal.Title>
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
            <FormSearch.Button
              type="button"
              onClick={handleOnDeleteEventWrapper}
              className="mx-2 bg-red-700 text-white hover:bg-red-400 focus:ring-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-1 h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              Excluir Rodovia
            </FormSearch.Button>
          </div>
        </Modal.ContainerField>
      </Modal.ModalContainer>
    </Modal.Root>
  )
}
