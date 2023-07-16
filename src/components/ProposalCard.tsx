import React from 'react'

interface IProposalProps {
    title: string,
    desc: string,
    isBinary: boolean,
    
    endTime?: boolean,
    isEnd?: boolean,
}

const ProposalCard = ({title, desc, isBinary}: IProposalProps) => {
  return (
    <div className='proposal cursor-pointer hover:border-sky-500'>
        <div className='flex justify-between basic-1'>
            <p className='text-lg font-semibold text-gray-900 basis-4/5	'>{title}</p>
            <div className={`bg-sky-500 -mr-5 rounded-l-md h-9 w-36 ml-2 ${!isBinary && 'bg-violet-500'} flex-initial` }>
                <p className='p-2 text-sm font-medium'>
                  {
                    isBinary ? ' Binary Choice' : 'Multiple Choice'
                  }
                </p>
            </div>
        </div>
        
        <p className='text-gray-200'>
        {desc}
        </p>
    </div>
  )
}

export default ProposalCard