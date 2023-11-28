import { Route, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Records } from "../components/Records";
import { Journal } from "./Journal ";
import { Ledger } from "./Ledger ";
import { BalanceSheet } from "./BalanceSheet";

export const MainPage = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<Journal />} />
        <Route path="/records" element={<Records />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/balancesheet" element={<BalanceSheet />} />
      </Routes>
    </>
  );
};
