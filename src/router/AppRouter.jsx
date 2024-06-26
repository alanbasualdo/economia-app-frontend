import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuthStore'
import { LoginPage } from '../pages/LoginPage'
import { MainPage } from '../pages/MainPage'
import { RegisterPage } from '../pages/RegisterPage'

export const AppRouter = () => {

    const { status, checkAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <>
            <Routes>
                {
                    (status !== 'auth')
                        ?
                        <>
                            <Route path='/register' element={<RegisterPage />} />
                            <Route path='/login' element={<LoginPage />} />
                            <Route path='*' element={<LoginPage />} />
                        </>
                        : <>
                            <Route path='*' element={<MainPage />} />
                        </>
                }
            </Routes>
        </>
    )
}
