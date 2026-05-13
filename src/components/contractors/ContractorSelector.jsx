import { Input, Select } from '../ui/Input'

export const NEW_CONTRACTOR_VALUE = '__new_contractor__'

export function ContractorSelector({
  contractors = [],
  value = '',
  newName = '',
  clientValue = '',
  inheritedLabel = '',
  onChange,
  onNewNameChange,
  onClientChange,
  label = 'Contratante',
}) {
  const selectedValue = value ?? ''
  const showNewContractor = selectedValue === NEW_CONTRACTOR_VALUE
  const showClientFallback = selectedValue === ''

  return (
    <div className="grid gap-3">
      <Select
        label={label}
        name="contractor_id"
        value={selectedValue}
        onChange={onChange}
      >
        <option value="">{inheritedLabel || 'Sin contratante guardado'}</option>
        <option value={NEW_CONTRACTOR_VALUE}>Crear contratante...</option>
        {contractors.map((contractor) => (
          <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
        ))}
      </Select>

      {showNewContractor && (
        <Input
          label="Nombre del contratante *"
          name="new_contractor_name"
          value={newName}
          onChange={onNewNameChange}
          placeholder="Ayuntamiento de Madrid"
          required
        />
      )}

      {showClientFallback && (
        <Input
          label="Cliente o contratante"
          name="client"
          value={clientValue}
          onChange={onClientChange}
          placeholder="Ayuntamiento de Madrid"
        />
      )}
    </div>
  )
}
