import Axios from 'axios'
import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import CartPage from './components/CartPage'
import CategoriProduct from './components/CategoriProduct'
import HomePage from './components/HomePage'
import Login from './components/Login'
import NavBar from './components/NavBar'
import Oldorders from './components/Oldorders'
import OldordersDetails from './components/OldordersDetails'
import Order from './components/Order'
import ProductDetails from './components/ProductDetails'
import Profile from './components/Profile'
import Register from './components/Register'
import { domain } from './env'
import { useGlobalState } from './state/provider'

const App = () => {
  const [{ profile, reloadpage }, dispatch] = useGlobalState()
  const tokenget = window.localStorage.getItem('token')
  useEffect(() => {
    if (tokenget !== null) {
      const getdata = async () => {
        await Axios({
          method: "get",
          url: `${domain}/api/profile/`,
          headers: {
            Authorization: `token ${tokenget}`
          }
        }).then(res => {
          let user = res.data['data']
          // console.log(user)
          dispatch({
            type: "ADD_PROFILE",
            profile: user
          }
          )
        })
          .catch(e => {
            // console.log(e)
            dispatch({
              type: "ADD_PROFILE",
              profile: null
            })

          }
          )

      }
      getdata()
    }

  }, [reloadpage])
  useEffect(() => {
    if (profile !== null) {
      const getdata = async () => {
        await Axios({
          method: "get",
          url: `${domain}/api/cart/`,
          headers: {
            Authorization: `token ${tokenget}`
          }
        }).then(res => {
          // console.log(res.data);
          {
            const all_data = []
            res?.data.map(data => {
              if (data.complit) {
                all_data.push(data)
                dispatch({
                  type: "ADD_CARTPRODUCT_COMPLIT",
                  cartproduct_complit: all_data
                })
                // console.log(true);
              }
              else {
                dispatch({
                  type: "ADD_CARTPRODUCT_UNCOMPLIT",
                  cartproductf_uncomplit: data
                })
                // console.log(false)
              }
            })
          }
        })
      }
      getdata()
    }
  }, [reloadpage])
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/product/:id' component={ProductDetails} />
        <Route exact path='/categori/:id' component={CategoriProduct} />
        {
          profile !== null ? (
            <>
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/cart' component={CartPage} />
              <Route exact path='/order' component={Order} />
              <Route exact path='/oldorders' component={Oldorders} />
              <Route exact path='/oldorders/:id' component={OldordersDetails} />
            </>
          ) :
            (
              <>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
              </>
            )
        }
        <Route exact component={HomePage} />
      </Switch>
    </BrowserRouter>

  )
}


export default App
