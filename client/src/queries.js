import { gql } from '@apollo/client'


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

