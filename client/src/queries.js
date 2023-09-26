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
export const CREATE_PERSON = gql`
mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
  addPerson(
    name: $name,
    street: $street,
    city: $city,
    phone: $phone
  ) {
    name
    phone
    id
    address {
      street
      city
    }
  }
}
`
