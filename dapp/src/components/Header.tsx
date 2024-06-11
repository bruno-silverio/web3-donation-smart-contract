"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { doLogin } from "@/services/Web3Service";

export default function Header() {
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    setWallet(localStorage.getItem("wallet") || "");
  }, []);

  function btnLoginClick() {
    doLogin()
      .then((wallet) => setWallet(wallet))
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  }

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center ">
          <a
            href="/"
            className="d-flex align-items-center text-light text-decoration-none"
            style={{ textDecoration: "none" }}
          >
            <h1 className="fw-bold mb-0">FinancialHelp</h1>
          </a>
          <div className="text-end col-8">
            {wallet ? (
              <a href="/create" className="btn btn-warning">
                Pedir Ajuda
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light me-2 d-flex justify-content-center"
                onClick={btnLoginClick}
              >
                <Image
                  src="/metamask.svg"
                  width="24"
                  height="24"
                  className="me-2"
                  alt="MetaMask"
                />
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
