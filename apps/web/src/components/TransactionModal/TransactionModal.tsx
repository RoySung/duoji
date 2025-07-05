import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  ScrollShadow,
} from '@heroui/react'
import { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

type TransactionType = 'expense' | 'income'

const formMap = {
  expense: ExpenseForm,
  income: IncomeForm,
}

export default function TransactionModal({ isOpen, onOpenChange }: Props) {
  const [selected, setSelected] = useState<TransactionType>('expense')

  const Form = formMap[selected]

  function handleSave() {
    // TODO:
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2>Transaction</h2>
            <Tabs
              fullWidth
              aria-label="Transaction Type"
              selectedKey={selected}
              size="md"
              onSelectionChange={(key) => setSelected(key as TransactionType)}
            >
              <Tab key="expense" title="Expense"></Tab>
              <Tab key="income" title="Income"></Tab>
            </Tabs>
          </div>
        </ModalHeader>
        <ModalBody>
          <ScrollShadow size={50}>
            <Form />
          </ScrollShadow>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => onOpenChange(false)}>Cancel</Button>
          <Button color="primary" onPress={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
