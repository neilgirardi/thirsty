import styles from './SearchBox.module.css'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
}

export function SearchBox({ value, onChange, onClear, placeholder = 'Find a drink' }: SearchBoxProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.field}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button className={styles.clearBtn} onClick={onClear}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="#c7c7c7" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
