import matter from 'gray-matter'

const getPosts = (context) => {
  const keys = context.keys()
  const values = keys.map(context)
  const readingTime = require('reading-time');

  let data = keys.map((key, index) => {
    let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3);
    let value = values[index];
    let document = matter(value.default);
    let stats = readingTime(document.content);
    let date = Date.parse(document.data.date);
    return {
      frontmatter: document.data,
      markdownBody: document.content,
      date: date,
      slug,
      stats
    }
  });
  function compare(a, b) {
    if ( a.date > b.date ){
      return -1;
    }
    if ( a.date < b.date ){
      return 1;
    }
    return 0;
  }
  data.sort(compare);
  return data
}

export default getPosts
