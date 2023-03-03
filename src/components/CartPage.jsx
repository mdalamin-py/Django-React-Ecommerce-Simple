import Axios from 'axios';
import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { domain } from '../env';
import { useGlobalState } from '../state/provider'

const CartPage = () => {
    const [{ cartproductf_uncomplit }, dispatch] = useGlobalState()
    // console.log(cartproductf_uncomplit?.cartproduct);
    let cart_productt_length = 0;
    if (cartproductf_uncomplit !== null) {
        cart_productt_length = cartproductf_uncomplit?.cartproduct?.length
    } else {
        cart_productt_length = 0;
    }
    const tokenget = window.localStorage.getItem('token')
    const history = useHistory()
    const updatecartproduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/updatecartproduct/`,
            headers: {
                Authorization: `token ${tokenget}`
            },
            data: { "id": id }
        }).then(response => {
            // console.log(response);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response
            })
        })
    }
    const editcartproduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/editcartproduct/`,
            headers: {
                Authorization: `token ${tokenget}`
            },
            data: { "id": id }
        }).then(response => {
            // console.log(response);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response
            })
        })
    }
    const delatecartproduct = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/delatecartproduct/`,
            headers: {
                Authorization: `token ${tokenget}`
            },
            data: { "id": id }
        }).then(response => {
            // console.log(response);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response
            })
        })
    }
    const delatefullcard = async (id) => {
        await Axios({
            method: 'post',
            url: `${domain}/api/delatefullcart/`,
            headers: {
                Authorization: `token ${tokenget}`
            },
            data: { "id": id }
        }).then(response => {
            // console.log(response);
            dispatch({
                type: "ADD_RELOADPAGE_DATA",
                reloadpage: response
            })
            dispatch({
                type: "ADD_CARTPRODUCT_UNCOMPLIT",
                cartproductf_uncomplit: null
            })
            alert("Full Cart is Delated")
            history.push('/')
        }).catch(error => {
            console.log(error);
        })
    }
    return (
        <div className="container p-3">
            {
                cart_productt_length !== 0 ?
                    <table className="table table-striped">
                        <thead>
                            <th>SN</th>
                            <th>Product</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
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
                                        <td>
                                            <button onClick={() => editcartproduct(data.id)} className="btn btn-info">-</button>
                                            <button onClick={() => delatecartproduct(data.id)} className="btn btn-danger mx-1">X</button>
                                            <button onClick={() => updatecartproduct(data.id)} className="btn btn-success">+</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="4" className="text-right" >Total</th>
                                <th>{cartproductf_uncomplit?.total}</th>
                                <th>
                                    <Link to="/order" className="btn btn-success" >OrderNow</Link>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                    :
                    (
                        <div>
                            <h1>Thare is no Card Go home and add some Product</h1>
                        </div>
                    )
            }
            <div className="row">
                <div className="col">
                    <Link to="/oldorders" className="btn btn-warning" >Old Orders</Link>
                </div>
                {
                    cart_productt_length !== 0 &&
                    <>
                        <div className="col">
                            <Link onClick={() => delatefullcard(cartproductf_uncomplit.id)} className="btn btn-danger" >Delate Card</Link>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default CartPage
