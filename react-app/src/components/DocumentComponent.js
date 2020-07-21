import React, { useEffect, useState, useContext, useCallback } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { ContractContext } from "../context/contractContext";

const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const FORMATBYTES = function (bytes, decimals) {
    for (var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
    return `${parseFloat(r.toFixed(decimals))} ${SIZES[i]}`;
}

const DocumentComponent = (props) => {
    const [document, setDocument] = useState(null);
    const contractContext = useContext(ContractContext);
    const { contractInst, account } = contractContext;

    useEffect(useCallback(() => {
        //connectBlockchain();
        populateDocument();
    }), [contractInst, account]);

    /*
   *   Method to initiate connection between FE and Blockchain
   */
    // const connectBlockchain = async () => {
    //     // retrieve web3 object with active connection running on port
    //     const web3 = await getWeb3();
    //     //populate all the available accounts from local running blockchain
    //     const _accounts = await web3.eth.getAccounts();
    //     //get the network id of running blockchain
    //     const _networkId = await web3.eth.net.getId();
    //     //get deployed network based on network id for required contract
    //     const deployedNetwork = ProofOfExistence.networks[_networkId];
    //     //generate contract instance based on contract address, abi, and web2 from deployed network
    //     contractInst = new web3.eth.Contract(
    //         ProofOfExistence.abi,
    //         deployedNetwork && deployedNetwork.address,
    //     );
    //     account = _accounts[0];
    //     //Load all the notarized documents
    //     populateDocument();
    // }

    const populateDocument = async () => {
        const _docId = props.match.params.docId;
        if (_docId) {
            //calling blockchain method to find document by id
            await contractInst.methods.findById(_docId).call()
                .then(res => {
                    if (res) {
                        res.size = FORMATBYTES(parseInt(res.size), 2);
                        setDocument({
                            ...res
                        });
                    }
                }).catch(err => {
                    console.error("---Error while populating document---".err);
                });

        }
    }

    const handleClose = () => {
        props.history.replace("/");
    }

    return (
        <div className="m-2">
            <h3 className="p-1">Document Details</h3>
            <div className="justify-content-center">
                {document &&
                    <div>
                        <ul className="list-group">
                            <li className="list-group-item">Name : <span className="font-weight-bold">{document.name}</span></li>
                            <li className="list-group-item" > Size : <span className="font-weight-bold">{document.size}</span></li>
                            <li className="list-group-item" >Type : <span className="font-weight-bold">{document.docType}</span></li>
                        </ul>
                        <div className="row justify-content-center mt-3">
                            <Button variant="dark" onClick={handleClose}>Close</Button>
                        </div>
                    </div>}
                {!document &&
                    <p className="m-3 text-center">No document found. <Link to="/">Click here</Link> to redirect back to home page. </p>}
            </div>
        </div>
    )

}

export default DocumentComponent;