import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { domain } from '../env'

const Oldorders = () => {
    const tokenget = window.localStorage.getItem('token')
    const [orders, setOrders] = useState(null)
    // console.log(orders);
    const [reload, setReload] = useState(null);
    useEffect(() => {
        const getorder = async () => {
            await Axios({
                method: 'get',
                url: `${domain}/api/orders/`,
                headers: {
                    Authorization: `token ${tokenget}`
                }
            }).then(response => {
                // console.log(response.data);
                setOrders(response.data)
            })
        }
        getorder()
    }, [reload])
    const delateorderhistory = async (id) => {
        await Axios({
            method: "delete",
            url: `${domain}/api/orders/${id}/`,
            headers: {
                Authorization: `token ${tokenget}`
            }
        }).then((res) => {
            // console.log(res.data);
            setReload(res.data)
        })
    }
    return (
        <div className="container">
            <h1>Orders History</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Totla</th>
                        <th>Product</th>
                        <th>Order Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders?.length !== 0 ?
                            orders?.map((order, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>TK. {order?.total}</td>
                                    <td>{order?.cartproduct?.length}</td>
                                    <td>{order?.order_status}</td>
                                    <td><Link to={`/oldorders/${order.id}`} className="btn btn-success">Details</Link></td>
                                    <td><p onClick={() => delateorderhistory(order.id)} className="btn btn-danger">Delate</p></td>
                                </tr>
                            )) :
                            (
                                <div>
                                    <h1 className="display-1">
                                        No Old Order
                                    </h1>
                                    <Link to="/" className="btn btn-info">GO HOME</Link>
                                </div>
                            )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Oldorders
