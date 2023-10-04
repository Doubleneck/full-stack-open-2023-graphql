import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
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
  const [genreToShow, setGenreToShow] = useState(null)



  const setGenre = (genre) => {
    if (genre === null) {
      setBooks(initBooks)
      setGenreToShow(null)
      return
    }
    setGenreToShow(genre)
    const filteredBooks = books.filter(b => b.genres.includes(genre))
    setBooks(filteredBooks)
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
      {genreToShow &&  (
        <div>
          <>In genre <strong>{ genreToShow }</strong></>
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