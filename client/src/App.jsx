import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm'
//import NewBook from './components/NewBook'


const App = () => {
  
  
  const [page, setPage] = useState('authors')
  //const [page, setPage] = useState('books')
  return (
    
    <div>

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('addbook')}>add book</button>
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <BookForm show={page === 'addbook'} />
      
   
    </div>
  )
}

export default App