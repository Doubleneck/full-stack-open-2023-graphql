const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author= require('./models/author')
const User = require('./models/user')
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
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount(author: String): Int!,
    authorCount: Int!,
    allBooks(author: String,genre: String): [Book!]!
    allAuthors: [Author!]!
    me:User
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
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
    
  Query: {
    
    bookCount: async (root, args) => {
      if (!args.author) {
        const bookCount = await Book.countDocuments({})
        return bookCount
      }
      const author = await Author.findOne({ name: args.author})
      const bookCount = await Book.countDocuments({author: author})
      return bookCount
    },


    allBooks: async (root, args) => {
      let query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        query.author = author;
      }

      if (args.genre) {
        query.genres = args.genre; // Use the provided genre as a filter
      }

      return await Book.find(query);
    },

    allAuthors: async (root, args) => {
      return Author.find({})
    },
  
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    author: async (root) => {
      const author = await Author.findById(root.author);
      return author;
    }
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name})
      const bookCount = await Book.countDocuments({author: author})
      return bookCount
    }
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