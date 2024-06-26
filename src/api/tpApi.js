import axios from 'axios'
import { getEnvVariables } from '../helpers/getEnvVariables'

const { VITE_API_URL } = getEnvVariables()

const tpApi = axios.create({
    baseURL: VITE_API_URL
})

tpApi.interceptors.request.use(config => {

    config.headers = {
        ...config.headers,
        'token': localStorage.getItem('token')
    }

    return config
})

export default tpApi