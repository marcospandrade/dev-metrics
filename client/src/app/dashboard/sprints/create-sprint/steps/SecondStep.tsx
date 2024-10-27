'use client'

import { SelectProjects } from '@/app/dashboard/projects/components/SelectProjects'
import { SelectTeam } from '@/components/SelectTeam/SelectTeam'
import { useAuth } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'
import { Card, CardBody, Typography } from '@/lib/material'
import { Project } from '@/models/Project.model'
import projectsService from '@/services/projects/projects.service'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react'

interface SecondStepPros {
  onSelectProject: (project: Project) => void
  onSelectTeam: (teamId: string | undefined) => void
}

export function SecondStep({ onSelectProject, onSelectTeam }: Readonly<SecondStepPros>) {
  const { changeLoadingStatus } = useLoading()
  const { getUserDetails } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])

  function identifyProject(projectId: string | undefined) {
    const foundProject = projects.find((p) => p.id === projectId)
    if(foundProject) onSelectProject(foundProject)
  }

  async function fetchProjects() {
    changeLoadingStatus(true)
    const user = await getUserDetails()
    const projects = await projectsService.getProjects(user.cloudId)
    setProjects(projects)
    changeLoadingStatus(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Card className="flex flex-1 mt-5">
      <CardBody>
        <Typography variant="h5">Initial Information</Typography>
        <Typography variant="paragraph">You'll need to select the project that you want to create a new sprint and the related team</Typography>
        <Divider className="mt-4" />

        <div className="flex flex-1 flex-col mt-4">
          <Typography variant="h6" className="mr-6">
            Project
          </Typography>
          <div className="w-1/3 mt-4">
            <SelectProjects projects={projects} onSelectProject={identifyProject}></SelectProjects>
          </div>
        </div>
        <div>
          <Typography variant="h6" className="mt-4">
            Team
          </Typography>
          <div className="w-1/3 mt-4">
            <SelectTeam onSelectTeam={onSelectTeam}></SelectTeam>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
