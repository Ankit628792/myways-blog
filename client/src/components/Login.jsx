import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [cookies, setCookie] = useCookies(["user"]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const res = await fetch('https://myways-blog-by-ak.herokuapp.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': ' application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.status == 200) {
            const response = await res.json()
            setCookie("user", response?.token, {
                path: "/"
            });
            navigate('/')
        }

        setIsLoading(false)
    }
    return (
        <section className="signin">

            <div className="contentBx">
                <div className="formBx">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="inputBx">
                            <span>Email</span>
                            <input onChange={handleChange} type="email" required name='email' />
                        </div>
                        <div className="inputBx">
                            <span>Password</span>
                            <input onChange={handleChange} type="password" required name='password' minLength={6} />
                        </div>

                        <div className="inputBx" onClick={handleSubmit}>
                            <input type="submit" value={isLoading ? `Validating...` : 'Login'} />
                        </div>
                        <div className="inputBx">
                            <p>Don't have an account? <Link className="signupnav" to="/register">Sign up</Link></p>
                        </div>

                    </form>


                </div>
            </div>

            <div className="imgBx">
                <img src="https://images.unsplash.com/photo-1573580296036-ef22f9cf31e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
        </section>
    )
}

export default Login