import { Route, Routes } from 'react-router-dom'
import { Create } from '../components/Create'
import { Navbar } from '../components/Navbar'
import { Records } from '../components/Records'

export const MainPage = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path='*' element={<Create />} />
                <Route path='/records' element={<Records />} />
            </Routes>
        </>
    )
}
