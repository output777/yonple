import axios from 'axios';
import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const targetStyle = { width: "100%", height: "200px" };
const token = 683914;

const Post = () => {
  const [input, setInput] = useState('');
  const [debounceInput, setDebounceInput] = useState('');
  const [delay, setDelay] = useState(150);

  const [selectPost, setSelectPost] = useState(false);
  const [aPost, setAPost] = useState([]);
  const [bPost, setBPost] = useState([]);
  const [searchApost, setSearchApost] = useState([]);
  const [searchBpost, setSearchBpost] = useState([]);
  const [apageNumber, setApageNumber] = useState(0);
  const [bpageNumber, setBpageNumber] = useState(0);
  const [searchApageNumber, setSearchApageNumber] = useState(1);
  const [searchBpageNumber, setSearchBpageNumber] = useState(1);

  const aRef = useRef();
  const bRef = useRef();
  const targetARef = useRef(null);
  const targetBRef = useRef(null);
  const targetSearchARef = useRef(null);
  const targetSearchBRef = useRef(null);

  const loadPageA = () => setApageNumber(prev => prev + 1);
  const loadPageB = () => setBpageNumber(prev => prev + 1);
  const loadSearchPageA = () => setSearchApageNumber(prev => prev + 1);
  const loadSearchPageB = () => setSearchBpageNumber(prev => prev + 1);


  const serchFuncA = async (search) => {
    if (search.length !== 0) {
      try {
        const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/a-posts?page=0&search=${search}`);
        setSearchApost(() => [...data]);

      } catch (error) {
        console.error(error);
      }
    }
  }

  const serchFuncB = async (search) => {
    if (search.length !== 0) {
      try {
        const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/b-posts?page=0&search=${search}`);
        setSearchBpost(() => [...data]);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const inputHandler = (e) => {
    const { value } = e.target;

    if (input !== value) {
      setSearchApageNumber(1);
      setSearchBpageNumber(1);
    }
    setInput(value);
  }

  useEffect(() => {
    if (debounceInput !== '') {
      if (!selectPost) {
        serchFuncA(debounceInput);
      } else {
        serchFuncB(debounceInput);
      }
    } else {
      setSearchApageNumber(1);
      setSearchBpageNumber(1);
    }
  }, [debounceInput]);

  // debounce
  useEffect(() => {
    const debounce = setTimeout(() => {
      return setDebounceInput(input);
    }, delay);

    return () => clearTimeout(debounce);
  }, [input, delay])



  const aPostHandler = () => {
    aRef.current.classList.add('active');
    bRef.current.classList.remove('active');
    setSelectPost(false);
  }

  const bPostHandler = () => {
    aRef.current.classList.remove('active');
    bRef.current.classList.add('active');
    setSelectPost(true);
  }


  const fetchAposts = async () => {
    try {
      const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/a-posts?page=${apageNumber}`);
      setAPost((prev) => [...prev, ...data]);
      loadPageA();
    } catch (error) {
      console.error(error);
    }
  }


  const fetchBposts = async () => {
    try {
      const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/b-posts?page=${bpageNumber}`);
      setBPost((prev) => [...prev, ...data]);
      loadPageB();
    } catch (error) {
      console.error(error);
    }
  }

  const fetchSearchAposts = async () => {
    try {
      const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/a-posts?page=${searchApageNumber}&search=${input}`);
      setSearchApost((prev) => [...prev, ...data]);
      loadSearchPageA();
    } catch (error) {
      console.error(error);
    }
  }

  const fetchSearchBposts = async () => {
    try {
      const { data } = await axios.get(`https://recruit-api.yonple.com/recruit/${token}/b-posts?page=${searchBpageNumber}&search=${input}`);
      setSearchBpost((prev) => [...prev, ...data]);
      loadSearchPageB();
    } catch (error) {
      console.error(error);
    }
  }


  // 인터섹션 callback
  const onIntersectA = async (entries, observer) => {
    if (entries[0].isIntersecting) {
      if (apageNumber >= 10) {
        return observer.unobserve(targetARef.current);
      }
      await fetchAposts();
    }
  }

  const onIntersectB = async (entries, observer) => {
    if (entries[0].isIntersecting) {
      if (bpageNumber >= 10) {
        return observer.unobserve(targetBRef.current);
      }
      await fetchBposts();
    }
  }

  const onIntersectSearchA = async (entries, observer) => {
    if (entries[0].isIntersecting) {
      if (searchApageNumber >= 10) {
        return observer.unobserve(targetSearchARef.current);
      }
      await fetchSearchAposts();
    }
  }

  const onIntersectSearchB = async (entries, observer) => {
    if (entries[0].isIntersecting) {
      if (searchBpageNumber >= 10) {
        return observer.unobserve(targetSearchBRef.current);
      }
      await fetchSearchBposts();
    }
  }

  // 옵저버 등록
  useEffect(() => {
    if (input.length === 0) {
      let observer;
      if (!selectPost) {
        observer = new IntersectionObserver(onIntersectA, { threshold: 0.5 });
        observer.observe(targetARef.current);
      } else {
        observer = new IntersectionObserver(onIntersectB, { threshold: 0.5 });
        observer.observe(targetBRef.current);
      }
      return () => observer.disconnect();
    } else {
      let observer;
      if (!selectPost) {
        observer = new IntersectionObserver(onIntersectSearchA, { threshold: 0.5 });
        observer.observe(targetSearchARef.current);
      } else {
        observer = new IntersectionObserver(onIntersectSearchB, { threshold: 0.5 });
        observer.observe(targetSearchBRef.current);
      }
      return () => observer.disconnect();
    }
  }, [selectPost, aPost, bPost, input, searchApost, searchBpost])


  return (
    <>
      <StInput type='text' placeholder='검색어를 입력하세요' value={input} onChange={inputHandler} />
      <StPostTaps>
        <button className='a active' ref={aRef} onClick={aPostHandler}>A Posts</button>
        <button className='b' ref={bRef} onClick={bPostHandler}>B Posts</button>
      </StPostTaps>
      {input.length === 0 ? !selectPost
        ?
        <StPostContainer>
          {aPost.map((item) => (
            <Link to={`/a?id=${item.id}`} key={'a' + item.id}>
              <div id={item.id}>
                <h3><span>{item.id}.</span> {item.title}</h3>
                <p>{item.content}</p>
              </div>
            </Link>
          ))}
          <div ref={targetARef} style={targetStyle}></div>
        </StPostContainer>
        :
        <StPostContainer>
          {bPost.map((item) => (
            <Link to={`/b?id=${item.id}`} key={'b' + item.id}>
              <div id={item.id}>
                <h3><span>{item.id}.</span> {item.title}</h3>
                <p>{item.content}</p>
              </div>
            </Link>
          ))}
          <div ref={targetBRef} style={targetStyle}></div>
        </StPostContainer>
        : !selectPost
          ?
          <StPostContainer>
            {searchApost.map((item) => (
              <Link to={`/a?id=${item.id}`} key={'searchA' + item.id}>
                <div id={item.id}>
                  <h3><span>{item.id}.</span> {item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </Link>
            ))}
            <div ref={targetSearchARef} style={targetStyle}></div>
          </StPostContainer>
          :
          <StPostContainer>
            {searchBpost.map((item) => (
              <Link to={`/b?id=${item.id}`} key={'searchB' + item.id}>
                <div id={item.id}>
                  <h3><span>{item.id}.</span> {item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </Link>
            ))}
            <div ref={targetSearchBRef} style={targetStyle}></div>
          </StPostContainer>
      }
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

const StPostTaps = styled.div`
  width: 930px;
  height:43px;
  border-bottom: 1px solid #eee;
  margin:0 auto 7px auto;
  display: flex;
  box-sizing:border-box;

  & button {
    padding:10.5px;
    background:none;
    border:none;
  }

  & button.active {
    color: #3b82f6;
  }
`

const StPostContainer = styled.ul`
  border: 1px solid rgba(0,0,0,.06);
  width: 930px;
  padding:17.5px;
  height:auto;
  box-sizing:border-box;
  margin: auto;

  & a {
    text-decoration: none;
    color: #111;
  }

  & div {
    width:893px;
    text-align: left;
    padding:17.5px;
    box-sizing:border-box;
    transition: background 0.3s;

    h3{
      margin:0;
    }
    h3 span {
      color: #3b82f6;
    }

    p {
      height:60.03px;
      white-space: normal;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow: hidden;
      box-sizing:border-box;
      margin:0;
    }
  }

  & div:hover {
    cursor: pointer;
    background: rgba(0,0,0,0.03);
  }
`

export default Post