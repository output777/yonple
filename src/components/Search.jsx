import React from 'react'
import styled from 'styled-components'

const Search = () => {
  return (
    <>
      <StInput type='text' placeholder='검색어를 입력하세요' />
    </>
  )
}

const StInput = styled.input`
  width:336px;
  height:51px;
  padding:15px;
  box-sizing:border-box;
  outline: none;
  border: 1px solid #eee;
  transition: border .3s;

  &:focus {
    border:1px solid #3b82f6;
  }
`

export default Search