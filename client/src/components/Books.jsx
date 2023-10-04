import { useQuery } from '@apollo/client'
import { ALL_BOOKS , BOOKS_BY_GENRE } from '../queries'
import { useState , useEffect } from 'react'
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
  const initBooks = result.data.allBooks

  const [books, setBooks] = useState(initBooks)
  const [genreToSearch, setGenreToSearch] = useState(null)

  const filteredBooks = useQuery(BOOKS_BY_GENRE, {
    variables: { genreToSearch },
    skip: !genreToSearch,
    pollInterval: 2000
  })

  useEffect(() => {
    if (genreToSearch === null) {
      setBooks(initBooks)
      return
    }
    if (filteredBooks.data) {
      setBooks(filteredBooks.data.allBooks)
    }
  }
  , [genreToSearch])


  const setGenre = (genre) => {
    setGenreToSearch(genre)
    if (genre === null) {
      setBooks(initBooks)
      setGenreToSearch(null)
      return
    }
  }

  const uniqueGenres = new Set()

  books.forEach(book => {
    const genres= book.genres
    genres.forEach(genre => uniqueGenres.add(genre))
  })
  const genreList = [...uniqueGenres]

  return (
    <div>
      <h2>books</h2>
      {genreToSearch &&  (
        <div>
          <>In genre <strong>{ genreToSearch }</strong></>
        </div>
      )}
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
      <div>
        <h3>Genres</h3>
        {genreList.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
