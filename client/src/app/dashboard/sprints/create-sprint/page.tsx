'use client'
import { useState } from 'react'
import { Step, StepLabel, Stepper } from '@mui/material'
import { useRouter } from 'next/navigation'

import { Button } from '@/lib/material'
import { CREATE_SPRINT_STEPS } from '../constants/steps'
import { FirstStep } from './steps/FirstStep'
import { SecondStep } from './steps/SecondStep'
import { ThirdStep } from './steps/ThirdStep'
import { FourthStep } from './steps/FourthStep'
import { Project } from '@/models/Project.model'
import { toast } from 'react-toastify'

export default function CreateSprint() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  //Step 2 props
  const [selectedProject, setSelectedProject] = useState<Project>({} as Project)
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(undefined)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    if (activeStep === 0) {
      router.back()
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  async function onCreateSprint() {}

  async function onSelectProject(project?: Project) {
    if (!project) return;
    //NOTE: we'll need to change that condition after fixing the issue
    if(project.isCustomFieldSelected) {
      toast.error(`Project ${project.name} doesn't have the required custom field selected`)
      setTimeout(() => {
        router.push(`/dashboard/projects/${project.id}/setup`)
      }, 2000)
    }

    setSelectedProject(project)
  }

  async function onSelectTeam(teamId: string | undefined) {
    if (teamId) setSelectedTeamId(teamId)
  }

  return (
    <div className="flex-col flex justify-between min-h-min mt-4">
      <Stepper activeStep={activeStep} alternativeLabel>
        {CREATE_SPRINT_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="flex px-16 mt-8">
        {activeStep === 0 && <FirstStep />}
        {activeStep === 1 && <SecondStep onSelectProject={onSelectProject} onSelectTeam={onSelectTeam} />}
        {activeStep === 2 && <ThirdStep />}
        {activeStep === 3 && <FourthStep />}
      </div>

      <div className="flex flex-row justify-between px-16 mt-8">
        <Button size="md" color="indigo" onClick={handleBack}>
          Back
        </Button>
        {activeStep === CREATE_SPRINT_STEPS.length - 1 ? (
          <Button size="md" color="indigo" onClick={onCreateSprint}>
            Create Sprint
          </Button>
        ) : (
          <Button size="md" color="indigo" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
