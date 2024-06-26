import { createSlice } from '@reduxjs/toolkit'

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    status: null
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload)
    },
    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload)
    },
    updateTransaction: (state, action) => {
      const { id, ...newTransaction } = action.payload
      const index = state.transactions.findIndex(transaction => transaction.id === id)
      state.transactions[index] = { ...state.transactions[index], ...newTransaction }
    },
    getTransaction: (state, { payload = [] }) => {
      state.transactions = payload,
      state.status = 'loaded'
    }
  }
})

export const { addTransaction, removeTransaction, updateTransaction, getTransaction } = transactionsSlice.actions