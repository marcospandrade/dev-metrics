'use client'

import { LibIcons } from '@/lib/icons'
import { Project } from '@/models/Project.model'
import { Button } from '@mui/material'
import projectsService from '@/services/projects.service'
import {toast} from  'react-toastify'

interface ProjectInfoProps {
  readonly selectedProject: Project
}

export function ProjectInfo({ selectedProject }: ProjectInfoProps) {
  async function onSyncProject(projectId: string){
    const responseSyncProject = await projectsService.syncProject(projectId)
    toast.info('Project sync started')
  }

  return (
    <div className="relative flex row mt-6 shadow-md bg-white rounded-md justify-between align-middle px-6">
      <div className="p-6">
        <h5 className="mb-2 text-xl font-semibold">{selectedProject.name}</h5>
        <p className="text-sm leading-normal font-light">Key: {selectedProject.key}</p>
        <p className="text-sm leading-normal font-light">Project Type: {selectedProject.projectTypeKey}</p>
        <p className="text-sm leading-normal font-light">
          Is the project synced: {selectedProject.isSynced ? <LibIcons.CheckCircleIcon /> : <LibIcons.ErrorIcon />}
        </p>
        <p className="text-sm leading-normal font-light">
          Project has the custom fields selected: {selectedProject.isSynced ? <LibIcons.CheckCircleIcon /> : <LibIcons.ErrorIcon />}
        </p>
      </div>

      <div className='flex flex-col justify-center gap-y-4'>
        <Button size='small' type='button' variant='contained' color='primary' onClick={() => onSyncProject(selectedProject.id)}>Sync Project</Button>
        <Button size='small' variant='contained' color='primary'>Select Custom Fields</Button>
      </div>
    </div>
  )
}
