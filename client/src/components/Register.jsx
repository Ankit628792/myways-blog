import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  })
  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password === data.confirm_password) {
      setIsLoading(true)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': ' application/json'
        },
        body: JSON.stringify(data)
      })
      if (res.status == 201) {
        navigate('/login')
      }
    }
    else {
      window.alert("Password doesn't match! ")
    }
    setIsLoading(false)
  }

  return (
    <section className="signin">
      <div className="imgBx">
        <img src="https://images.unsplash.com/photo-1573580296036-ef22f9cf31e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="" />
      </div>

      <div className="contentBx">
        <div className="formBx">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="inputBx">
              <span>Full Name</span>
              <input onChange={handleChange} value={data.name} type="text" name="name" required />
            </div>
            <div className="inputBx">
              <span>Email</span>
              <input onChange={handleChange} type="email" value={data.email} name='email' required />
            </div>
            <div className="inputBx">
              <span>Phone number</span>
              <input onChange={handleChange} type="tel" value={data.phone} name='phone' minLength={10} />
            </div>
            <div className="inputBx">
              <span>Password</span>
              <input onChange={handleChange} type="password" value={data.password} minLength={6} name='password' required />
            </div>
            <div className="inputBx">
              <span>Confirm Password</span>
              <input onChange={handleChange} type="password" value={data.confirm_password} minLength={6} name='confirm_password' required />
            </div>

            <div className="inputBx" onClick={handleSubmit}>
              <input type="submit" value={isLoading ? `Validating...` : 'Register'} />
            </div>
            <div className="inputBx">
              <p>Already have an account? <Link className="signupnav" to="/login">Login</Link></p>
            </div>

          </form>


        </div>
      </div>
    </section>
  )
}

export default Register