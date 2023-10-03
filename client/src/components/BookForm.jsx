import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS } from '../queries'

const BookForm = (props) => {
  if (!props.show) {
    return null
  }
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS } ]
  })

  const addGenre = async (event) => {
    event.preventDefault()
    if (genre) {
      setGenres([...genres, genre])
      setGenre('')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    const published_Integer = parseInt(published)

    createBook({  variables: { title, author, published_Integer, genres } })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          title <input value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author<input value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published <input value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          add genre <input value={genre}
            onChange={({ target }) => setGenre(target.value)}

          />
          <button type='submit' onClick={ addGenre }>add genre</button>
        </div>
        <div >
        genres: {genres.join()}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default BookForm