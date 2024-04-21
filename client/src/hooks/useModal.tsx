'use client'

import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

import { CustomModal } from '@/components/common/CustomModal'

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
  handleModal: () => void
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

  function handleModal() {
    setIsOpen(!isOpen)
  }

  const contextData: ModalContextData = useMemo(
    () => ({
      isOpen,
      defineModal,
      handleModal,
    }),
    [isOpen, handleModal, defineModal]
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
