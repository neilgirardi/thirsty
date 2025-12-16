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
      </Link>
    </li>
  )
}
