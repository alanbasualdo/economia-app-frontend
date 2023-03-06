import { useDispatch, useSelector } from 'react-redux'
import tpApi from '../api/tpApi'
import { useAuthStore } from './useAuthStore'

export const useTransactionsStore = () => {

    const { email } = useAuthStore()

    const addNewTransaction = async (data) => {
        const { res } = await tpApi.post('/docs', { data, email })
        console.log(res)
    }

    return {
        addNewTransaction
    }
}