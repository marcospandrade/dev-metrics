'use client';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { LibIcons } from '@/lib/icons';
import { Project } from '@/models/Project.model';
import { Button } from '@/lib/material';
import projectsService from '@/services/projects/projects.service';

interface ProjectInfoProps {
  readonly selectedProject: Project;
}

export function ProjectInfo({ selectedProject }: ProjectInfoProps) {
  const { push } = useRouter();
  async function onSyncProject(projectId: string) {
    await projectsService.syncProject(projectId);
    toast.info('Sync project started...');
  }

  function onClickSetupProject() {
    push(`projects/${selectedProject.id}/setup`);
  }

  return (
    <div className="row relative mt-6 flex justify-between rounded-md bg-white px-6 align-middle shadow-md">
      <div className="p-6">
        <h5 className="mb-2 text-xl font-semibold">{selectedProject.name}</h5>
        <p className="text-sm font-light leading-normal">Key: {selectedProject.key}</p>
        <p className="text-sm font-light leading-normal">
          Project Type: {selectedProject.projectTypeKey}
        </p>
        <p className="text-sm font-light leading-normal">
          Is the project synced:{' '}
          {selectedProject.isSynced ? (
            <LibIcons.CheckCircleIcon color="success" />
          ) : (
            <LibIcons.ErrorIcon color="error" />
          )}
        </p>
        <p className="text-sm font-light leading-normal">
          Project has the custom fields selected:{' '}
          {selectedProject.isCustomFieldSelected ? (
            <LibIcons.CheckCircleIcon color="success" />
          ) : (
            <LibIcons.ErrorIcon color="error" />
          )}
        </p>
      </div>

      <div className="mr-8 flex flex-col justify-center gap-y-4">
        <Button color="indigo" onClick={() => onSyncProject(selectedProject.id)}>
          Sync Project
        </Button>
        <Button color="indigo" onClick={() => onClickSetupProject()}>
          Setup Project
        </Button>
      </div>
    </div>
  );
}
