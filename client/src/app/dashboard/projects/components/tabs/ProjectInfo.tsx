'use client'

import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import { LibIcons } from '@/lib/icons'
import { Project } from '@/models/Project.model'
import { Button } from '@/lib/material'
import projectsService from '@/services/projects/projects.service'

interface ProjectInfoProps {
  readonly selectedProject: Project
}

export function ProjectInfo({ selectedProject }: ProjectInfoProps) {
  const { push } = useRouter()
  async function onSyncProject(projectId: string) {
    await projectsService.syncProject(projectId)
    toast.info('Sync project started...')
  }

  function onClickSetupProject() {
    push(`projects/${selectedProject.id}/setup`)
  }

  return (
    <div className="relative flex row mt-6 shadow-md bg-white rounded-md justify-between align-middle px-6">
      <div className="p-6">
        <h5 className="mb-2 text-xl font-semibold">{selectedProject.name}</h5>
        <p className="text-sm leading-normal font-light">Key: {selectedProject.key}</p>
        <p className="text-sm leading-normal font-light">Project Type: {selectedProject.projectTypeKey}</p>
        <p className="text-sm leading-normal font-light">
          Is the project synced: {selectedProject.isSynced ? <LibIcons.CheckCircleIcon color="success" /> : <LibIcons.ErrorIcon color="error" />}
        </p>
        <p className="text-sm leading-normal font-light">
          Project has the custom fields selected:{' '}
          {selectedProject.isCustomFieldSelected ? <LibIcons.CheckCircleIcon color="success" /> : <LibIcons.ErrorIcon color="error" />}
        </p>
      </div>

      <div className="flex flex-col justify-center gap-y-4 mr-8">
        <Button color="indigo" onClick={() => onSyncProject(selectedProject.id)}>
          Sync Project
        </Button>
        <Button color="indigo" onClick={() => onClickSetupProject()}>
          Setup Project
        </Button>
      </div>
    </div>
  )
}
