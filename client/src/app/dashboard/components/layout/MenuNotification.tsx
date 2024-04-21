import { faBell, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Avatar, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@/lib/material'

// TODO: Implement that
export function MenuNotification() {
  return (
    <Menu>
      <MenuHandler>
        <IconButton variant="text" color="blue-gray">
          <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-blue-gray-500" />
        </IconButton>
      </MenuHandler>
      <MenuList className="w-max border-0">
        <MenuItem className="flex items-center gap-3">
          <Avatar
            src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
            alt="item-1"
            size="sm"
            variant="circular"
          />
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
              <strong>New message</strong> from Laur
            </Typography>
            <Typography
              variant="small"
              color="blue-gray"
              className="flex items-center gap-1 text-xs font-normal opacity-60"
            >
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" /> 13 minutes ago
            </Typography>
          </div>
        </MenuItem>
        <MenuItem className="flex items-center gap-4">
          <Avatar
            src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
            alt="item-1"
            size="sm"
            variant="circular"
          />
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
              <strong>New album</strong> by Travis Scott
            </Typography>
            <Typography
              variant="small"
              color="blue-gray"
              className="flex items-center gap-1 text-xs font-normal opacity-60"
            >
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" /> 13 minutes ago
            </Typography>
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
