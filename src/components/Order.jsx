import Axios from 'axios'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { domain } from '../env'
import { useGlobalState } from '../state/provider'

const Order = () => {
    const [{ cartproductf_uncomplit }, dispatch] = useGlobalState()
    // console.log(cartproductf_uncomplit?.id);
    const [address, setAddress] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const history = useHistory()
    const orderData = {
        "cartId": cartproductf_uncomplit?.id,
        "address": address,
        "mobile": mobile,
        "email": email
    }
    const tokenget = window.localStorage.getItem('token')
    const ordernow = async () => {
        Axios({
            method: "post",
            url: `${domain}/api/orders/`,
            headers: {
                Authorization: `token ${tokenget}`
            },
            data: orderData
        }).then(response => {
            // console.log(response.data);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response
            })
            dispatch({
                type: "ADD_CARTPRODUCT_UNCOMPLIT",
                cartproductf_uncomplit: null
            })
            history.push('/oldorders')
        })
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 p-2">
                    <table className="table table-striped">
                        <thead>
                            <th>SN</th>
                            <th>Product</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </thead>
                        <tbody>
                            {
                                cartproductf_uncomplit?.cartproduct.map((data, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{data.product[0].title}</td>
                                        <td>{data.price}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.subtotal}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="4" className="text-right" >Total</th>
                                <th>{cartproductf_uncomplit?.total}</th>
                            </tr>
                            <Link to='/cart/' className="btn btn-outline-secondary" >Edit Cart</Link>
                        </tfoot>
                    </table>
                </div>
                <div className="col-md-6">
                    <h1>Order Now</h1>
                    <div>
                        <div className="form-group">
                            <label>Address</label>
                            <input onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" placeholder="Address" />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input onChange={(e) => setMobile(e.target.value)} type="text" className="form-control" placeholder="Mobile" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" placeholder="Email" />
                        </div>
                        <button className="btn btn-info" onClick={ordernow}>Order</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order