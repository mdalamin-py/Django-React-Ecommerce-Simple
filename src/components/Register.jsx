import Axios from 'axios'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { domain, header2 } from '../env'

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const history = useHistory()
    const registerButton = async () => {
        if (password !== password2) {
            alert("Password not patch try agane !")
        } else {
            await Axios({
                method: "post",
                url: `${domain}/api/register/`,
                headers: header2,
                data: {
                    "username": username,
                    "password": password
                }
            }).then(response => {
                // console.log(response.data);
                if (response.data["data"]) {
                    history.push("/login")
                }
                // console.log(response.data["message"]);
                alert(response.data["message"])
            })
        }
    }
    return (
        <div className="container my-5 p-5">
            <h1>Register</h1>
            <div class="form-group">
                <label >Username</label>
                <input onChange={e => setUsername(e.target.value)} type="text" class="form-control" placeholder="Username" />
            </div>
            <div class="form-group">
                <label >Password</label>
                <input onChange={e => setPassword(e.target.value)} type="password" class="form-control" placeholder="Password" />
            </div>
            <div class="form-group">
                <label >Confirm Password</label>
                <input onChange={e => setPassword2(e.target.value)} type="password" class="form-control" placeholder="Confirm Password" />
            </div>
            <p><button onClick={registerButton} className="btn btn-success my-4">Register</button><Link to="/login">Login Now</Link></p>
        </div>
    )
}

export default Register
