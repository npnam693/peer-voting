'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/context/appContext'
import { multiContract } from '@/services/blockchainService'
import { binaryContract } from '@/services/blockchainService'
import shareIcon from '../../assets/images/share.svg'
import linkIcon from '../../assets/images/link.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation' 

export interface IProposalModalProps {
    id: string,
    title: string,
    desc: string,
    createdAt: number,
    choiceAmount?: number,
    onClickClose: () => void
    isPage? : boolean
    endTime: number
    owner: string
}


export const ProposalModal = ({id, title, desc, choiceAmount, createdAt, isPage, endTime, owner, onClickClose} : IProposalModalProps) => {
    const [choices, setChoices] = useState(["Reject", "Accept"])
    const [selectedChoice, setSelectedChoice] = useState<number>(-1)
    const [resultProposal, setResultProposal] = useState<number[]>(choiceAmount ? Array(choiceAmount).fill(0) : [0, 0])
    const [countVoted, setCountVote] = useState<number[]>(choiceAmount ? Array(choiceAmount).fill(0) : [0, 0])
    const [loading, setLoading] = useState(false)

    const [yourVote, setYourVote] = useState<number>(-1)
    const {web3, address} = useAppContext()
    const proposalDate = String(new Date(createdAt * 1000))
    
    const fetchDataChoices = async () => {
        setChoices([])
        Promise.all(Array(choiceAmount).fill(0).map((value: number, index: number) => multiContract(web3).methods.getChoiceProposal(id, index).call()))
        .then((res) => setChoices(data => [...data, ...res]))
    }
    const router = useRouter()

    console.log('vcl', endTime)
    const fetchYourChoices = async () => {
        let voted = -1;
        if (choiceAmount) {
            try {
                const isVoted = await multiContract(web3).methods.isVoted(address, id).call({from: address})
                if (isVoted){
                    voted = await multiContract(web3).methods.getYourVote(id).call({
                        from: address,
                    })
                    setYourVote(Number(voted))
                    fetchResultProposal()
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            try {
                const isVoted = await binaryContract(web3).methods.isVoted(address, id).call({from: address})
                if (isVoted){
                    voted = await binaryContract(web3).methods.getYourVoted(id).call({
                        from: address,
                    })
                    setYourVote(Number(voted))
                    fetchResultProposal()
                }
            } catch (error) {
                console.log(error)
            }
        }
        setYourVote(Number(voted))
    }

    const fetchResultProposal = async () => {
        const setResult = (res : BigInt[]) => {
            let result = res;
            const sum = result.reduce((partialSum, a) => partialSum + Number(a), 0);
            if (sum == 0 ) return
            else {
                setResultProposal(result.map((value: BigInt) => Number(value) / sum))
                setCountVote(result.map((value: BigInt) => Number(value)))
            }
        }

        if (choiceAmount) {
            Promise.all(resultProposal.map((value: number, index: number) => multiContract(web3).methods.getResultProposal(id, index).call()))
            .then((res) => {
                setResult(res)
            })
            .catch((err) => console.log(err))
        } else {
            const accept = await binaryContract(web3).methods.getAcceptCount(id).call()
            const reject = await binaryContract(web3).methods.getRejectCount(id).call()
            setResult([reject,accept])
        }
    }
    
    useEffect(() => {
        if (choiceAmount) {
            fetchDataChoices()
        }
        fetchYourChoices()
    }, [address])

    const handVoting = async() => {
        if (selectedChoice === -1) {
            alert('Please select your choice!')
            return
        }
        
        if (address === '') {
            alert("Please connect wallet before voting")
        }
        try {
            setLoading(true)
            if (choiceAmount){
                const tx = await multiContract(web3).methods.voteProposal(id, selectedChoice).send({
                    from: address,
                    gas: await multiContract(web3).methods.voteProposal(id, selectedChoice).estimateGas({from: address})
                })
                console.log('tx', tx)
                setYourVote(selectedChoice)
                fetchResultProposal()
                setLoading(false)
            } else {
                const tx = await binaryContract(web3).methods.voteProposal(id, selectedChoice).send({
                    from: address,
                    gas: await binaryContract(web3).methods.voteProposal(id, selectedChoice).estimateGas({from: address})
                })
                console.log('tx', tx)
                setYourVote(selectedChoice)
                fetchResultProposal()
                setLoading(false)

            }
        } catch (error : any) {
            setLoading(false)
            if (error.data.code === 3)
                alert(error.data.message)
            else {alert(error)}
        }
    }

    const finalizeProposal = async() => {
        if ((endTime - Math.floor(Date.now() / 1000)) > 0)
            alert("The proposal is not ended yet!")

        try {
            if (choiceAmount){
                const tx = await multiContract(web3).methods.endProposal(id).send({
                    from: address,
                    gas: await multiContract(web3).methods.endProposal(id).estimateGas({from: address})
                })
                console.log('tx', tx)
                fetchResultProposal()
            } else {
                const tx = await binaryContract(web3).methods.endProposal(id).send({
                    from: address,
                    gas: await binaryContract(web3).methods.endProposal(id).estimateGas({from: address})
                })
                console.log('tx', tx)
                fetchResultProposal()
            }
        } catch (error : any) {
            if (error.data.code === 3)
                alert(error.data.message)
        }
    }

    return (
        <div className={
            !isPage ? 'fixed w-full h-full bg-stone-950/40 top-0 right-0 mt-0 flex items-center justify-center' : 'w-full'
        }>
            <div className={
               !isPage ?  'bg-stone-100 w-1/2 rounded-lg -mt-32 text-gray-900 p-8 relative' : 'w-full bg-stone-100 text-gray-900 rounded-lg mt-12 p-8'
            }>
                <div className='flex justify-between items-start'>
                    <div>
                        <p className='text-xl font-semibold'>{title}</p>
                        <p>
                            <span>ID: {choiceAmount ? '#MC' : '#BC'}0{String(id)} - </span>
                            <span className={choiceAmount ? 'text-violet-500' : 'text-sky-500'}>{ !choiceAmount ? ' Binary Choice' : 'Multiple Choice'}</span>
                            <span> - {proposalDate.slice(0, proposalDate.length - 25)}</span>
                            <div className='flex flex-row'>
                                <span className='flex cursor-pointer' onClick={() => {navigator.clipboard.writeText(`https://peer-voting.vercel.app/poll/${choiceAmount ? 'mc' : 'bc'}0${String(id)}`)}}>
                                    <span className='text-sm font-medium mr-1'>Copy link</span>
                                    <Image src={shareIcon} alt='Logo' width={13} height={13}/>
                                </span>
                                
                                <span className='flex cursor-pointer ml-4' onClick={() => {router.push(`poll/${choiceAmount ? 'mc' : 'bc'}0${String(id)}`)}}>
                                    <span className='text-sm font-medium mr-1'>Page</span>
                                    <Image src={linkIcon} alt='Logo' width={16} height={16}/>
                                </span>
                            </div>
                        </p>
                    </div>
                    <div className='ml-10 flex items-center '>
                        {
                            !isPage &&
                            <div className={`text-2xl px-2 hover:bg-violet-500 cursor-pointer rounded-md ml-4`}
                                onClick={onClickClose}                
                            >x</div>
                        }
                    </div>
                </div>
                
                
                
                <p className='mt-4'>{desc}</p>


                
                <ul className="w-full mt-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {
                        choices.map((value, index) => (
                            <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600" key={index}>
                                <div className="flex items-center pl-3"> 
                                    <input className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" 
                                        id="list-radio-license" type="radio" value="" name="list-radio" 
                                        checked={(selectedChoice === index) || (yourVote === index)}
                                        onChange={() => setSelectedChoice(index)}
                                        disabled={yourVote !== -1 && yourVote !== index}
                                    />
                                    {
                                        yourVote !== -1 ?
                                        <div className='flex justify-between w-full pr-2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer'>
                                            <p>{value}</p>
                                            <span className={`pl-12 font-bold ${Math.max(...resultProposal) === resultProposal[index] ? 'text-emerald-400' : 'text-amber-600'}`}>{(resultProposal[index]*100).toFixed(2)}%{`(${countVoted[index]})`}</span>
                                        </div>
                                        :
                                        <p className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                                        onClick={() => setSelectedChoice(index)}
                                        >{value}
                                        </p>
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {
                    endTime &&
                    <div>
                        <p className='text-sm mt-4 font-medium'>Time left: <span>
                                {((endTime - Math.floor(Date.now() / 1000))/3600) > 0 ? ((endTime - Math.floor(Date.now() / 1000))/3600).toFixed(2) : 'Time over'} hours
                            </span>
                        </p>
                    </div>
                }

                <div className='w-full flex items-end mt-4'>
                    {
                        owner === address &&
                        <button className='btn mr-auto !bg-rose-300	' onClick={finalizeProposal} 
                        >Finalize Proposal</button>

                    }
                    <button className='btn ml-auto' onClick={handVoting} >
                        {
                            !loading ? 
                            'Voting'
                            :
                            <div role="status" className='w-full flex items-center justify-center'>
                                <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </div>
                        }
                    
                    </button>
                </div>
            </div>
        </div>
  )
}
