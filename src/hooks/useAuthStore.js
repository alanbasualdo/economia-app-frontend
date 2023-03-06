import { useDispatch, useSelector } from 'react-redux'
import tpApi from '../api/tpApi'
import { onChecking, onLogin, onLogout } from "../store/authSlice"

export const useAuthStore = () => {

    const { status, email } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking())
        try {
            const { data } = await tpApi.post('/login', { email, password })
            if (data.msg === 'NotRegisteredEmail') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Email no existe',
                    showConfirmButton: false,
                    timer: 1000
                })
                return dispatch(onLogout())
            } else if (data.msg === 'InvalidPassword') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Contraseña incorrecta',
                    showConfirmButton: false,
                    timer: 1000
                })
                return dispatch(onLogout())
            } else if (data.msg === 'LogOk') {
                localStorage.setItem('token', data.token)
                localStorage.setItem('token-init-date', new Date().getTime())
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Ha ingresado correctamente',
                    showConfirmButton: false,
                    timer: 1000
                })
                dispatch(onLogin(data))
            }
        } catch (error) {
            dispatch(onLogout())
        }
    }

    const startRegister = async ({ email, password }) => {
        dispatch(onChecking())
        try {
            const { data } = await tpApi.post('/register', { email, password })
            if (data.msg === 'UserCrated') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario creado correctamente!',
                    showConfirmButton: false,
                    timer: 1000
                })
                setTimeout(() => {
                    return window.location = "/login"
                }, '1100')
            } else if (data.msg === 'EmailAlreadyRegistered') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'El email ya se encuentra registrado',
                    showConfirmButton: false,
                    timer: 1000
                })
                return dispatch(onLogout())
            }
        } catch (error) {
            dispatch(onLogout())
        }
    }

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (!token) return dispatch(onLogout())
        try {
            const { data } = await tpApi.get('/renew')
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())
            dispatch(onLogin(data))
        } catch (error) {
            localStorage.clear()
            dispatch(onLogout())
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch(onLogout())
    }

    return {
        // Propiedades
        status,
        email,

        // Métodos
        startLogin,
        startRegister,
        checkAuth,
        startLogout
    }
}