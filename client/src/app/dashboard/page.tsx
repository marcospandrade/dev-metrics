import { Card, CardBody, Typography } from '@/lib/material';
export default async function Dashboard() {
  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex flex-col justify-center">
            <Typography variant="h5" className="mb-6 text-center text-indigo-500">
              {' '}
              Welcome to Dev Metrics
            </Typography>
            <Typography variant="paragraph" className="px-8">
              DevMetrics is a powerful tool designed to enhance agile planning for software
              development teams. By analyzing historical ticket data, DevMetrics generates
              predictive estimates for future tasks, helping teams allocate resources more
              effectively and improve accuracy in sprint planning. With DevMetrics, teams can
              harness past performance to drive smarter, data-backed decisions in their development
              workflows.
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
