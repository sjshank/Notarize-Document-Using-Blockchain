import React, { useEffect, useState, useCallback } from 'react';
import getWeb3 from "../getWeb3";
import ProofOfExistence from "../contracts/ProofOfExistence.json";

const ContractContext = React.createContext(null);

const ContractContextProvider = (props) => {

    const [contractInst, setContractInstance] = useState(null);
    const [account, setAccount] = useState('');

    useEffect(() => {
        const connectToBlockchain = async () => {
            // retrieve web3 object with active connection running on port
            const web3 = await getWeb3();
            //populate all the available accounts from local running blockchain
            const _accounts = await web3.eth.getAccounts();
            //get the network id of running blockchain
            const _networkId = await web3.eth.net.getId();
            //get deployed network based on network id for required contract
            const deployedNetwork = ProofOfExistence.networks[_networkId];
            //generate contract instance based on contract address, abi, and web2 from deployed network
            const instance = new web3.eth.Contract(
                ProofOfExistence.abi,
                deployedNetwork && deployedNetwork.address,
            );
            //Populate state object
            await setContractInstance(instance);
            await setAccount(_accounts[0]);
        };

        connectToBlockchain();

    },[]);

    return (
        <ContractContext.Provider value={{
            contractInst,
            account
        }}>
            {props.children}
        </ContractContext.Provider>
    );
}

export { ContractContext, ContractContextProvider };