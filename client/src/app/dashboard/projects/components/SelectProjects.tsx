import { Project } from '@/models/Project.model';
import { Select, Option } from '@material-tailwind/react';

interface SelectProjectsProps {
  projects: Project[];
  onSelectProject: (projectId: string | undefined) => void;
}

export function SelectProjects({ projects, onSelectProject }: Readonly<SelectProjectsProps>) {
  if (projects.length === 0) return <></>;

  return (
    <Select label="Select project" onChange={(val) => onSelectProject(val)}>
      {projects.map((project) => (
        <Option key={project.id} value={project.id}>
          {project.name} - {project.key}
        </Option>
      ))}
    </Select>
  );
}
