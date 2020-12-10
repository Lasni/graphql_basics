const users = [{
  id: '1',
  name: 'Grega',
  email: 'grega@gmail.com',
  age: 32
}, {
  id: '2',
  name: 'Mujko',
  email: 'mujko@gmail.com'
}, {
  id: '3',
  name: 'Scungilli Man',
  email: 'scungilli@gmail.com'
}]

const posts = [{
    id: '1',
    title: 'postTitle1',
    body: 'postBody1',
    published: false,
    author: '1'
  },
  {
    id: '2',
    title: 'postTitle2',
    body: 'postBody2',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'postTitle3',
    body: 'postBody3',
    published: false,
    author: '2'
  }
]

const comments = [{
    id: '1',
    text: 'first comment',
    author: '3',
    post: '1'
  },
  {
    id: '2',
    text: 'second comment',
    author: '1',
    post: '1'
  },
  {
    id: '3',
    text: 'third comment',
    author: '2',
    post: '2'
  },
  {
    id: '4',
    text: 'fourth comment',
    author: '1',
    post: '2'
  }
]

const db = {
  users,
  posts,
  comments
}

export { db as default }