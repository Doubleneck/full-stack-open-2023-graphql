const Book = require('./models/book')
const Author= require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
  Mutation: {
    addBook: async (root, args,context) => {
      const book = new Book({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if ( args.title.length < 5) {
        throw new GraphQLError('Title must be at lest 5 characters', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null,
        })
        const savedAuthor = await newAuthor.save()
        book.author = savedAuthor
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book.save()
      }
      book.author = author
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book.save()
    },

    addAuthor: async (root, args,context ) => {
      const author = new Author({
        name: args.name,
        born: args.born,
      })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      if ( args.title.name < 4) {
        throw new GraphQLError('Author name must be at lest 4 characters', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const savedAuthor =await author.save()
      return savedAuthor
    },

    editAuthor: async (root, args,context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      const savedAuthor =await author.save()
      return savedAuthor
    },
    createUser: async (root, args,context) => {

      if ( args.username.length < 3 || args.favoriteGenre.length < 3) {
        throw new GraphQLError('Username and favoriteGenre must be at lest 3 characters', {
          extensions: { code: 'BAD_USER_INPUT' }
        })

      }
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

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
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: async (root, args) => {
      if (!args.author) {
        const bookCount = await Book.countDocuments({})
        return bookCount
      }
      const author = await Author.findOne({ name: args.author })
      const bookCount = await Book.countDocuments({ author: author })
      return bookCount
    },


    allBooks: async (root, args) => {
      let query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author
      }

      if (args.genre) {
        query.genres = args.genre // Use the provided genre as a filter
      }

      return await Book.find(query)
    },

    // eslint-disable-next-line no-unused-vars
    allAuthors: async (root, args) => {
      return Author.find({})
    },

  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    author: async (root) => {
      const author = await Author.findById(root.author)
      return author
    }
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const bookCount = await Book.countDocuments({ author: author })
      return bookCount
    }
  },
}

module.exports = resolvers