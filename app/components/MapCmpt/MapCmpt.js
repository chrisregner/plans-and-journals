import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <div className='h-100 bg-light-blue'>
    <Link to='/countries/jp'>Go to Japan</Link> <br />
    <Link to='/countries/de'>Go to Germany</Link> <br />
    <Link to='/countries/jp/plans/new'>Add Plan in Japan</Link> <br />
    <Link to='/countries/de/plans/new'>Add Plan in Germany</Link>
  </div>
)