import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
const Books = (props) => {
    if (!props.show) {
      return null
    }

const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
})
if (result.loading)  {
  return <div>loading...</div>
}

    const books = [result.data.allBooks]
    console.log(books)
    return (
      
      <div>
        <h2>books</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              
              <th>author</th>
              <th>published</th>
              <th>genres</th>
              
            </tr>
            {books[0].map((b) => (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
                <td>{b.genres.join()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default Books