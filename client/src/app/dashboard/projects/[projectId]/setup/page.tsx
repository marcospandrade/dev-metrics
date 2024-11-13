'use client'

import { Step, StepLabel, Stepper } from '@mui/material'
import { Button } from '@/lib/material'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FirstStep } from './steps/FirstStep'
import { SecondStep } from './steps/SecondStep'
import { RELEVANT_CUSTOM_FIELDS, RelevantCustomFieldMap } from '../../constants/relevant-custom-fields'
import { ThirdStep } from './steps/ThirdStep'
import { AtlassianCustomField } from '@/services/projects/dto/get-all-custom-fields.dto'
import projectsService from '@/services/projects/projects.service'
import { FieldToRegisterDto, RegisterCustomFieldsDto } from '@/services/projects/dto/register-custom-fields.dto'
import { toast } from 'react-toastify'

const steps = ['Welcome', 'Select fields', 'Confirmation']

export default function SetupProject() {
  const { projectId } = useParams<{ projectId: string }>()
  const router = useRouter()
  const [relevantCustomFields, setRelevantCustomFields] = useState<RelevantCustomFieldMap>(RELEVANT_CUSTOM_FIELDS)
  const [activeStep, setActiveStep] = useState(0)

  function handleSetRelevantCustomFields(fieldName: string, value: AtlassianCustomField) {
    setRelevantCustomFields((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  async function saveCustomFieldConfiguration() {
    const fieldsToRegister: FieldToRegisterDto[] = Object.values(relevantCustomFields)
      .map((field: AtlassianCustomField) => {
        return {
          atlassianId: field.id,
          fieldName: field.name,
          fieldType: field.schema?.type ?? 'string',
          isStoryPointField: field.name.toLowerCase().includes('story') ? true : false,
        }
      })
      .flat()

    const payloadRegisterCustomFields: RegisterCustomFieldsDto = {
      projectId,
      fieldsToRegister,
    }
    await projectsService.registerCustomFields(payloadRegisterCustomFields)

    toast.success(`Custom fields registered successfully!`)
    return router.push('/dashboard/projects')
  }

  return (
    <div className="flex-col flex justify-between min-h-min ">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="flex px-16 mt-8">
        {activeStep === 0 && <FirstStep />}
        {activeStep === 1 && (
          <SecondStep selectedProjectId={projectId} handleSetRelevantCustomFields={handleSetRelevantCustomFields} relevantCustomFields={relevantCustomFields} />
        )}
        {activeStep === 2 && <ThirdStep relevantCustomFields={relevantCustomFields} />}
      </div>

      <div className="flex flex-row justify-between px-16 mt-8">
        <Button size="md" color="indigo" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button size="md" color="indigo" onClick={saveCustomFieldConfiguration}>
            Save
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
