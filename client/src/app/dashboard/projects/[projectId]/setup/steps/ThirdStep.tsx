import { Card, CardBody, Typography } from '@/lib/material';
import { RelevantCustomFieldMap } from '../../../constants/relevant-custom-fields';
import { Divider } from '@mui/material';

interface ThirdStepProps {
  relevantCustomFields: RelevantCustomFieldMap;
}

export function ThirdStep({ relevantCustomFields }: Readonly<ThirdStepProps>) {
  return (
    <div className="flex flex-1">
      <Card className="flex flex-1">
        <CardBody>
          <Typography variant="h5" className="text-center">
            Confirmation
          </Typography>
          <Divider className="mt-4" />
          <Typography variant="paragraph" className="mt-8">
            You have selected the following fields:
          </Typography>
          <div className="mt-8 flex flex-col">
            <div>
              <Typography variant="lead">
                <b>Field Selected for Sprint: </b> {relevantCustomFields.Sprint.name}
              </Typography>
              <Typography variant="paragraph">
                <b>Jira ID: </b> {relevantCustomFields.Sprint.id}
              </Typography>
            </div>
            <div>
              <Typography variant="lead">
                <b>Field Selected for Story Point: </b> {relevantCustomFields['Story Point'].name}
              </Typography>
              <Typography variant="paragraph">
                <b>Jira ID: </b> {relevantCustomFields['Story Point'].id}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
