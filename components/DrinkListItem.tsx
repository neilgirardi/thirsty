import Link from 'next/link'

interface DrinkListItemProps {
  id: string
  name: string
  thumbnail: string
}

export function DrinkListItem({ id, name, thumbnail }: DrinkListItemProps) {
  return (
    <li>
      <Link href={`/drink/${id}`} className="drink-row">
        <img src={thumbnail} alt={name} className="drink-thumb" />
        <span className="drink-name">{name}</span>
      </Link>
    </li>
  )
}
