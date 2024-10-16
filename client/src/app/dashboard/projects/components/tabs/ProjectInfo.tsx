import { LibIcons } from '@/lib/icons'
import { Project } from '@/models/Project.model'

interface ProjectInfoProps {
  readonly selectedProject: Project
}

export function ProjectInfo({ selectedProject }: ProjectInfoProps) {
  return (
    <div className="relative flex row mt-6 shadow-md bg-white rounded-md justify-center align-middle ">
      <div className="p-6">
        <h5 className="mb-2 text-xl font-semibold">{selectedProject.name}</h5>
        <p className="text-sm leading-normal font-light">Key: {selectedProject.key}</p>
        <p className="text-sm leading-normal font-light">Project Type: {selectedProject.projectTypeKey}</p>
        <p className="text-sm leading-normal font-light">
          Is the project synced: {selectedProject.isSynced ? <LibIcons.CheckCircleIcon /> : <LibIcons.ErrorIcon />}
        </p>
      </div>

      <div>
        <button>Sync Project</button>
      </div>
    </div>
  )
}
