import React, { useEffect, useState } from 'react'
import HTMLReactParser from 'html-react-parser';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from 'react-cookie';


function SinglePost() {
  const navigate = useNavigate()
  const [post, setPost] = useState()
  const [comments, setComments] = useState()
  const [like, setLike] = useState(false)
  const [cookies, setCookie] = useCookies(["user"]);
  const user = useRecoilValue(userState)
  const [isSending, setIsSending] = useState(false)
  const [data, setData] = useState({ message: '' })
  const { postId } = useParams()
  useEffect(() => {
    fetch(`http://localhost:5000/api/singlepost?postId=${postId.slice(1, postId.length)}`, { method: 'GET' }).then(res => res.json()).then(data => setPost(data))
    fetch(`http://localhost:5000/api/post/comment?postId=${postId.slice(1, postId.length)}`, { method: 'GET' }).then(res => res.json()).then(data => setComments(data))
  }, [postId])

  const delPost = async () => {
    const res = await fetch(`http://localhost:5000/api/delpost?postId=${post?.postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': ' application/json',
        'token': cookies?.user
      }
    })
    if (res.status == 200) {
      navigate('/')
    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      setIsSending(true)
      const res = await fetch('http://localhost:5000/api/post/comment', {
        method: 'POST',
        headers: {
          'Content-Type': ' application/json',
          'token': cookies?.user
        },
        body: JSON.stringify({ ...data, name: user.name, email: user.email, postId: post?.postId })
      })
      if (res.status === 201) {
        toast.success('Comment added successfully!')
        setData({ message: '' })
      } else {
        toast.error('Cannot add comment!')
      }
    }
    setIsSending(false)
  }

  if (!post) return <Loader />
  return (
    <div className='max-w-4xl mx-auto bg-gray-50 my-5'>
      <div><Toaster position="top-center" reverseOrder={true} /></div>
      {post?.user == user?._id && <div className='w-full flex items-center justify-center gap-x-10 mb-5'>
        <button onClick={() => navigate(`/post/edit:${post?.postId}`)} className='px-5 py-2 text-lg font-medium text-white bg-primary rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer'>
          Edit Post
        </button>
        <button onClick={delPost} className='px-5 py-2 text-lg font-medium text-primary hover:text-white hover:bg-primary border border-blue-400 rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer'>
          Delete Post
        </button>
      </div>}
      <img className="h-96 object-cover w-full rounded" src={post?.image} alt="" />
      <article className="max-w-4xl mx-auto p-5">
        <h1 className="text-3xl my-3 font-semibold">{post?.title}</h1>
        <p className="tet-xl font-light text-gray-600 mb-2">{post?.description}</p>
        <p className="text-sm font-light">Blog post Published at {new Date(post.createdAt).toDateString()}</p>

        {/* <div className="flex items-center space-x-2">
          <div className='rounded-full w-10 h-10 grid place-items-center bg-primary text-white border border-teal-100 p-1 text-2xl shadow-md flex-shrink-0'>
            A
          </div>
        </div> */}

        <div className="mt-5 blog__desc">
          {HTMLReactParser(post?.body)}
        </div>
      </article>

      <div className='flex gap-5 '>
        <div className='flex space-x-2 text-xl items-center' onClick={() => setLike(!like)}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 cursor-pointer mx-2 ${like ? 'text-red-400' : 'text-gray-500'} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {post?.likes}
          Likes
        </div>
        <div className='flex space-x-2 text-xl items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-2 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          Comments
        </div>
      </div>
      <div className='my-5'>
        {comments?.length > 0 ? comments?.map((comment) =>
          <div key={comment._id}>
            <p className="text-gray-700 break-all"><span className="text-yellow-500 text-lg font-medium">{comment.name} :</span> {comment.message}</p>
          </div>
        )
          :
          <h1 className="text-lg font-medium">Be the first to comment</h1>}

      </div>

      <form className='p-5 max-w-xl mx-auto' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-semibold text-gray-800 my-3'>Add your comment</h1>
        <div className="mb-1 sm:mb-2">
          <textarea
            placeholder="Enter your comment here..."
            required
            minLength={2}
            type="text"
            name="message"
            value={data.message}
            onChange={handleChange}
            className="flex-grow w-full resize-none h-40 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:outline-none focus:shadow-outline"
          >

          </textarea>
          <div className="my-4">
            <button type="submit" className="px-5 py-2 text-lg font-medium text-primary hover:text-white hover:bg-primary border border-blue-400 rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer" disabled={isSending} onClick={handleSubmit}>{user ? (isSending ? `Adding` : `Add Comment`) : 'Login to comment'}</button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default SinglePost