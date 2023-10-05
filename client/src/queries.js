import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
export const LOGGED_USER = gql`
    query {
      me {
        username
        favoriteGenre
      }
    }
`
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    genres
    author {
      name
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const ALL_AUTHORS = gql`
    query {
      allAuthors {
        name
        born
        bookCount
      }
    }
`
export const ALL_BOOKS = gql`
    query {
      allBooks {
        title
        author {
          name
        }
        published
        genres
      }
    }
`


export const BOOKS_BY_GENRE= gql`
    query findBooksByGenre($genreToSearch: String) {
      allBooks (genre: $genreToSearch) {
        title
        author {
          name
        }
        published
        genres
      }
    }
`
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published_Integer: Int!, $genres: [String]) {
  
    addBook(
      title: $title,
      author: $author,
      published: $published_Integer,
      genres: $genres
      ) {
      title
      author {
        name
      }
      id
      published
      genres
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation EditAuthor($author_name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $author_name,
      setBornTo: $setBornTo
    ) {
      bookCount
      born
      name
    }
  }
`

