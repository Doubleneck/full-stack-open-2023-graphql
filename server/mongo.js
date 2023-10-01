const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =  `mongodb+srv://anttivuorenmaa:${password}@cluster0.ovdmzis.mongodb.net/bookDB?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

 const noteSchema = new mongoose.Schema({
   content: String,
  important: Boolean,
 })

 const Book = mongoose.model('Book', noteSchema)

 const book = new Book({
   content: 'HTML is Easy',
   important: true,
 })
 book.save().then(result => {
   console.log('booksaved!')
   mongoose.connection.close()
 })