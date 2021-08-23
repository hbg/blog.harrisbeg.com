import '../index.scss'
import Link from 'next/link'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import getSlugs from '@utils/getSlugs'
import Header from '../../partials/head'
import {PostList, GlobalNavbar, ProjectList, StubsList, GlobalFooter} from '../../partials/components';
import {Container, Button} from 'react-bootstrap';

export default function BlogPost({ frontmatter, markdownBody }) {
  if (!frontmatter) return <></>
  const readingTime = require('reading-time');
  const stats = readingTime(markdownBody);
  return (
    <>
      <Header page_name={`${frontmatter.title}`} />
        <GlobalNavbar/>
        <Container className={"coffee"}>
          <div className="back">
            <Link href="/">
              ← Back to post list
            </Link>
          </div>
          <article>
            <h1>{frontmatter.title}</h1>
            <h3 className="text-right minute-text">{stats.text}</h3>
            {frontmatter.hero_image && (
              <img
                src={frontmatter.hero_image}
                className="hero full-width"
                alt={frontmatter.title}
              />
            )}
            <div>
              <ReactMarkdown source={markdownBody} className={"content"} />
            </div>
          </article>
        </Container>
      <GlobalFooter/>
    </>
  )
}

export async function getStaticProps({ ...ctx }) {
  const { postname } = ctx.params

  const content = await import(`../../posts/${postname}.md`)
  const data = matter(content.default)

  return {
    props: {
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  const blogSlugs = ((context) => {
    return getSlugs(context)
  })(require.context('../../posts', true, /\.md$/))

  const paths = blogSlugs.map((slug) => `/post/${slug}`)

  return {
    paths, // An array of path names, and any params
    fallback: false, // so that 404s properly appear if something's not matching
  }
}
