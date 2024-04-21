import { ReactNode } from 'react'

interface ButtonProps {
  theme?: 'primary' | 'secondary'
  onClick: () => void
  children: ReactNode
}

export function CustomButton({ onClick, children }: ButtonProps) {
  return (
    <button
      className="mb-3 rounded bg-red-700 px-5 py-3 text-xs font-bold uppercase text-white shadow outline-none hover:shadow-md focus:outline-none active:bg-red-300 lg:mb-0 lg:mr-1"
      type="button"
      style={{ transition: 'all .15s ease' }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
