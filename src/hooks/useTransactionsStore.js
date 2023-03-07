import { useDispatch } from 'react-redux'
import tpApi from '../api/tpApi'
import { useAuthStore } from './useAuthStore'
import { getTransaction } from '../store/transactionsSlice'

export const useTransactionsStore = () => {
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

    const startGetTransaction = async (id) => {
        try {
            const { data } = await tpApi.get(`/docs/${id}`)
            const docs = data.docs
            console.log(docs)
            dispatch(getTransaction(docs))
        } catch (error) {
            console.log(error)
        }
    }

    return {
        addNewTransaction,
        startGetTransaction
    }
}