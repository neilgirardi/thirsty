'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Ingredient, CHART_COLORS, parseMeasureToNumber } from 'utils/drinks'
import styles from './IngredientList.module.css'

interface IngredientListProps {
  ingredients: Ingredient[]
  showChart?: boolean
}

export function IngredientList({ ingredients, showChart = true }: IngredientListProps) {
  return (
    <div className={styles.row}>
      <ul className={styles.list}>
        {ingredients.map((ing, index) => (
          <li key={ing.name} className={styles.item}>
            <span
              className={styles.color}
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            ></span>
            <span className={styles.text}>
              {ing.name}
              {ing.measure && <span className={styles.measure}> ({ing.measure})</span>}
            </span>
          </li>
        ))}
      </ul>
      {showChart && (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={ingredients.map((ing, index) => ({
                  name: ing.name,
                  value: parseMeasureToNumber(ing.measure),
                  color: CHART_COLORS[index % CHART_COLORS.length]
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={55}
                innerRadius={0}
              >
                {ingredients.map((ing, index) => (
                  <Cell key={ing.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
