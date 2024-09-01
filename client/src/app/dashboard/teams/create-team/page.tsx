'use client'

// import { api } from '@/lib/api'
import { Input, Typography } from '@/lib/material'
import { useForm } from 'react-hook-form'
import { ParticipantsField } from './components/ParticipantsField'
import { CreateParticipantDto, CreateTeamDto } from './dto/create-team.dto'
import { forwardRef, useState } from 'react'
import { stat } from 'fs'
import { useModal } from '@/hooks/useModal'
import { useRouter } from 'next/navigation'

type FormCreateTeam = CreateTeamDto

export default function CreateTeam() {
  const [inputs, setInputs] = useState<CreateParticipantDto[]>([{ name: '' }])
  const { defineModal, handleModal } = useModal()
  const { replace } = useRouter()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormCreateTeam>({
    defaultValues: {
      teamName: '',
      participants: [{ name: '' }],
    },
  })

  function handleSetInputs(values: CreateParticipantDto[]): void {
    setInputs(values)
    setValue('participants', values)
  }

  function handleSuccessModal() {
    handleModal(false)
    replace('/dashboard/teams')
  }

  const onSubmit = handleSubmit((data) => handleSubmitForm(data))

  async function handleSubmitForm(payload: CreateTeamDto) {
    const { data, status } = await api.post('team', payload)

    if (status === 201) {
      defineModal({
        title: 'Success!',
        text: "Team created successfully, you'll be redirected to the teams page",
        handleConfirm: () => handleSuccessModal(),
        handleCancel: () => handleSuccessModal(),
        buttonConfirmText: 'Ok',
      })
    }
  }

  return (
    <div className="mx-4 mb-12">
      <Typography variant="h5" className="text-indigo-500">
        Start registering your team
      </Typography>
      <form className="max-w-md mt-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input
            variant="standard"
            color="indigo"
            label="Team name"
            type="text"
            id="teamNameField"
            // className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            {...register('teamName')}
          />
        </div>

        <div className="mt-10">
          <ParticipantsField inputs={inputs} handleChangeInputs={handleSetInputs} />
        </div>

        <div className="flex mt-12">
          <button
            onClick={onSubmit}
            className="text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
