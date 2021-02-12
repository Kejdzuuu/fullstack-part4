const listHelper = require('../utils/list_helper')
const testData = require('./test_blog_data')

const listWithOneBlog = testData.listWithOneBlog
const listWithManyBlogs = testData.listWithManyBlogs
const nullBlog = testData.nullBlog

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)

  expect(result).toBe(1)
})

describe('total likes', () => {
  const emptyList = []
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated correctly', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const emptyList = []
  test('from empty list is null', () => {
    const blog = listHelper.favoriteBlog(emptyList)
    expect(blog).toEqual(nullBlog)
  })

  test('from list with one blog', () => {
    const blog = listHelper.favoriteBlog(listWithOneBlog)
    const expectedBlog = (({title, author, likes}) => ({title, author, likes}))(listWithOneBlog[0])
    expect(blog).toEqual(expectedBlog)
  })

  test('from list with many blogs', () => {
    const blog = listHelper.favoriteBlog(listWithManyBlogs)
    const expectedBlog = (({title, author, likes}) => ({title, author, likes}))(listWithManyBlogs[2])
    expect(blog).toEqual(expectedBlog)
  })
})

describe('author of most blogs', () => {
  const emptyList = []
  test('from empty list is null', () => {
    const blog = listHelper.mostBlogs(emptyList)
    const nullAuthor = {
      author: "None",
      blogs: -1
    }
    expect(blog).toEqual(nullAuthor)
  })

  test('from list with one blog', () => {
    const blog = listHelper.mostBlogs(listWithOneBlog)
    const expectedBlog = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    expect(blog).toEqual(expectedBlog)
  })

  test('from list with many blogs', () => {
    const blog = listHelper.mostBlogs(listWithManyBlogs)
    const expectedBlog = {
      author: "Robert C. Martin",
      blogs: 3
    }
    expect(blog).toEqual(expectedBlog)
  })
})

describe('author with most likes overall', () => {
  const emptyList = []
  test('from empty list is null', () => {
    const blog = listHelper.mostLikes(emptyList)
    const nullAuthor = {
      author: "None",
      likes: -1
    }
    expect(blog).toEqual(nullAuthor)
  })

  test('from list with one blog', () => {
    const blog = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    expect(blog).toEqual(expected)
  })

  test('from list with many blogs', () => {
    const blog = listHelper.mostLikes(listWithManyBlogs)
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    expect(blog).toEqual(expected)
  })
})
