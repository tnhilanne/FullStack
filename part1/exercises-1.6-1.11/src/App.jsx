
import { useState } from 'react'

// Button component for user feedback actions
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

// Renders a single statistic line
const StatisticLine = ({ text, value }) => {
  const display = text === 'positive' ? value + ' %' : value
  return (
    <tr>
      <td>{text}</td>
      <td>{display}</td>
    </tr>
  )
}

// Presentational component for statistics
const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  // Function to handle feedback button clicks
  const handleFeedback = (type) => {
    let newGood = good
    let newNeutral = neutral
    let newBad = bad

    if (type === 'good') newGood = good + 1
    if (type === 'neutral') newNeutral = neutral + 1
    if (type === 'bad') newBad = bad + 1

    setGood(newGood)
    setNeutral(newNeutral)
    setBad(newBad)

    const total = newGood + newNeutral + newBad
    setAll(total)
    //prevent division by zero
    setAverage(total === 0 ? 0 : (newGood - newBad) / total)
    setPositive(total === 0 ? 0 : (newGood / total) * 100)
  }

  return (
    <div>
      <h1>Give feedback</h1>

      <Button onClick={() => handleFeedback('good')} text="Good" />
      <Button onClick={() => handleFeedback('neutral')} text="Neutral" />
      <Button onClick={() => handleFeedback('bad')} text="Bad" />

      <h1>Statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App
