import { useQuery } from '@apollo/client'
import { ALL_BOOKS, LOGGED_USER } from '../queries'

const Recommend = (props) => {
  if (!props.show) {
    return null
  }
  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  if (result.loading)  {
    return <div>loading...</div>
  }
  const loggedUser = useQuery(LOGGED_USER, {
    pollInterval: 2000
  })

  if (loggedUser.loading)  {
    return <div>loading...</div>
  }

  const genre = loggedUser.data.me.favoriteGenre

  const filteredBooks = result.data.allBooks.filter(b => b.genres.includes(genre))
  const books = filteredBooks

  return (
    <div>
      <h2>recommendations</h2>
      {genre && (
        <div>
          <p>Books in your favorite genre <strong>{genre}</strong></p>
        </div>
      )}

      <div className="book-list">
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
              <th>genres</th>
            </tr>
            {books.map((b) => (
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

      <style >{`
        .book-list {
          margin-top: 20px; /* Adjust the margin-top value as needed */
        }
      `}</style>
    </div>
  )
}

export default Recommend



