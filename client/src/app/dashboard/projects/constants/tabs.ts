export enum ProjectPageTabsEnum {
  INFO = 'info',
  ISSUES = 'issues',
}

type TabsDataProps = {
  label: string
  value: ProjectPageTabsEnum
  description: string
  component?: React.ReactNode
}

export const tabsData: TabsDataProps[] = [
  { label: 'Project Details', value: ProjectPageTabsEnum.INFO, description: 'Project info' },
  { label: 'Issues', value: ProjectPageTabsEnum.ISSUES, description: 'Issues list' },
]
