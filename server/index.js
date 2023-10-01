const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author= require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]
    id: ID!
  }

  type Author {
    name: String
    born: Int
    bookCount: Int
  }  

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String
      setBornTo: Int
    ): Author
  }

  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String,genre: String): [Book!]!
    allAuthors: [Author!]!
  }  
`

const resolvers = {
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({ ...args })
      const author = await Author.findOne({ name: args.author})
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null,
        })
        const savedAuthor = await newAuthor.save()
        book.author = savedAuthor
        return book.save()
      }
      book.author = author
      //console.log(book, "book")
      return book.save()
    },
    
    addAuthor: async (root, args) => {
      const author = new Author({
        name: args.name,
        born: args.born,
      })
      const savedAuthor =await author.save()
      return savedAuthor
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name})
      console.log(author)
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      const savedAuthor =await author.save()
      return author
    }
  },
  Query: {
   // bookCount: () => books.length,
   // authorCount: () => authors.length,
   // allAuthors: () => authors,
   //findAuthor: async (root, args) => Author.findOne({ name: args.name }),
    allBooks: async (root, args) => {
      // filters missing
      return Book.find({})
    },
    allAuthors: async (root, args) => {
      // filters missing
      return Author.find({})
    },
  //   allBooks: (root, args) => {
  //     let filteredBooks = books
  //     if (args.author) {
  //       filteredBooks = books.filter(b => b.author === args.author);
  //     }
    
  
  //   if (args.genre) {
  //     filteredBooks = filteredBooks.filter(b => b.genres.includes(args.genre));
  //   }
  
  //   return filteredBooks;
  // }
  
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    author: (root) => {
      return { 
      name: root.author,
      }
    }
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
//    bookCount: (root) => books.filter(book => book.author === root.name).length
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})