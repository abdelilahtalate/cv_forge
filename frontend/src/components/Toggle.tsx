interface Props {
  value: boolean
  onChange: (v: boolean) => void
}

export default function Toggle({ value, onChange }: Props) {
  return (
    <div
      className={`toggle-track ${value ? 'active' : ''}`}
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onChange(!value)}
    >
      <div className="toggle-thumb" />
    </div>
  )
}
