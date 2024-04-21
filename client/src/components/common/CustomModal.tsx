import { ModalProps } from '@/hooks/useModal'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@/lib/material'

interface SignInModalProps {
  isOpen: boolean
  modalData: ModalProps
  openModal: () => void
}

export function CustomModal({ isOpen, modalData, openModal }: SignInModalProps) {
  function handleCancelModal() {
    modalData.handleCancel?.()
    openModal()
  }
  return (
    <Dialog open={isOpen} handler={openModal} dismiss={{ enabled: false }}>
      <DialogHeader>{modalData.title ?? 'Title'}</DialogHeader>
      {modalData.text && <DialogBody divider>{modalData.text}</DialogBody>}
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleCancelModal} className="mr-1">
          <span>{modalData.buttonCancelText ?? 'Cancel'}</span>
        </Button>
        <Button variant="gradient" color="green" onClick={modalData.handleConfirm}>
          <span>{modalData.buttonConfirmText ?? 'Confirm'}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
