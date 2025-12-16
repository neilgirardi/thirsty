import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Ingredient, CHART_COLORS, parseMeasureToNumber } from 'utils/drinks'

interface IngredientListProps {
  ingredients: Ingredient[]
  showChart?: boolean
}

export function IngredientList({ ingredients, showChart = true }: IngredientListProps) {
  return (
    <div className="ingredients-row">
      <ul className="ingredient-list">
        {ingredients.map((ing, index) => (
          <li key={ing.name} className="ingredient-item">
            <span
              className="ingredient-color"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            ></span>
            <span className="ingredient-text">
              {ing.name}
              {ing.measure && <span className="ingredient-measure"> ({ing.measure})</span>}
            </span>
          </li>
        ))}
      </ul>
      {showChart && (
        <div className="ingredient-chart">
          <ResponsiveContainer width="100%" height={160}>
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
                outerRadius={70}
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
