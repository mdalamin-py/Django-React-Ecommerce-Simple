import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../state/provider'

const NavBar = () => {
    const [{ profile, cartproductf_uncomplit }, dispatch] = useGlobalState()

    let cart_productt_length = 0;
    if (cartproductf_uncomplit !== null) {
        cart_productt_length = cartproductf_uncomplit?.cartproduct?.length
    } else {
        cart_productt_length = 0;
    }

    const logoutbutton = () => {
        window.localStorage.clear()
        dispatch({
            type: "ADD_PROFILE",
            profile: null
        })
        window.location.href = "/"
    }
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar_class">
            <div className="container">
                <Link class="navbar-brand" to='/'>Ecommerce</Link>
                <ul class="navbar-nav mr-auto">
                    {
                        profile !== null ? (
                            <>
                                <li class="nav-item">
                                    <Link to="/cart" class="btn btn-dark">
                                        <i class="fas fa-cart-plus"></i>
                                        <span>({cart_productt_length})</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/profile" class="nav-link active btn-dark">Profile</Link>
                                </li>
                                <li class="nav-item">
                                    <Link onClick={logoutbutton} class="nav-link active btn-dark">Logout</Link>
                                </li>
                            </>
                        ) :
                            (
                                <li class="nav-item">
                                    <Link to="/login" class="nav-link  active btn-dark">Login</Link>
                                </li>
                            )
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
