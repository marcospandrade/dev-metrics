'use client';

import { api } from '@/services/api';
import { Input, Typography } from '@/lib/material';
import { useForm } from 'react-hook-form';
import { ParticipantsField } from './components/ParticipantsField';
import { CreateParticipantDto, CreateTeamDto } from './dto/create-team.dto';
import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import teamService from '@/services/teams.service';

type FormCreateTeam = CreateTeamDto;

export default function CreateTeam() {
  const [inputs, setInputs] = useState<CreateParticipantDto[]>([{ name: '' }]);
  const { defineModal, handleModal } = useModal();
  const { replace } = useRouter();
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
  });

  function handleSetInputs(values: CreateParticipantDto[]): void {
    setInputs(values);
    setValue('participants', values);
  }

  function handleSuccessModal() {
    handleModal(false);
    replace('/dashboard/teams');
  }

  const onSubmit = handleSubmit((data) => handleSubmitForm(data));

  async function handleSubmitForm(payload: CreateTeamDto) {
    const teamCreated = await teamService.createTeam(payload);

    if (!teamCreated.id) {
      return;
    }
    defineModal({
      title: 'Success!',
      text: "Team created successfully, you'll be redirected to the teams page",
      handleConfirm: () => handleSuccessModal(),
      handleCancel: () => handleSuccessModal(),
      buttonConfirmText: 'Ok',
    });
  }

  return (
    <div className="mx-4 mb-12">
      <Typography variant="h5" className="text-indigo-500">
        Start registering your team
      </Typography>
      <form className="mt-6 max-w-md">
        <div className="group relative z-0 mb-5 w-full">
          <Input
            variant="standard"
            color="indigo"
            label="Team name"
            type="text"
            id="teamNameField"
            {...register('teamName')}
          />
        </div>

        <div className="mt-10">
          <ParticipantsField inputs={inputs} handleChangeInputs={handleSetInputs} />
        </div>

        <div className="mt-12 flex">
          <button
            onClick={onSubmit}
            className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 sm:w-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
