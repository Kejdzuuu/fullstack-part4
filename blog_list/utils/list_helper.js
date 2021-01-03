const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let favBlog = {
    title: "None",
    author: "None",
    likes: -1
  }
  if (blogs.length == 0) {
    return favBlog
  }

  blogs.forEach(blog => {
    if (blog.likes > favBlog.likes) {
      favBlog = blog
    }
  })
  favBlog = (({title, author, likes}) => ({title, author, likes}))(favBlog)
  return favBlog
}

const mostBlogs = (blogs) => {
  let mostBlogsAuthor = {
    author: "None",
    blogs: -1
  }
  if (blogs.length === 0) {
    return mostBlogsAuthor
  }

  let authors = lodash.countBy(blogs, 'author')

  Object.entries(authors).forEach(entry  => {
    const [author, blogs] = entry
    if (blogs > mostBlogsAuthor.blogs) {
      mostBlogsAuthor.author = author
      mostBlogsAuthor.blogs = blogs
    }
  })

  return mostBlogsAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
