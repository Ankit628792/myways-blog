import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


function Post({ title, description, image, postId, time }) {
  const navigate = useNavigate();

  return (

    <div className='group max-w-xs overflow-hidden rounded-lg cursor-pointer m-4 transition hover:shadow-lg border' onClick={() => navigate(`/post:${postId}`)}>
      <img className='h-48 w-full object-cover group-hover:scale-105 transition' src={image} alt="" />
      <div className='p-4'>
        <h1 className='text-lg font-semibold text-gray-900 my-1 line-clamp-2'>{title}</h1>
        <p className='text-gray-500'>Published - {new Date(time).toDateString()}</p>
        <p className='text-base text-gray-700 my-2 line-clamp-3'>{description}</p>
        <Link to={`/post:${postId}`} className='text-primary text-hover font-medium'>Read More </Link>
      </div>
    </div>
  )
}

export default Post