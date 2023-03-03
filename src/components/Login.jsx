import Axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { domain, header2 } from '../env'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const loginbutton = () => {
        Axios({
            url: `${domain}/api/login/`,
            method: "post",
            headers: header2,
            data: {
                "username": username,
                "password": password
            }
        }).then(response => {
            window.localStorage.setItem('token', response.data['token'])
            window.location.href = "/"
        }).catch(eee => {
            alert("Username OR Password is invalid Try Agane !!")
            // console.log(eee);
        })
    }
    return (
        <div className="container my-5 p-5">
            <h1>Login</h1>
            <div class="form-group">
                <label >Username</label>
                <input onChange={e => setUsername(e.target.value)} type="text" class="form-control" placeholder="Username" />
            </div>
            <div class="form-group">
                <label >Password</label>
                <input onChange={e => setPassword(e.target.value)} type="password" class="form-control" placeholder="Password" />
            </div>
            <p><button onClick={loginbutton} className="btn btn-success my-4">Login</button><Link to="/register">Register Now</Link></p>
        </div>
    )
}

export default Login
