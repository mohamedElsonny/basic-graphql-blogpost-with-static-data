export default {
  post(parent, args, { db }, info) {
    return db.posts.find(post => post.id === args.id)
  },
  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts
    return db.posts.filter(
      post =>
        post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
    )
  },
  users(parent, args, { db }, info) {
    if (!args.query) return db.users
    return users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    )
  },
  comments(parent, args, { db }, info) {
    return db.comments
  },
  me(parent, args, { db }, info) {
    return {
      id: '123456',
      name: 'Mohamed Gamal',
      email: 'mo@sonny.com',
      age: 24
    }
  }
}
