import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FileUpload from "./pages/FileUpload";
import Description from "./pages/Description";
import Header from "./components/Header";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const App = () => {
  return (
    <div className="bg-[#FFEACF] w-screen h-screen sm:overflow-x-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden overflow-x-hidden">
      <Header />
      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file_upload" element={<FileUpload />} />
          <Route path="/description" element={<Description />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
