import React, { useEffect, useState } from 'react'
import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css";
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/userAtom';
import Loader from './Loader';
import toast, { Toaster } from 'react-hot-toast';


function AddPost() {
    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies(["user"]);
    const user = useRecoilValue(userState)
    const [edit, setEdit] = useState(false);
    const [postDetail, setPostDetail] = useState(null);
    const [content, setContent] = useState(postDetail?.body || '');

    const [image, setImage] = useState('')
    const { quill, quillRef } = useQuill();
    const [isSending, setIsSending] = useState(false)
    const [data, setData] = useState({
        title: postDetail?.title || '',
        description: postDetail?.description || ''
    })
    const { postId } = useParams()

    useEffect(() => {
        fetch(`http://localhost:5000/api/singlepost?postId=${postId.slice(1, postId.length)}`, { method: 'GET' }).then(res => res.json()).then(data => setPostDetail(data))
    }, [postId])

    const uploadImage = async () => {
        let data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "ankit_kumar")
        data.append("cloud_name", "ankit628792")
        const resp = await fetch(`https://api.cloudinary.com/v1_1/ankit628792/image/upload`, {
            method: "post",
            body: data
        })
        let res = await resp.json();
        return res.secure_url

    }
    React.useEffect(() => {
        if (postDetail) {
            setData({
                title: postDetail?.title || '',
                description: postDetail?.description || ''
            })
            setContent(postDetail.body)
        }
    }, [postDetail]);

    React.useEffect(() => {
        if (postId) {
            setEdit(true)
        }
        if (quill) {
            quill.on('text-change', () => {
                setContent(quill.root.innerHTML)
            });
        }
    }, [quill, postId]);

    const handleChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image && user) {
            const image_url = await uploadImage()
            if (image_url) {
                setIsSending(true)
                const res = await fetch('http://localhost:5000/api/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': ' application/json',
                        'token': cookies?.user
                    },
                    body: JSON.stringify({ ...data, body: content, image: image_url, userId: user._id })
                })
                if (res.status === 201) {
                    const response = await res.json()
                    toast.success('Post added successfully!')
                    setData({
                        title: '',
                        description: ''
                    })
                    setImage('')
                    setContent('');
                    navigate(`/post:${response?.postId}`)
                } else {
                    toast.error('Cannot add post!')
                }
            }
        }
        setIsSending(false)
    }
    const updatePost = async (e) => {
        e.preventDefault();
        if (user) {
            setIsSending(true)
            const res = await fetch(`http://localhost:5000/api/editpost?postId=${postDetail?.postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': ' application/json',
                    'token': cookies?.user
                },
                body: JSON.stringify({ ...data, body: content, userId: user._id })
            })
            if (res.status === 200) {
                const response = await res.json()
                toast.success('Post updated successfully!')
                navigate(`/post:${response?.postId}`)
            } else {
                toast.error('Cannot update post!')
            }
        }
        setIsSending(false)
    }
    if (!user) return <Loader />
    return (
        <div className="rounded mx-auto p-7 sm:p-10 md:px-20 max-w-xl md:max-w-3xl">
            <div><Toaster position="top-center" reverseOrder={true} /></div>
            <form onSubmit={edit ? updatePost : handleSubmit}>
                <div className="mb-1 sm:mb-2">
                    <label htmlFor="Title" className="inline-block mb-1 text-gray-800 font-medium">Title<span className="mx-1 text-red-500">*</span></label>
                    <input
                        placeholder="Title"
                        required
                        minLength={2}
                        type="text"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>
                {!edit && <div className="mb-1 sm:mb-2">
                    <label htmlFor="Banner Image" className="inline-block mb-1 text-gray-800 font-medium">Banner Image<span className="mx-1 text-red-500">*</span></label>
                    <input type="file" required name="image" accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="flex-grow w-full py-2 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:outline-none focus:shadow-outline"
                    />
                    {(image?.size > 10000000) && <p className="text-red-500 text-sm">Maximum image upload size is 10MB </p>}
                </div>}

                <div className="mb-3">
                    <label className="inline-block mb-1 text-gray-800 font-medium">Description</label>
                    <input
                        required
                        minLength={10}
                        placeholder="Short Description ..."
                        type="text"
                        name='description'
                        value={data.description}
                        onChange={handleChange}
                        className="flex-grow w-full resize-none py-2 h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:outline-none focus:shadow-outline"
                    />
                </div>
                {!edit && <div className="mb-3">
                    <label className="inline-block mb-1 text-gray-800 font-medium">Body</label>
                    <div ref={quillRef} defaultValue={content} />
                </div>
                }
                <div className="my-4 sm:my-8">
                    <button type="submit" className="px-5 py-2 text-lg font-medium text-primary hover:text-white hover:bg-primary border border-blue-400 rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer" disabled={isSending} onClick={edit ? updatePost : handleSubmit}>{edit ? (isSending ? `Updating` : `Update Post`) : (isSending ? `Adding` : `Add Post`)}</button>
                </div>
            </form>
        </div>
    )
}

export default AddPost