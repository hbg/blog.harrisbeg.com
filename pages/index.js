import Header from '../partials/head';
import Container from 'react-bootstrap/Container';
import {PostList, GlobalNavbar, ProjectList, StubsList, GlobalFooter} from '../partials/components';
import React from "react"
import './index.scss'
import getPosts from '../utils/getPosts'

const Index = ({ posts, title, description, ...props }) => {
  return (
    <div>
        <Header page_name={title} description={description}/>
        <GlobalNavbar/>
        <Container>
            <h1 id={"overture"}>Overture</h1>
            <h2 id={"overture-description"}>The random ideas that come to my head go here.</h2>
          <PostList posts={posts} />
        </Container>
        <GlobalFooter/>
    </div>
  )
}

export default Index

export async function getStaticProps() {
  const posts = ((context) => {
    return getPosts(context)
  })(require.context('../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: 'Blog',
      description: 'My personal blog website, where I explore the random lemmas in my head.',
    },
  }
}
