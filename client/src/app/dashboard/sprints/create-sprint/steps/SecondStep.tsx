'use client';

import { SelectProjects } from '@/app/dashboard/projects/components/SelectProjects';
import DatePicker from '@/components/common/DatePicker';
import { SelectTeam } from '@/components/SelectTeam/SelectTeam';
import { useAuth } from '@/hooks/useAuth';
import { useLoading } from '@/hooks/useLoading';
import { Card, CardBody, Typography, Input } from '@/lib/material';
import { Project } from '@/models/Project.model';
import projectsService from '@/services/projects/projects.service';
import { Textarea } from '@material-tailwind/react';
import { Divider } from '@mui/material';
import { useEffect, useState } from 'react';

interface SecondStepPros {
  onSelectProject: (project: Project) => void;
  onSelectTeam: (teamId: string | undefined) => void;
  onSelectSprintName: (sprintName: string) => void;
  onSetSprintGoals: (goal: string) => void;
  onChangeStartDate: (date: Date) => void;
  onChangeEndDate: (date: Date) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export function SecondStep({
  onSelectProject,
  onSelectTeam,
  onSelectSprintName,
  onSetSprintGoals,
  onChangeStartDate,
  onChangeEndDate,
  startDate,
  endDate,
}: Readonly<SecondStepPros>) {
  const { changeLoadingStatus } = useLoading();
  const { getUserDetails } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  function identifyProject(projectId: string | undefined) {
    const foundProject = projects.find((p) => p.id === projectId);
    if (foundProject) onSelectProject(foundProject);
  }

  async function fetchProjects() {
    changeLoadingStatus(true);
    const user = await getUserDetails();
    const projects = await projectsService.getProjects(user.cloudId);
    setProjects(projects);
    changeLoadingStatus(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Card className="mt-5 flex flex-1">
      <CardBody>
        <Typography variant="h5">Initial Information</Typography>
        <Typography variant="paragraph">
          You will need to select the project that you want to create a new sprint and the related
          team
        </Typography>
        <Divider className="mt-4" />

        <div className="mt-4 flex flex-1 flex-col">
          <Typography variant="lead">Project information</Typography>
          <div className="flex flex-row gap-x-4">
            <div className="flex w-1/2 flex-col">
              <div className="mt-4">
                <SelectProjects
                  projects={projects}
                  onSelectProject={identifyProject}
                ></SelectProjects>
              </div>
            </div>
            <div className="flex w-1/2 flex-col">
              <div className="mt-4">
                <SelectTeam onSelectTeam={onSelectTeam}></SelectTeam>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-x-4">
          <Typography variant="lead">Sprint information</Typography>

          <div className="my-4">
            <Input label="Sprint Name" onChange={(ev) => onSelectSprintName(ev.target.value)} />
          </div>

          <div className="flex flex-1 flex-row gap-x-4">
            <div className="flex flex-1">
              <DatePicker label="Start date" onChange={onChangeStartDate} value={startDate} />
            </div>
            <div className="flex flex-1">
              <DatePicker label="End date" onChange={onChangeEndDate} value={endDate} />
            </div>
          </div>
          <div className="my-4">
            <Textarea label="Goals" onChange={(ev) => onSetSprintGoals(ev.target.value)} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
