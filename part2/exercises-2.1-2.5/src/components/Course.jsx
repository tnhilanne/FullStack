const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => (
  
  <div>
    {parts.map((x) => (
      <Part key={x.id} part={x} />
    ))}
  </div>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({total}) => <h3>Number of exercises {total}</h3>

const Course = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  //console.log(total);
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course