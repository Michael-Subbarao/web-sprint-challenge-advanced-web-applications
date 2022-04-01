import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    setMessage('Goodbye!');
    window.localStorage.removeItem('token');
    navigate('/');
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, { username, password })
      .then(response => {
        const token = response.data.token;
        window.localStorage.setItem('token', token);
        redirectToArticles
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(()=> {
        setSpinnerOn(false);
      })
  }

  const getArticles = () => {
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
      .then(response=> {
        setArticles(response.data.articles);
        setMessage(response.data.message);
      })
      .catch(error=> {
        setMessage(error?.response?.data?.message);
      })
      .finally(()=> {
        setSpinnerOn(false);
      })
  }

  const postArticle = article => {
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article)
    .then(response=> {
      setArticles([...articles, response.data.article]);
      setMessage(response.data.message);
    })
    .catch(error=> {
      setMessage(error.response.data.message | 0);
    })
    .finally(()=> {
      setSpinnerOn(false);
    })
  }

  const updateArticle = ({ article_id, article }) => {
    setCurrentArticleId(article_id)
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
    .then(response=> {
      setMessage(response.data.message)
      setArticles(articles.filter(article=> {
        return article.article_id !== article_id
      }))
    })
    .catch(error=> {
      setMessage(error.response.data.message)
    })
    .finally(()=> {
      setSpinnerOn(false)
    })
  }

  const onSubmit = article => {
    if (currentArticleId) {
      updateArticle(article)
    } else {
      postArticle(article)
    }
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on = {spinnerOn}/>
      <Message message = {message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm onSubmit = {onSubmit} article = {articles.find(article => article.article_id === currentArticleId)}/>
              <Articles getArticles={getArticles} updateCurrArticle={updateArticle} articles={articles} message = {message} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
