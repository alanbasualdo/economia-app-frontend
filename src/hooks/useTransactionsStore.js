import { useDispatch, useSelector } from 'react-redux'
import tpApi from '../api/tpApi'
import { useAuthStore } from './useAuthStore'
import { getTransaction } from '../store/transactionsSlice'

export const useTransactionsStore = () => {
    const { transactions } = useSelector(state => state.transactions)
    const { id } = useAuthStore()
    const dispatch = useDispatch()

    const addNewTransaction = async (data) => {
        try {
            const resp = await tpApi.post('/docs', { data, id })
            if (resp.data.msg === 'ok') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Guardado correctamente!',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const startGetTransaction = async () => {
        try {
            const { data } = await tpApi.get(`/docs/${id}`)
            const transactions = data.docs
            dispatch(getTransaction(transactions))
        } catch (error) {
            console.log(error)
        }
    }

    return {
        transactions,

        addNewTransaction,
        startGetTransaction
    }
}