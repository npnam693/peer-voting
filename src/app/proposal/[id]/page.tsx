'use client'
import React, { useEffect, useState } from 'react'
import { ProposalModal } from '@/components/ProposalModal'
import { usePathname } from 'next/navigation'
import { binaryContract, multiContract } from '@/services/blockchainService'
import { useAppContext } from '@/context/appContext'

const Proposal = () => {
  const {address, web3, login} = useAppContext();
  
  const pathName = usePathname()
  let id = String(pathName).slice(10)
  const [data, setData] = useState<any>(null);
  console.log(id.slice(0,2), id.slice(2))
  console.log(data)
  useEffect(() => {
    const fetchProposal = async (web3?: any) => {
      if(id.slice(0,2) === 'mc') {
        const proposal = await multiContract(web3).methods.proposals(Number(id.slice(2))).call()
        setData(proposal)
      }
      else if (id.slice(0,2) === 'bc') {  
        const proposal = await binaryContract(web3).methods.proposals(Number(id.slice(2))).call()
        setData(proposal)
      }
    }

    web3 != null && fetchProposal(web3)
  }, [web3])

  return (
    data && 
    <ProposalModal 
      id={String(Number(id.slice(2)))} title={data.title} desc={data.desc}
      choiceAmount={Number(data.choiceAmount)}
      createdAt={Number(data.createdAt)}
      onClickClose={() => console.log({    
        id: '',
        title: '',
        desc: ''
      })}
      isPage={true}
      endTime={Number(data.endTime)}
      owner={data.owner}
    />
  )
}

export default Proposal