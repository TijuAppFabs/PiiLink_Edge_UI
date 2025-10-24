import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import './MainLayout.scss';

const MainLayout = ({ children }) => {

  return (
    <div className="app-wrapper">
      <Header />
      <div className="wrapper">
        <Sidebar />
        <main className="page-content">
          <div className="page-content-inner">
            <div className="page-content-body">{children}</div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
