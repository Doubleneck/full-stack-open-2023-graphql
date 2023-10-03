import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = (props) => {

  const token = localStorage.getItem('books-user-token')
  const [authorId, setAuthorId] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  const authors = result.data.allAuthors


  const submit = async (event) => {
    event.preventDefault()
    const setBornTo = parseInt(born)
    const author_name = authorId
    editAuthor({ variables: { author_name, setBornTo } })
    setAuthorId('')
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
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      { token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
          Select author:
              <select
                value={authorId}
                onChange={({ target }) => setAuthorId(target.value)}
              >
                <option value="">Select an author</option>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
          born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors