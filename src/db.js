// Demo User Data
let users = [
  {
    id: '1',
    name: 'Mohamed',
    email: 'mohamed@example.com',
    age: 24
  },
  {
    id: '2',
    name: 'Ahmed',
    email: 'ahmed@example.com',
    age: 32
  },
  {
    id: '3',
    name: 'Shimaa',
    email: 'shimaa@example.com',
    age: 34
  }
]

let posts = [
  {
    id: '11',
    title: 'New Post',
    body: 'this is my new post',
    published: true,
    author: '1'
  },
  {
    id: '12',
    title: 'Hello Guys',
    body: 'How are you today',
    published: false,
    author: '1'
  },
  {
    id: '13',
    title: 'Sorry guys',
    body: 'Not even more sorry than that',
    published: true,
    author: '3'
  }
]

let comments = [
  { id: '111', text: 'This is my first comment', author: '1', post: '11' },
  { id: '112', text: 'Hay this is awesome post', author: '3', post: '11' },
  { id: '113', text: 'How are you today', author: '3', post: '13' },
  { id: '114', text: 'Waw!! yaaay', author: '1', post: '13' }
]
const db = { users, posts, comments }

export default db
