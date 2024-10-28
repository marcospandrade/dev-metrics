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
import { Issue } from '@/models/Issue.model'
import sprintsService from '@/services/sprints/sprints.service'
import { CreateSprintDto } from '@/services/sprints/dto/create-sprint.dto'
import { addDays, isAfter, isPast } from 'date-fns'

export default function CreateSprint() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  //NOTE: Step 2 props
  const [sprintName, setSprintName] = useState('')
  const [sprintGoals, setSprintGoals] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project>({} as Project)
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(undefined)
  const [sprintStartDate, setSprintStartDate] = useState<Date | undefined>(undefined)
  const [sprintEndDate, setSprintEndDate] = useState<Date | undefined>(undefined)

  function onChangeStartDate(date: Date) {
    console.log(`onChangeStartDate`, date)
    console.log(isPast(date))
    if (isPast(addDays(date, 1))) {
      toast.warn('Start date must be greater than today')
      return
    }
    setSprintStartDate(new Date(date))
  }

  function onChangeEndDate(date: Date) {
    if(!sprintStartDate) return;

    if(!isAfter(date, sprintStartDate)){
      toast.warn('End date must be greater than start date')
      return
    }
    setSprintEndDate(new Date(date))
  }

  //NOTE: Step 3 props
  const [selectedItems, setSelectedItems] = useState<Issue[]>([])
  function onSelectCheckbox(record: Issue) {
    selectedItems.some((issue) => issue.id === record.id)
      ? setSelectedItems(selectedItems.filter((issue) => issue.id !== record.id))
      : setSelectedItems((state) => [...state, record])
  }
  function validateIsChecked(itemId: string) {
    return selectedItems?.some((item) => item.id === itemId)
  }

  //NOTE: Stepper props
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    if (activeStep === 0) {
      router.back()
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  async function onCreateSprint() {
    if (!selectedTeamId || !sprintEndDate || !sprintStartDate) return

    const payload: CreateSprintDto = {
      name: sprintName,
      goals: sprintGoals,
      startDate: sprintStartDate,
      endDate: sprintEndDate,
      projectId: selectedProject.id,
      teamId: selectedTeamId,
      issuesList: selectedItems.map((issue) => ({ id: issue.id })),
    }
    const response = await sprintsService.createSprint(payload)

    toast.success('Sprint successfully created')
    router.push('/dashboard/sprints')
  }

  async function onSelectProject(project?: Project) {
    if (!project) return
    if (!project.isCustomFieldSelected) {
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

      <div className="flex px-16 mt-4">
        {activeStep === 0 && <FirstStep />}
        {activeStep === 1 && (
          <SecondStep
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            startDate={sprintStartDate}
            endDate={sprintEndDate}
            onSelectSprintName={setSprintName}
            onSetSprintGoals={setSprintGoals}
            onSelectProject={onSelectProject}
            onSelectTeam={onSelectTeam}
          />
        )}
        {activeStep === 2 && (
          <ThirdStep
            selectedProjectId={selectedProject.id}
            onSelectCheckbox={onSelectCheckbox}
            selectedItemsLength={selectedItems.length}
            validateIsChecked={validateIsChecked}
          />
        )}
        {activeStep === 3 && <FourthStep sprintName={sprintName} goals={sprintGoals} project={selectedProject} selectedIssues={selectedItems} />}
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
