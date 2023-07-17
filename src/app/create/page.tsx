"use client";

import { binaryContract, multiContract } from "@/services/blockchainService";
import React, { useState } from "react";
import { useAppContext } from "@/context/appContext";
const Create = () => {
  const {web3, address} = useAppContext()
  const [isBinary, setIsBinary] = useState<boolean>(true);
  const [numOption, setNumOption] = useState<number>(3)
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<any>({
    title: '',
    desc: '',
    duration: 0,
  })

  const handleSumbitProposal = async() => {
    if (address === '') {
      alert("Connect wallet before create a new proposal!")
    }

    if (formData.title === '') {
      alert('Title is required')
      return;
    } else if (formData.desc === '') {
      alert('Description is required')
      return;
    } else if (formData.duration === 0) {
      alert('Duration is required')
      return;
    }
    
    setLoading(true)
    try {
      if(isBinary) {
        const recipt = await binaryContract(web3).methods.createProposal(formData.title, formData.desc, formData.duration).send({
          from: address,
          gas: await binaryContract(web3).methods.createProposal(formData.title, formData.desc, formData.duration).estimateGas({from: address})
        })
        console.log('tx', recipt)
        setLoading(false)
    
      }
      else {
        const recipt = await multiContract(web3).methods.createProposal(
          formData.title, 
          formData.desc, 
          numOption,
          options,
          formData.duration, 
        ).send({
          from: address,
          gas: await multiContract(web3).methods.createProposal(
            formData.title, 
            formData.desc, 
            numOption,
            options,
            formData.duration, 
          ).estimateGas({from: address})
        })
        console.log('tx', recipt)
      }
    } catch (error) {
      alert(error)  
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 flex items-center flex-col w-full">
      <p className="text-3xl font-bold mb-4">Create a new Poll!</p>

      <div>
        <button
          className={`btn w-16 mx-8 my-4 !bg-sky-500 ${isBinary && "btn-active"}`}
          onClick={() => setIsBinary(true)}
        >
          Binary Choice
        </button>
        <button
          className={`btn w-16 mx-8 my-4 !bg-violet-500 ${!isBinary && "btn-active "}`}
          onClick={() => setIsBinary(false)}
        >
          Multiple Choice
        </button>
      </div>

      <div className="mb-6 w-3/4">
        <p>Title: </p>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="mb-6 w-3/4">
        <p>Description: </p>

        <textarea 
          value={formData.desc}
          onChange={(e) => setFormData({...formData, desc: e.target.value})}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>

      <div className="mb-6 w-3/4">
        <p>Duration (hours): </p>
        <input type="number" min={1} value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>


      {!isBinary && (
        <div className="mb-6 w-3/4">
          <p>Option: </p>
          {
            Array(numOption).fill(0).map((value, index) => (
              <div className="flex items-center mb-2 font-medium" key={index}>
                <span className="mr-4 w-4">{index}</span>
                <input value={options[index]} onChange={(e) => {
                  const newOptions = [...options]
                  newOptions[index] = e.target.value
                  setOptions(newOptions)
                }}
                type="text" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
            ))
          }
          <div>
            <button className='px-4 py-2 hover:text-sky-500' onClick={() => setNumOption(num => num + 1)}>Add option</button>
            <button className='px-4 py-2 hover:text-sky-500' onClick={() => setNumOption(3)}>Clear Option</button>
          </div>
        </div>
      )}
      <button className="btn" style={{ width: "30%" }} onClick={handleSumbitProposal}>
        {
          loading ? 
          <div role="status" className='w-full flex items-center justify-center'>
            <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div> :
        'Submit'
        }
      </button>
    </div>
  );
};

export default Create;
