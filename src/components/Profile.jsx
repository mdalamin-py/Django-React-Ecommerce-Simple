import Axios from 'axios'
import React, { useState } from 'react'
import { domain } from '../env'
import { useGlobalState } from '../state/provider'

const Profile = () => {
    const [{ profile }, dispatch] = useGlobalState()
    // console.log(profile.prouser);
    const [image, setImage] = useState(null)
    const [firstname, setFirstname] = useState(profile?.prouser.first_name)
    const [lasename, setLasename] = useState(profile?.prouser.last_name)
    const [email, setemail] = useState(profile?.prouser.email)
    const uploadimage = async () => {
        const formdata = new FormData()
        formdata.append('image', image)
        await Axios({
            method: "post",
            url: `${domain}/api/updateprofile/`,
            headers: {
                Authorization: `token ${window.localStorage.getItem('token')}`
            },
            data: formdata
        }).then(response => {
            // console.log(response.data["message"]);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response.data
            })
            alert(response.data["message"])
        })

    }
    const updatedata = async () => {
        await Axios({
            method: "post",
            url: `${domain}/api/updateuser/`,
            headers: {
                Authorization: `token ${window.localStorage.getItem('token')}`
            },
            data: {
                "first_name": firstname,
                "last_name": lasename,
                "email": email
            }
        }).then(response => {
            // console.log(response.data["message"]);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response.data
            })
            alert(response.data["message"])
        })

    }
    return (
        <div className="container">
            <div class="content-section">
                <div class="media">
                    <img class="rounded-circle account-img" src={`${domain}${profile?.image}`} />
                    <div class="media-body">
                        <h2 class="account-heading">{profile?.prouser.username}</h2>
                        <small class="form-text text-muted">Username name is Fiexd</small>
                        <p class="text-secondary">{profile?.prouser.email}</p>
                        <p>{profile?.prouser.first_name} {profile?.prouser.last_name}</p>
                    </div>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <fieldset class="form-group">
                        <legend class="border-bottom mb-4">Profile Info</legend>
                        <div class="form-group">
                            <label>Uplode Profile Picture</label>
                            <div class="row">
                                <div class="col">
                                    <input onChange={(e) => setImage(e.target.files[0])} type="file" class="form-control" />
                                </div>
                                <div class="col">
                                    <p onClick={uploadimage} className="btn btn-info">Upload</p>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" class="form-control" onChange={(e) => setFirstname(e.target.value)} value={firstname} />
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" class="form-control" onChange={(e) => setLasename(e.target.value)} value={lasename} />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" onChange={(e) => setemail(e.target.value)} value={email} />
                        </div>
                    </fieldset>
                    <div class="form-group">
                        <p class="btn btn-outline-info" onClick={updatedata}>Update</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile
