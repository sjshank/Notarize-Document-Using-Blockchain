import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';


class GenericModalComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.modalFlag
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleProceed = this.handleClose.bind(this);
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        //if (oldProps.modalFlag !== newProps.modalFlag) {
            //this.setState({ show: newProps.modalFlag });
        //}
    }

    handleClose(event) {
        this.setState({ show: false });
        this.props.updateModalFlag(true, false, event);
    }

    handleProceed(event) {
        this.setState({ show: false });
        this.props.updateModalFlag(true, true, event);
    }


    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.bodyContent}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
              </Button>
                    <Button variant="primary" onClick={this.handleProceed}>
                        Proceed
              </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default GenericModalComponent;