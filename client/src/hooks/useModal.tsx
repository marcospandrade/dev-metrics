'use client'

import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

import { CustomModal } from '@/components/Common/CustomModal'

export interface ModalProps {
  title: string
  text?: string
  buttonConfirmText?: string
  buttonCancelText?: string
  handleConfirm: () => void
  handleCancel?: () => void
}

interface ModalContextData {
  isOpen: boolean
  defineModal: (data: ModalProps) => void
  handleModal: (value: boolean) => void
}

interface ModalContextProviderProps {
  children: ReactNode
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData)

function ModalContextProvider({ children }: ModalContextProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalProps>({} as ModalProps)

  function defineModal(data: ModalProps) {
    setModalData(data)
    setIsOpen(!isOpen)
  }

  function handleModal(value: boolean) {
    setIsOpen(value)
  }

  const contextData: ModalContextData = useMemo(
    () => ({
      isOpen,
      defineModal,
      handleModal,
    }),
    [isOpen, handleModal]
  )

  return (
    <ModalContext.Provider value={contextData}>
      <>
        {children}
        <CustomModal isOpen={isOpen} modalData={modalData} openModal={handleModal} />
      </>
    </ModalContext.Provider>
  )
}

function useModal() {
  const context = useContext(ModalContext)

  return context
}

export { ModalContextProvider, useModal }
