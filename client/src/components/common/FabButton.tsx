import { ReactNode } from 'react'

interface FabIconProps {
  children: ReactNode
  onClick: () => void
}

export function FabIcon({ children, onClick }: FabIconProps) {
  return (
    <button
      onClick={onClick}
      className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white p-3 font-normal text-blue-400 shadow-lg outline-none hover:bg-gray-100 focus:outline-none"
      type="button"
    >
      {children}
    </button>
  )
}
