"use client";

import { useEffect, useState } from "react";
import { getOpenRequests } from "@/services/Web3Service";

import Request from "@/components/Request";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type RequestType = {
  id: number,
  title: string,
  description: string,
  contact: string,
  goal: number
};

export default function Home() {
  const [requests, setRequests] = useState<RequestType[]>([]);

  useEffect(() => {
    loadRequests(0);
  }, []);

  async function loadRequests(lastId: number) {
    try {
      const result = await getOpenRequests(lastId);
      console.log(result);
      if (lastId === 0) setRequests(result);
      else {
        setRequests((prevRequests) => [...prevRequests, ...result]);
      }
    } catch (err) {
      console.error(err);
      
      if (err instanceof Error) {
        alert(err.message); // e is narrowed to Error!
      }
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="row ps-5">
          <p className="lead m-4">Ajude as pessoas a relizar seus sonhos!</p>
        </div>
        <div className="p-4 mx-5">
          <div className="list-group">
            {requests && requests.length ? (
              requests.map((rq) => <Request key={rq.id} data={rq} />)
            ) : (
              <>
                Conecte sua carteira MetaMask no botão Entrar para ajudar ou pedir ajuda.
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
