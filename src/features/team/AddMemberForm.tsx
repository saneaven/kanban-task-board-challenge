import { AddNameForm } from '../../ui/AddNameForm'

type AddMemberFormProps = {
  variant?: 'primary' | 'accent'
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddMemberForm({ variant = 'accent', onAdd, onClose }: AddMemberFormProps) {
  return (
    <AddNameForm
      label="Team member name"
      placeholder="Name"
      variant={variant}
      onAdd={onAdd}
      onClose={onClose}
    />
  )
}
