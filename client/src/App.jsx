import React from 'react'
import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries.js'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
import LoginForm from './components/Loginform'
import Recommend from './components/Recommend'


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('books-user-token')
    setToken(token)
  }, [page, token])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  useSubscription(BOOK_ADDED, {

    onData: ({ data }) => {
      const title = data.data.bookAdded.title
      const author = data.data.bookAdded.author.name
      window.alert(`A Book with title: ${title} by ${author} added!`)
    }
  })

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        {page === 'login' && !token && (
          <div>
            <h2>Login</h2>
            <LoginForm setToken={setToken} />
          </div>
        )}

      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('addbook')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <BookForm show={page === 'addbook'} />
      <Recommend show={page === 'recommendations'} />
    </div>
  )
}

export default App