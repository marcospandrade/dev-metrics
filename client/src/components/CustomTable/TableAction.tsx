import { LibIcons } from '@/lib/icons'
import { ActionItem } from './CustomTable'
import { IconButton, Tooltip } from '@/lib/material'

interface TableActionProps {
  identifier: string
  actionItemConfig: ActionItem
}

export function TableAction({ identifier, actionItemConfig }: TableActionProps) {
  return (
    <Tooltip
      content={actionItemConfig.label}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <IconButton
        size="md"
        variant="gradient"
        className="mx-2"
        color={actionItemConfig.color}
        onClick={() => actionItemConfig.onClick(identifier)}
        aria-label={actionItemConfig.label}
      >
        {actionItemConfig.icon ? actionItemConfig.icon : <LibIcons.QuestionMarkIcon />}
      </IconButton>
    </Tooltip>
  )
}
