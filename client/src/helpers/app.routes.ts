import { IconDefinition, faDashboard, faHome, faPeopleGroup, faPerson, faUser } from '@fortawesome/free-solid-svg-icons'

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
    name: 'Sprints',
    path: '/dashboard/sprints',
    icon: faPeopleGroup,
  },
  {
    name: 'Profile',
    path: '/dashboard/profile',
    icon: faUser,
  },
]
