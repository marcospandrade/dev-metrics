import { Card, CardBody, Typography } from '@/lib/material';

export function FirstStep() {
  return (
    <Card className="mt-5 flex flex-1">
      <CardBody>
        <Typography variant="h5" color="indigo" className="mb-2">
          Sprint Creation
        </Typography>
        <Typography variant="paragraph" className="mb-2">
          Here you'll start the process to create sprints in DevMetrics!
        </Typography>
      </CardBody>
    </Card>
  );
}
