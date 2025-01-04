import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'
import { doSignOut } from '../firebase/auth.js'

export function Header(){
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className='flex flex-row w-full gap-x-2 z-20 fixed top-0 left-0 h-12 place-content-center items-center bg-transparent'>
            {
                userLoggedIn
                    ?
                    <>
                        <button onClick={() => { 
                            doSignOut().
                            then(() => { 
                                navigate('/login') 
                                }) 
                            }} className='block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>Logout</button>
                    </>
                    :
                    <>
                        <Link className='block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' to={'/login'}>Login</Link>
                        <Link className='block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}