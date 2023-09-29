import React from 'react'
import Footer from '../Footer/Footer';
import Routers from '../../Routers/Routers';
import Header from '../Navbar/Navbar';

function Layout() {
    return (
        <>
            <Header/>
            <div><Routers/></div>
            <Footer/>
      </>
    );
}

export default Layout