import React from 'react'
import styled from 'styled-components'
import Post from '../components/Post'

const Page = () => {
  return (
    <StContainer>
      <p>게시물을 검색해보세요</p>
      <Post />
    </StContainer>
  )
}

const StContainer = styled.div`
  text-align: center;
`

export default Page