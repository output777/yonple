import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const token = 683914;

const PostDetailB = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [post, setPost] = useState(null);
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/b-posts/${id}`);
      setPost(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPost();
  }, [])

  if (post) {
    return (
      <StInner>
        <StDetailContainer>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </StDetailContainer>
        <StBtn onClick={() => navigate(-1)}>
          뒤로가기
        </StBtn>
      </StInner>
    )
  }
}

const StInner = styled.div`
  width: 1000px;
  max-width: 100%;
  margin: 5rem auto;
`

const StDetailContainer = styled.div`
  border:1px solid #eee;
  padding: 2.5rem;
  margin-bottom: 1rem;

  & h2 {
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  
`
const StBtn = styled.button`
  padding: 0.75rem 2rem;
  font-weight: 500;
  border-radius: 0.375rem;
  background-color: rgba(59, 130, 246, 1);
  color: #fff;
  outline:none;
  border:none;
  transition: background 1.5s;

  &:hover {
    background-color: rgba(59, 130, 246, 0.7);
  }
  `

export default PostDetailB