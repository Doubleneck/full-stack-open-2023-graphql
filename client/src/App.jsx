import { useState } from 'react'
import Authors from './components/Authors'

//import Books from './components/Books'
//import NewBook from './components/NewBook'


const App = () => {

  
  const [page, setPage] = useState('authors')

  return (
    
    <div>

      <div>
        <button onClick={() => setPage('authors')}>authors</button>

      </div>

      <Authors show={page === 'authors'} />

   
    </div>
  )
}

export default App