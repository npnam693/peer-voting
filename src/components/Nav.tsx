'use client'
import React from 'react'
import Image from 'next/image'

import logoIcon from '../../assets/images/icon-logo.svg'
import { useAppContext } from '@/context/appContext'

const Nav = () => {
  const {address, web3, login} = useAppContext();
  
  const connectWallet = async () => {
    if (address === '') {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = (await web3.eth.getAccounts())[0];
      login(address, web3);
    }
  }


  return (
    <div className='w-full z-10 flex justify-between py-3 '>
        <div className='flex items-end text-xl font-bold'>
            <Image src={logoIcon} alt='Logo' width={30} height={30}/>
            <p className='ml-3 -mb-1'>PeerVoting</p>
        </div>
        
        <div className='flex items-end'>
          <button className='underline decoration-sky-500 mr-4 text-lg font-semibold hover:text-sky-500'>Create Proposal</button>
          <button className='btn' onClick={connectWallet}>
            {
              address === '' ? 'Connect Wallet' : address.slice(0,4) + '...' + address.slice(-5)
            }
          </button>
        </div>
    </div>
  )
}

export default Nav