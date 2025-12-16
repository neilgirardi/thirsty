import Link from 'next/link'
import styles from './DrinkListItem.module.css'

interface DrinkListItemProps {
  id: string
  name: string
  thumbnail: string
}

export function DrinkListItem({ id, name, thumbnail }: DrinkListItemProps) {
  return (
    <li className={styles.item}>
      <Link href={`/drink/${id}`} className={styles.row}>
        <img src={thumbnail} alt={name} className={styles.thumb} />
        <span className={styles.name}>{name}</span>
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </li>
  )
}
