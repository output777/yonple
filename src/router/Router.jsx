import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostDetailA from '../components/PostDetailA'
import PostDetailB from '../components/PostDetailB'
import Page from '../page/Page'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Page />} />
        <Route path='/a' element={<PostDetailA />} />
        <Route path='/b' element={<PostDetailB />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router