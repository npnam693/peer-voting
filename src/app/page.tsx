"use client";

import Image from "next/image";
import ProposalCard from "@/components/ProposalCard";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { binaryContract, multiContract} from "@/services/blockchainService";
import { useAppContext } from "@/context/appContext";
import { ProposalModal } from "@/components/ProposalModal";
import { IProposalModalProps } from "@/components/ProposalModal";

export default function Home() {
  const {web3} = useAppContext();
  const [data, setData] = useState<any[]>([]);
  
  const [proposalOpened, setProposalOpened] = useState<any>({
    id: '',
    title: '',
    desc: '',
  });

  const fetchProposal = async () => {
    const binaryProposalCount = Number(await binaryContract(web3).methods.proposalsCount().call());
    await Promise.all(Array(binaryProposalCount).fill(0).map((value: number, index: number) => binaryContract(web3).methods.proposals(index).call()))
    .then((res) => {
      setData(data => [...data, ...res].sort((a, b) => Number(b.startTime) - Number(a.startTime)))
    })
    .catch((err) => console.log(err));
    
    const multiProposalCount = Number(await multiContract(web3).methods.proposalsCount().call())
    await Promise.all(Array(multiProposalCount).fill(0).map((value: number, index: number) => multiContract(web3).methods.proposals(index).call()))
    .then((res) => {
      setData(data => [...data, ...res].sort((a, b) => Number(b.startTime) - Number(a.startTime)))
    })
    .catch((err : any) => console.log(err))
      
    console.log('ccc', data.sort((a, b) => Number(b.startTime) - Number(a.startTime)))
  }

  useEffect(() => {
    web3 !== null &&
    fetchProposal()
  }, [web3])
  console.log(data)


  return (
    // <main className="flex flex-row items-center justify-between ">
    <>
      <main className="prompt_layout">
        {
          data.map((value, index) => (
            <div key={index} onClick={() => setProposalOpened({
              id: value.id,
              title: value.title,
              desc: value.desc,
              choiceAmount: Number(value.choiceAmount),
              createdAt: Number(value.startTime),
              endTime: Number(value.endTime),
              owner: value.owner
            })}>
              <ProposalCard title={value.title} 
                desc={value.desc} 
                isBinary={value.choiceAmount == undefined}
              />
            </div>
          ))
        }
      </main>
      {
        proposalOpened.id !== ''  && 
        <ProposalModal  id={proposalOpened.id} title={proposalOpened.title} desc={proposalOpened.desc}
          choiceAmount={proposalOpened.choiceAmount}
          createdAt={proposalOpened.createdAt}
          onClickClose={() => setProposalOpened({    
            id: '',
            title: '',
            desc: ''
          })}
          endTime={proposalOpened.endTime}
          owner={proposalOpened.owner}
        />
      }
    </>
  );
}
