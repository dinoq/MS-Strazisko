import { Container, Nav, Navbar } from 'react-bootstrap'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image'
import Head from "next/head";
import Header from '../components/header/Header';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/*<Navbar sticky="top" expand="lg">
        <Container>
          <Navbar.Brand href="#home">
            <div style={{ width: 100 }}>

              <Image
                src="/img/logo.png"
                width="180"
                height="96"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
                style="object-fit: contain"
              />
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navigation" onClick={()=>{console.log("AAA")}}/>

          <Navbar.Collapse id="navigation" className="justify-content-end">
            <Nav id="navitems-holder">
              <Nav.Link href="#domu" className="">Domů</Nav.Link>
              <Nav.Link href="#foto">Foto</Nav.Link>
              <Nav.Link href="#stravovani">Stravování</Nav.Link>
              <Nav.Link href="#dokumenty">Dokumenty</Nav.Link>
              <Nav.Link href="#kontakt">Kontakt</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>*/}
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
