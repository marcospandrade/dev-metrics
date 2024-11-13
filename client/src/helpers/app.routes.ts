import { IconDefinition, faHome, faPeopleGroup, faUser, faFileLines } from '@fortawesome/free-solid-svg-icons'

export interface Route {
  name: string
  path: string
  icon: IconDefinition
}

export const routes: Route[] = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: faHome,
  },
  {
    name: 'Projects',
    path: '/dashboard/projects',
    icon: faUser,
  },
  {
    name: 'Sprints',
    path: '/dashboard/sprints',
    icon: faFileLines,
  },
  {
    name: 'Teams',
    path: '/dashboard/teams',
    icon: faPeopleGroup,
  },
]
