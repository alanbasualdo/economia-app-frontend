import { useEffect } from "react"
import { useTransactionsStore } from "../hooks/useTransactionsStore"

export const Records = () => {
  const { startGetTransaction } = useTransactionsStore()

  useEffect(() => {
    startGetTransaction()
  }, [])

  return (
    <div className="m-3">
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action list-group-item-light">A simple light list group item</a>
      </div>
    </div>
  )
}