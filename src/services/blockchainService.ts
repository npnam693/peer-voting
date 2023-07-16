import { BINARY_CONTRACT_ABI, BINARY_CONTRACT_ADDRESS, MULTI_CONTRACT_ABI, MULTI_CONTRACT_ADDRESS } from "@/constants/blockchain"

export const binaryContract = (web3 : any) => {
    return new web3.eth.Contract(BINARY_CONTRACT_ABI, BINARY_CONTRACT_ADDRESS)
}

export const multiContract = (web3 : any) => {
    return new web3.eth.Contract(MULTI_CONTRACT_ABI, MULTI_CONTRACT_ADDRESS)
}





