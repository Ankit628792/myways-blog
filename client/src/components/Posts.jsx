import React, { useEffect, useState } from 'react'
import Post from './Post.jsx'

function Posts() {
  const [posts, setPosts] = useState()
  useEffect(() => {
    fetch('https://myways-blog-by-ak.herokuapp.com/api/allposts', { method: 'GET' }).then(res => res.json()).then(data => setPosts(data)).catch(e => console.log(e))
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap3 md:gap-6 p-2 md:p-6 lg:p-10 place-items-center'>
      {posts?.map(item => <Post key={item?._id} title={item?.title} description={item?.description} image={item.image} postId={item.postId} time={item?.createdAt} />)}
    </div>
  )
}

export default Posts