import uuidv4 from 'uuid/v4'

export default {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(user => user.email === data.email)

    if (emailTaken) throw new Error('Email taken.')

    const user = {
      id: uuidv4(),
      ...data
    }

    db.users.push(user)

    return user
  },

  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id)
    if (!user) throw new Error('User not found')

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)
      if (emailTaken) throw new Error('Email taken')

      user.email = data.email
    }

    if (typeof data.name === 'string') user.name = data.name

    if (typeof data.age !== 'undefined') user.age = data.age

    return user
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === args.id)
    if (userIndex === -1) throw new Error('User not found')

    // delete the user specified
    const [user] = db.users.splice(userIndex, 1)

    // delete all posts related to this user
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id

      // if you found a post that made by user -> delete its the post and its comments
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match
    })

    // delete all comments related to this user
    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return user
  },

  createPost(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author)
    if (!userExists) throw new Error('User not found!')

    const post = {
      id: uuidv4(),
      ...data
    }

    db.posts.push(post)

    if (data.published)
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })

    return post
  },

  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id)
    const originalPost = { ...post }

    if (typeof data.title === 'string') post.title = data.title
    if (typeof data.body === 'string') post.body = data.body
    if (typeof data.published === 'boolean') {
      post.published = data.published
      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) throw new Error('Post not found')

    // delete specified post
    const [post] = db.posts.splice(postIndex, 1)

    // delete all related comments
    db.comments = db.comments.filter(comment => comment.post !== args.id)

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post
  },

  createComment(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author)
    const post = db.posts.find(post => post.id === data.post)
    if (!userExists) throw new Error('User not found')
    if (!post || !post.published) throw new Error('Post not found')

    const comment = {
      id: uuidv4(),
      ...data
    }

    db.comments.push(comment)

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return comment
  },

  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id)
    if (!comment) throw new Error('Comment not found')

    if (typeof data.text === 'string') comment.text = data.text

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    )
    if (commentIndex === -1) throw new Error('Comment not found')

    // delete specified comment
    const [comment] = db.comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment
  }
}
