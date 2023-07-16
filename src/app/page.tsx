"use client";

import Image from "next/image";
import Proposal from "@/components/Proposal";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { binaryContract, multiContract} from "@/services/blockchainService";
export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum || "http://localhost:8545");

      async function getAccount() {
        // const binaryProposalCount = await binaryContract(web3)
        //   .methods.proposalCount()
        //   .call();

        const binaryProposalCount = 2;
        Promise.all(
          Array(binaryProposalCount).fill(0).map(
            async (value: number, index: number) =>
              await binaryContract(web3).methods.proposals(index).call()
          )
        ).then((res) => setData(res))
        .catch((err) => console.log(err));
        
        
        const multiProposalCount = await multiContract(web3)
          .methods.proposalCount().call()

        Promise.all(Array(multiProposalCount).fill(0).map((value: number, index: number) => multiContract(web3).methods.proposals(index).call()))
            .then((res) => setData(data => [...data, ...res]))
      }
      getAccount();
    }
  }, []);

  console.log(data)

  return (
    // <main className="flex flex-row items-center justify-between ">
    <main className="prompt_layout">
      <Proposal />
      <Proposal />
      <Proposal />
    </main>
  );
}
