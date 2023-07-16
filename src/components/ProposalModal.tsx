'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/appContext'
import { multiContract } from '@/services/blockchainService'
import { binaryContract } from '@/services/blockchainService'

export interface IProposalModalProps {
    id: string,
    title: string,
    desc: string,
    createdAt: any,
    
    choiceAmount?: number,
    onClickClose: () => void
}
export const ProposalModal = ({id, title, desc, choiceAmount, createdAt, onClickClose} : IProposalModalProps) => {
    const isBinary = true;
    const [choices, setChoices] = useState(["Accept", "Reject"])
    const [selectedChoice, setSelectedChoice] = useState<number>(-1)
    const {web3} = useAppContext()
    console.log('cat', createdAt)
    const date = String(new Date(1678623676 * 1000))
    console.log(date)
    
    const fetchDataChoices = async () => {
        setChoices([])
        
        Promise.all(Array(choiceAmount).fill(0).map((value: number, index: number) => multiContract(web3).methods.getChoiceProposal(id, index).call()))
        .then((res) => setChoices(data => [...data, ...res]))
    }
    
    useEffect(() => {
        choiceAmount && fetchDataChoices()
        
    }, [])

    const handVoting = async() => {
        if (selectedChoice === -1) {
            alert('Please select your choice!')
            return
        }
        const accounts = await web3.eth.getAccounts()
        const account = accounts[0]
        console.log('account', account)
        if (choiceAmount){
            const tx = await multiContract(web3).methods.voteProposal(id, selectedChoice).send({
                from: account,
                gas: await multiContract(web3).methods.voteProposal(id, selectedChoice).estimateGas({from: account})
            })
            console.log('tx', tx)
        } else {
            const tx = await binaryContract(web3).methods.voteProposal(id, selectedChoice).send({
                from: account,
                gas: await binaryContract(web3).methods.voteProposal(id, selectedChoice).estimateGas({from: account})
            })
            console.log('tx', tx)
        }
    }

    console.log("choiceAmount", choiceAmount)
    return (
        <div className='fixed w-full h-full bg-stone-950/40 top-0 right-0 mt-0 flex items-center justify-center'>
            <div className='bg-stone-100 w-1/2 h-1/2  rounded-lg -mt-32 text-gray-900 p-8 relative'>
                <p className='text-xl font-semibold'>{title}</p>
                <p>
                    <span>ID: {choiceAmount ? '#MC' : '#BC'}0{String(id)} - </span>
                    <span className={choiceAmount ? 'text-violet-500' : 'text-sky-500'}>{ !choiceAmount ? ' Binary Choice' : 'Multiple Choice'}</span>
                    <span> - {date.slice(0, date.length - 25)}</span>
                </p>
                
                
                <p className='mt-4'>{desc}</p>
            
                {/* <div className={`absolute top-14 right-0 bg-sky-500 rounded-l-md ${!isBinary && 'bg-violet-500'}` }>
                    <p className='p-2 text-sm font-medium'>
                    
                    </p>
                </div> */}

                <div className={`absolute top-6 right-4 text-lg px-2 hover:bg-violet-500 cursor-pointer`}
                    onClick={onClickClose}                
                >x</div>
                <ul className="w-full mt-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {
                        choices.map((value, index) => (
                            <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600" key={index}>
                                <div className="flex items-center pl-3"> 
                                    <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" 
                                        id="list-radio-license" type="radio" value="" name="list-radio" 
                                        checked={selectedChoice === index}
                                        onChange={() => setSelectedChoice(index)}
                                    />
                                    <p className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                                        onClick={() => setSelectedChoice(index)}
                                    >{value}
                                    </p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className='w-full flex items-end mt-4'>
                    <button className='btn ml-auto' onClick={handVoting} disabled={}>Voting</button>
                </div>
            </div>
        </div>
  )
}
