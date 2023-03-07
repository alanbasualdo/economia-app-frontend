import { useDispatch, useSelector } from 'react-redux'
import tpApi from '../api/tpApi'
import { useAuthStore } from './useAuthStore'

export const useTransactionsStore = () => {

    const { email, id } = useAuthStore()

    const addNewTransaction = async (data) => {
        console.log(data)
        const { res } = await tpApi.post('/docs', { data, id })
    }

    return {
        addNewTransaction
    }
}