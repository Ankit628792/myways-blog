import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from "recoil"
import { userState } from '../atoms/userAtom';

function Header() {
    const [user, setUser] = useRecoilState(userState)
    const [cookies, setCookie] = useCookies(["user"]);

    const navigate = useNavigate()
    const logout = async () => {
        setCookie('user', null)
        setUser(null)
        fetch('http://localhost:5000/api/logout', {
            method: 'DELETE',
            headers: {
                'Content-Type': ' application/json',
                'token': cookies?.user
            }
        })
        navigate('/')
    }


    return (
        <header className='flex items-center px-5 sm:px-10 w-full justify-between py-5 '>
            <div className='text-3xl font-bold text-primary text-hover'>
                <Link to='/'>
                    <h1>MyWays</h1>
                </Link>
            </div>
            <nav className='flex items-center gap-x-5'>
                {user?.name ?
                    <>
                        <Link to='/post/add'>
                            <button className='px-5 py-2 text-lg font-medium text-white bg-primary rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer'>
                                Add Post
                            </button>
                        </Link>
                        <div className='flex justify-center items-center text-sm space-x-2 cursor-pointer' onClick={logout}>
                            <div className='rounded-full w-12 h-12 grid place-items-center bg-primary text-white border border-teal-100 p-1 text-2xl shadow-md flex-shrink-0'>
                                {user.name[0]}
                            </div>
                            <div className='font-medium  hidden sm:inline-block'>
                                <p>{user.name}</p>
                                <p className='text-hover cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </> :
                    <>
                        <Link to='/login'>
                            <button className='px-5 py-2 text-lg font-medium text-primary hover:text-white hover:bg-primary border border-blue-400 rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer'>
                                Login
                            </button>
                        </Link>
                        <Link to='/register'>
                            <button className='px-5 py-2 text-lg font-medium text-white bg-primary rounded-3xl bg-hover transition-all duration-150 ease-out cursor-pointer'>
                                Register
                            </button>
                        </Link>
                    </>
                }
            </nav>
        </header>
    )
}

export default Header