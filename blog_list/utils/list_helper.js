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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
