import React, {Component} from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Icon from "spectrum-icons";
import Nav from "react-bootstrap/Nav";
import Link from 'next/link';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import getPosts from "@utils/getPosts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faHammer,
    faHome,
    faNewspaper,
    faDownload
} from "@fortawesome/free-solid-svg-icons";

function renderTooltip(message) {
    return <Tooltip>{message}</Tooltip>;
}

function randomPost() {
    const posts = ((context) => {
        return getPosts(context)
      })(require.context('../posts', true, /\.md$/))
    return posts[Math.floor(Math.random() * posts.length)];
}


export class GlobalFooter extends Component {
    render() {
        return <div className="footer">
            <div className="footer-content">
                <script> </script>
                <div className="nm">h<span className="hbg">arris</span>b<span className="hbg">e</span>g</div>
                <Row>
                    <Col>
                        <a href="https://github.com/hbg" className={"hover-icon"}>
                            <Icon glyph="github" size={48} color={"black"}/>
                        </a>
                    </Col>
                    <Col>
                        <a href="https://blog.harrisbeg.com" className={"hover-icon"}>
                            <Icon glyph="post-fill" size={48} color={"black"}/>
                        </a>
                    </Col>
                    <Col>
                        <a href="mailto:contact@harrisbeg.com" className={"hover-icon"}>
                            <Icon glyph="email-fill" size={48} color={"black"}/>
                        </a>
                    </Col>
                    <Col>
                        <a href="" className={"hover-icon"}>
                            <Icon glyph="profile-fill" size={48} color={"black"}/>
                        </a>
                    </Col>
                </Row>
            </div>
        </div>
    }
}

export class GlobalNavbar extends Component {
    render() {
        return <Navbar className="nbar" collapseOnSelect expand="lg">
            <Navbar.Brand href="/#home">
                <div id="profile-image-container">

                </div>
            </Navbar.Brand>
            <a href={'/#home'}><p className='nm d-none d-sm-block'>hbg</p></a>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"><Icon glyph="menu" size={48}
                                                                       color={"#ffdf00"}/></Navbar.Toggle>
            <Navbar.Collapse className='navbar-links'
                             id='responsive-navbar-nav'>

                <Nav className="ml-auto">
                    <Nav.Item>

                        <Nav.Link href="https://harrisbeg.com/">
                            <FontAwesomeIcon icon={faHome}/> <span className='mobile-text'>Home</span>
                        </Nav.Link>

                    </Nav.Item>
                    <Nav.Item>

                        <Nav.Link href="https://harrisbeg.com/#projects">
                            <FontAwesomeIcon icon={faHammer}/> <span className='mobile-text'>Projects</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>

                        <Nav.Link href="https://harrisbeg.com/pdf/CV_HB.pdf">
                            <FontAwesomeIcon icon={faDownload}/> <span className='mobile-text'>Resume</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>

                        <Nav.Link href="/">
                            <FontAwesomeIcon icon={faNewspaper}/> <span className='mobile-text'>Blog</span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

            </Navbar.Collapse>

        </Navbar>
    }
}

export class ColoredButton extends Component {
    render() {
        return <a href={this.props.url}>
            <Button variant="primary" style={{backgroundColor: this.props.color || 'red'}}>{this.props.text}</Button>
        </a>
    };
};

export class Stub extends Component {
    render() {
        return <Col sm={4}>
            <a href={this.props.url} className={"no_underline"}>
                {this.props.hidden ? (
                    <OverlayTrigger
                        placement="top"
                        delay={{show: 250, hide: 400}}
                        overlay={renderTooltip("This item is pending completion.")}>
                        <Card className="stub hide">
                            <Card.Body>
                                <Card.Title className="card-title">{this.props.title || 'Stub Title'}</Card.Title>
                                <p style={{fontSize: "12pt", color: "#666666"}}>{this.props.description}</p>
                            </Card.Body>
                        </Card>
                    </OverlayTrigger>
                ) : (
                    <Card className="stub">
                        <Card.Body>
                            <Card.Title className="card-title">{this.props.title || 'Stub Title'}</Card.Title>
                            <p style={{fontSize: "12pt", color: "#666666"}}>{this.props.description}</p>
                        </Card.Body>
                    </Card>
                )
                }
            </a>
        </Col>
    }
}

export class BlogCard extends Component {
    render() {
        return <Col sm={6}>
            <Link href={this.props.url}>
            <Card className={"blogStub"}>
                <Card.Img variant="top"
                          src={this.props.image || 'https://cdn1.thr.com/sites/default/files/imagecache/landscape_928x523/2019/11/the_mandalorian_still_embed.jpg'}/>
                <Card.Body>
                    <Card.Title className="card-title">{this.props.title || 'Card Title'}</Card.Title>
                    <p>{this.props.description || 'Description'}</p>
                </Card.Body>
                <Card.Footer>
                    <span className={"card-footer-text"}>{this.props.date} — {this.props.length}</span>
                </Card.Footer>
            </Card>
                </Link>
        </Col>
    };
};

export function PostList({ posts }) {
  if (posts === 'undefined') return null

  return (
    <div>
      {!posts && <div>No posts!</div>}
      <Row>
        {posts &&
          posts.map((post) => {
            return (
                <BlogCard title={post?.frontmatter?.title} url={{ pathname: `/post/${post.slug}` }} image={post?.frontmatter?.hero_image} description={post?.frontmatter?.description} date={post?.frontmatter?.date} length={post?.stats.text}/>
            )
          })}
      </Row>
    </div>
  )
};

export default {BlogCard, ColoredButton, GlobalNavbar, Stub, GlobalFooter, PostList};