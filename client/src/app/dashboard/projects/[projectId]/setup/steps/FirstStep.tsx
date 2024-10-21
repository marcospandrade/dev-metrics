import { Card, CardBody, Typography } from '@/lib/material'

export function FirstStep() {
  return (
    <Card className="flex flex-1 mt-5">
      <CardBody>
        <Typography variant="h5" color="indigo" className="mb-2">
          Set up project
        </Typography>
        <Typography variant="paragraph" className="mb-2">
          Set up your project to start using DevMetrics!
        </Typography>
        <Typography variant="paragraph">We need to identify a few fields to generate estimates due to how Jira works.</Typography>
      </CardBody>
    </Card>
  )
}
