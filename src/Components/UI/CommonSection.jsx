import React from 'react'
import { Container } from 'reactstrap'
import "../../Styles/CommonSection.css"


function CommonSection({title}) {
  return (
    <section className="common__section mb-4">
        <Container className='text-center'>
            <h1>{title}</h1>
        </Container>
    </section>
  )
}

export default CommonSection