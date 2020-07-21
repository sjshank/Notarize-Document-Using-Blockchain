import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from "react-bootstrap/Modal";
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { ContractContext } from '../context/contractContext';

const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const FORMATBYTES = function (bytes, decimals) {
    for (var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
    return `${parseFloat(r.toFixed(decimals))} ${SIZES[i]}`;
}


class DocumentListComponent extends Component {
    static contextType = ContractContext;

    //Constructor to initiate all the state variables, configure toast object and bind html events
    constructor(props) {
        super(props);
        this.removeDocument = this.removeDocument.bind(this);
        this.removeAllSelectedDocuments = this.removeAllSelectedDocuments.bind(this);
        this.populateDocument = this.populateDocument.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        toast.configure({
            autoClose: 4000,
            draggable: false
        });
        this.state = {
            show: false,
            document,
            selectedDocIds: new Set()
        }
    }

    /*
    *   Method to close modal popup
    */
    handleClose() {
        this.setState({ show: false });
    }

    /*
    *   Method to handle checkbox change
    */
    handleCheckboxChange(event) {
        const { selectedDocIds } = this.state;
        if (event.target.checked === true) {
            //populate selecteddocids
            selectedDocIds.add(event.target.id);
        } else {
            //remove selecteddocids
            selectedDocIds.delete(event.target.id);
        }
        this.setState({ selectedDocIds: selectedDocIds });
    }

    /*
    *   Method to call blockchain and remove all the selected documents
    */
    removeAllSelectedDocuments(event) {
        event.preventDefault();
        const _selectedIds = Array.from(this.state.selectedDocIds);
        if (_selectedIds.length > 0) {
            //const { contractInst, account } = this.props;
            const contractContext = this.context;
            const { contractInst, account } = contractContext;
            //blockcahin method to remove selected documents
            contractInst.methods.removeSelectedDocuments(_selectedIds).send({ from: account })
                .then(res => {
                    //toast success msg
                    toast.success("Your document has been removed successfully !");
                    //update document list
                    this.props.updateList(event);
                    this.setState({ selectedDocIds: new Set() });
                }).catch(err => {
                    console.error("---Error while deleting selected documents---".err);
                });
        }
    }

    /*
    *   Method to call blockchain and remove document based on id
    */
    removeDocument(_docId, event) {
        event.preventDefault();
        //const { contractInst, account } = this.props;
        const contractContext = this.context;
        const { contractInst, account } = contractContext;
        //condition for docid 
        if (_docId) {
            contractInst.methods.removeNotarizedDocument(_docId).send({ from: account })
                .then(res => {
                    //show toast message
                    toast.success("Your document has been removed successfully !");
                    //update document list
                    this.props.updateList(event);
                }).catch(err => {
                    console.error("---Error while removing document---".err);
                });
        }
    }

    /*
    *   Method to call blockchain and load document details based on id
    */
    populateDocument(_docId, event) {
        event.preventDefault();
        //const { contractInst } = this.props;
        const contractContext = this.context;
        const { contractInst, account } = contractContext;
        //condition for docid
        if (_docId) {
            //calling blockchain method to find document by id
            contractInst.methods.findById(_docId).call()
                .then(res => {
                    if (res) {
                        res.size = FORMATBYTES(parseInt(res.size), 2);
                        this.setState({ document: res, show: true });
                    }
                }).catch(err => {
                    console.error("---Error while populating document---".err);
                });

        }
    }

    render() {
        const docList = this.props.documentList;
        return (
            <div>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Document Name</th>
                            <th>Notarized Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docList.length < 1 &&
                            <tr>
                                <td colSpan="4">
                                    No documents found.
                           </td>
                            </tr>
                        }
                        {docList.length > 0 &&
                            docList.map(d =>
                                <tr key={d.docId}>
                                    <td>
                                        <input type="checkbox"
                                            name="checkbox"
                                            id={d.docId}
                                            defaultChecked={d.checked}
                                            onChange={this.handleCheckboxChange}
                                        />
                                    </td>
                                    <td>
                                        {/*<a href="" className="" onClick={(e) => this.populateDocument(d.docId, e)}>{d.name}</a>*/}
                                        <Link className="" to={{
                                            pathname: '/document/' + d.docId
                                        }}>{d.name}</Link>
                                    </td>
                                    <td><span>{d.hashKey}</span></td>
                                    <td>
                                        <div id={d.docId}>
                                            <Button variant="danger" onClick={(e) => this.removeDocument(d.docId, e)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                <div className="text-center">
                    <Button variant="danger" disabled={!this.state.selectedDocIds.size > 0} onClick={(e) => this.removeAllSelectedDocuments(e)}>Delete Selected Documents</Button>
                </div>

                {/* ----- Modal code------ */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Document Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            <li>Name : <span className="font-weight-bold">{this.state.document.name}</span></li>
                            <li>Size : <span className="font-weight-bold">{this.state.document.size}</span></li>
                            <li>Type : <span className="font-weight-bold">{this.state.document.docType}</span></li>
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={this.handleClose}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

export default DocumentListComponent;