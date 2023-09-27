import { useQuery,useMutation  } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = (props) => {
  if (!props.show) {
    return null
  }

  const [author_name, setAuthorname] = useState('')
  const [born, setBorn] = useState('')    

  const [ editAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  if (result.loading)  {
    return <div>loading...</div>
  } 

  const authors = [result.data.allAuthors]
  
  const submit = async (event) => {
    event.preventDefault()
    const setBornTo = parseInt(born)  
    editAuthor({  variables: { author_name, setBornTo} })
    setAuthorname('')
    setBorn('')
  }
    return (
      
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors[0].map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={author_name}
            onChange={({ target }) => setAuthorname(target.value)}
          />
        </div>
        <div>
          born<input value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
      </div>
    )
  }
  
  export default Authors