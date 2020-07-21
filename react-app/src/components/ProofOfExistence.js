import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import DocumentListComponent from "./DocumentListComponent";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContractContext } from '../context/contractContext';

class ProofOfExistenceComponent extends Component {

    static contextType = ContractContext;

    //Constructor to initiate all the state variables, configure toast object and bind html events
    constructor(props) {
        super(props);
        this.state = {
            contractInst: null, // holds contract
            account: '', // holds account
            documentName: 'Upload document', // document name
            listOfNotarizedDocuments: [], // list of all the documentProof
            file: null, // file object
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNotarizeDocument = this.handleNotarizeDocument.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.loadNotarizedDocuments = this.loadNotarizedDocuments.bind(this);
        toast.configure({
            autoClose: 4000,
            draggable: false
        });
    }

    /*
    * Component lyf cycle
    */
    componentDidMount() {
        //Initiate web3-ethereum connection once component starts mounting
        //this.connectBlockchain();
        this.loadNotarizedDocuments();
    }

    /*
    *   Method to initiate connection between FE and Blockchain
    */
    // async connectBlockchain() {
    //     // retrieve web3 object with active connection running on port
    //     const web3 = await getWeb3();
    //     //populate all the available accounts from local running blockchain
    //     const _accounts = await web3.eth.getAccounts();
    //     //get the network id of running blockchain
    //     const _networkId = await web3.eth.net.getId();
    //     //get deployed network based on network id for required contract
    //     const deployedNetwork = ProofOfExistence.networks[_networkId];
    //     //generate contract instance based on contract address, abi, and web2 from deployed network
    //     const instance = new web3.eth.Contract(
    //         ProofOfExistence.abi,
    //         deployedNetwork && deployedNetwork.address,
    //     );
    //     //Populate state object
    //     await this.setState({ contractInst: instance, account: _accounts[0] });
    //     //Load all the notarized documents
    //     this.loadNotarizedDocuments();
    // }

    /*
    *   Method to call blockchain and load all documents
    */
    async loadNotarizedDocuments() {
        const contractContext = this.context;
        const { contractInst, account } = contractContext;
        //calling blockchain method
        const _result = await contractInst.methods.getAllDocumentProofs().call();
        this.setState({ listOfNotarizedDocuments: _result });
    }

    /*
    *   Method to handle upload input change
    */
    handleInputChange(event) {
        event.preventDefault();
        this.setState({ documentName: event.target.value });
    }

    /*
    *   Method to handle file changed by user
    */
    handleFileChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        //populate state object with new file obejct
        this.setState({ documentName: file.name, file: file });
    }

    /*
    *   Method to call blockchain and notarize uploaded document
    */
    handleNotarizeDocument(event) {
        event.preventDefault();
        const contractContext = this.context;
        const { contractInst, account } = contractContext;
        //checking condition
        if (this.state.documentName && this.state.documentName !== 'Upload document'
            && this.state.file) {
            // calling blockchain method to notarize
            contractInst
                .methods
                .notarize(this.state.documentName, this.state.file.size, this.state.file.type)
                .send({ from: account })
                .then(res => {
                    //show toast on success
                    toast.success("Your document has been notarized successfully !");
                    //Reset the document name and file object
                    this.setState({ documentName: 'Upload document', file: null });
                    //Get the response and update document list
                    const result = res.events.AllDocumentsEvent.returnValues;
                    //set the state with updated natarized documents list
                    if (result && Array.isArray(result.documentProofs) && result.documentProofs.length > 0) {
                        this.setState({ listOfNotarizedDocuments: result.documentProofs });
                    }
                }).catch(err => {
                    console.error("---Error while notarizing document---".err);
                });

        }
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h2 className="p-2 bd-highlight">Notarize Your Documents</h2>
                </header>
                <section>
                    <div>
                        <ul className="d-flex">
                            <li className="pr-2 input-box-li">
                                <Form>
                                    <Form.File
                                        id="custom-file"
                                        label={this.state.documentName}
                                        custom
                                        onChange={this.handleFileChange}
                                    />
                                </Form>
                            </li>
                            <li><Button variant="dark" onClick={this.handleNotarizeDocument}>Notarize</Button></li>
                        </ul>
                    </div>
                    <div className="">
                        <div className="text-left mb-2">
                            <span>Showing <strong>{this.state.listOfNotarizedDocuments.length}</strong> documents</span>
                        </div>
                        {/* -------- Load document list table here----- */}
                        <DocumentListComponent documentList={this.state.listOfNotarizedDocuments}
                            contractInst={this.state.contractInst}
                            account={this.state.account}
                            updateList={this.loadNotarizedDocuments}></DocumentListComponent>
                    </div>
                </section>
                {/* <footer className="mt-4">
                    <p className="text-center">Made with React, Ethereum & Solidity. Copyright@<a href="https://github.com/sjshank">Saurabh Shankariya</a></p>
                </footer> */}
            </div>

        )
    }
}

export default ProofOfExistenceComponent;
