import React from 'react'
import Image from 'next/image'

import logoIcon from '../../assets/images/icon-logo.svg'
const Nav = () => {
  return (
    <div className='z-10 flex justify-between px-30 pb-10'>
        <div className='flex items-end text-xl font-bold'>
            <Image src={logoIcon} alt='Logo' width={30} height={30}/>
            <p className='ml-3 -mb-1'>PeerVoting</p>
        </div>
        
        <div>
          <button>Create Proposal</button>
          <button className='btn'>Connect Wallet</button>
        </div>
    </div>
  )
}

export default Nav