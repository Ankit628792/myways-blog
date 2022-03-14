import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Routes, Route } from 'react-router-dom'
import { useRecoilState } from 'recoil';
import { userState } from './atoms/userAtom';
import { AddPost, Footer, Header, Loader, Login, Posts, Register, SinglePost } from './components';

function App() {
  const [isLoading, setisLoading] = useState(false)
  const [user, setUser] = useRecoilState(userState)
  const [cookies, setCookie] = useCookies(["user"] || null);

  async function hello() {
    setisLoading(true)
    const res = await fetch('/api/session', {
      method: 'GET',
      headers: {
        'Content-Type': ' application/json',
        'token': cookies?.user
      }
    })
    if (res.status == 200) {
      const response = await res.json()
      setUser(response)
    }
    setisLoading(false)
  }
  useEffect(() => {
    cookies?.user && hello()
  }, [])

  if (isLoading) return <Loader />

  return (
    <div className="App w-full max-w-7xl mx-auto">
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Posts />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/post:postId' element={<SinglePost />} />
          <Route path='/post/add' element={<AddPost />} />
          <Route path='/post/edit:postId' element={<AddPost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
