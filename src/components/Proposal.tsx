import React from 'react'

interface IProposalProps {
    title: string,
    desc: string,
    
    endTime: boolean,
    isEnd: boolean,
}

const Proposal = () => {
  return (
    <div className='proposal cursor-pointer hover:border-sky-500'>
        <section className='flex justify-between'>
            <p className='w-4/5 text-lg font-semibold text-gray-900'>Bạn đồng tình với việc tăng mức lương tối thiểu hàng tháng 
            lên 15% không?</p>

            <div className='bg-sky-500 -mr-5 rounded-l-md h-9'>
                <p className='p-2 text-sm font-medium'>Binary Choice</p>
            </div>
        </section>
        
        <p className='text-gray-200'>
        Chúng tôi đang xem xét khả năng tăng mức lương tối thiểu hàng 
        tháng trong khu vực làm việc của chúng ta. Hiện tại, mức lương 
        tối thiểu đang là X đồng/tháng. Chúng tôi muốn lắng nghe ý kiến 
        của bạn về việc tăng mức lương tối thiểu hàng tháng lên 15%.
        </p>
    </div>
  )
}

export default Proposal