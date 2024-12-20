'use client';

import { useEffect, useState } from 'react';
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';

import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/models/Project.model';
import projectsService from '@/services/projects/projects.service';

import { SelectProjects } from './components/SelectProjects';
import { IssuesTable } from './components/tabs/IssuesTable';

import { ProjectPageTabsEnum, tabsData } from './constants/tabs';
import { ProjectInfo } from './components/tabs/ProjectInfo';
import { useLoading } from '@/hooks/useLoading';

export default function IssuesPage() {
  const { getUserDetails } = useAuth();
  const { changeLoadingStatus } = useLoading();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>({} as Project);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<ProjectPageTabsEnum>(ProjectPageTabsEnum.INFO);

  async function fetchProjects() {
    changeLoadingStatus(true);
    const user = await getUserDetails();
    const projects = await projectsService.getProjects(user.cloudId);
    setProjects(projects);
    changeLoadingStatus(false);
  }

  async function onSelectProject(projectId: string | undefined) {
    setSelectedProjectId(projectId);
    if (projectId) {
      const project = await projectsService.getProjectWithDetails(projectId);
      setSelectedProject(project);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between">
        <div className="mb-6 flex flex-col justify-between">
          <div className="w-1/3">
            <SelectProjects projects={projects} onSelectProject={onSelectProject} />
          </div>
        </div>

        <div>
          {selectedProjectId && selectedProject ? (
            <Tabs value={activeTab}>
              <TabsHeader
                className="rounded-none border-b border-gray-200 p-0"
                indicatorProps={{
                  className:
                    'bg-transparent border-b-2 border-indigo-800 shadow-none rounded-none mt-0.5',
                }}
              >
                {tabsData.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={activeTab === value ? 'text-indigo-400' : ''}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                <TabPanel value={ProjectPageTabsEnum.INFO} className="px-0">
                  <ProjectInfo selectedProject={selectedProject}></ProjectInfo>
                </TabPanel>
                <TabPanel value={ProjectPageTabsEnum.ISSUES} className="px-0">
                  <IssuesTable
                    activeTab={activeTab}
                    selectedProjectId={selectedProjectId}
                  ></IssuesTable>
                </TabPanel>
              </TabsBody>
            </Tabs>
          ) : (
            <div className="flex justify-center rounded bg-gray-100 px-12 py-8 text-center">
              <Typography variant="paragraph" className="text-indigo-500">
                You should select a project to view details and issues
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
