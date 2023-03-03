import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { domain } from '../env'
import Product from './Product'

const CategoriProduct = () => {
    const { id } = useParams()
    const [cataproduct, setCataproduct] = useState(null)
    useEffect(() => {
        const getcategoridata = async () => {
            await Axios({
                method: 'get',
                url: `${domain}/api/category/${id}/`
            }).then(response => {
                // console.log(response.data[0]);
                setCataproduct(response.data[0])
            })
        }
        getcategoridata()
    }, [id])
    return (
        <div className="container">
            <h1>Categori: {cataproduct?.title}</h1>
            <h2>Categori Products</h2>
            <div className="row">
                {
                    cataproduct !== null &&
                    cataproduct?.category_product.map((product, i) => (
                        <div className="col-md-3">
                            <Product item={product} key={i} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CategoriProduct
