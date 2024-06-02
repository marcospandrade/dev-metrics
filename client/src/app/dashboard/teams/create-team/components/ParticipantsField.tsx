import { DynamicInputField } from '@/components/common/DynamicInputField'
import { InputProps, Typography } from '@material-tailwind/react'
import { useState } from 'react'
import { CreateParticipantDto } from '../dto/create-team.dto'

type ParticipantsFieldProps = {
  inputs: CreateParticipantDto[]
  handleChangeInputs: (inputs: CreateParticipantDto[]) => void
}

export function ParticipantsField({ inputs, handleChangeInputs }: ParticipantsFieldProps) {
  function handleOnChangeInputs(values: Record<string, any>[]) {
    const updateInputs = values
      .map((value) => {
        if (value.name) {
          return { name: value.name }
        }
        return { name: '' }
      })
      .flat()
    handleChangeInputs((updateInputs as CreateParticipantDto[]) ?? [])
  }

  function handleAddNewParticipant() {
    handleChangeInputs([...inputs, { name: '' }])
  }

  return (
    <DynamicInputField
      propertyName="name"
      inputs={inputs}
      onAddInput={handleAddNewParticipant}
      onChangeData={handleOnChangeInputs}
      title="Participants"
      fieldLabel="Participant name"
    />
  )
}
