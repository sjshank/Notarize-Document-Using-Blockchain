const ProofOfExistence = artifacts.require("ProofOfExistence");

contract("ProofOfExistence", (accounts) => {
    before(async () => {
        this.proofOfExistence = await ProofOfExistence.deployed();
    });

    it("should deploy contract", () => {
        assert(this.proofOfExistence.address != '');
    });

    it("should notarize document", async () => {
        const result = await this.proofOfExistence.notarize("Resume", 1124, "image/png");
        const _eventObj = result.logs[0].args;
        assert.equal(_eventObj.document, "Resume");
        await this.proofOfExistence.notarize("Graduation Certificate", 3403, "pdf");
        await this.proofOfExistence.notarize("Salesforce Platform 1", 7767, "sheet");
        const p = await this.proofOfExistence.documentProofs(1);
        const r = await this.proofOfExistence.findById(p.docId.toNumber());
        //const proof = await this.proofOfExistence.proof();
        //assert(proof == "0xf85b2a0bea250db4f10fb69117d37fea4d2e62891421179b3b2d8708d20322da");
        const proof1 = await this.proofOfExistence.documentProofs(0);
        const proof2 = await this.proofOfExistence.documentProofs(1);
        const proof3 = await this.proofOfExistence.documentProofs(2);
        var ids = [proof1.docId.toNumber(), proof2.docId.toNumber()];
        const re = await this.proofOfExistence.removeSelectedDocuments(ids);
        console.log(re);
        assert(proof1.name == "Resume");
        assert(proof2.name == "Graduation Certificate");
        assert(proof3.name == "Salesforce Platform 1");
    });

    it("should get all doc proofs", async () => {
        const allDocs = await this.proofOfExistence.getAllDocumentProofs();
        //console.log(allDocs);
        assert(allDocs.length == 3);
    });
    

    it("should remove document", async () => {
        const result = await this.proofOfExistence.notarize("Aggreement", 1223, "image/png");
        const result1 = await this.proofOfExistence.notarize("Rent Aggreement", 8897, "xlsx");
        await this.proofOfExistence.notarize("Offer letter", 445, "csv");
        const _eventObj = result.logs[0].args;
        //console.log(_eventObj.docId.toNumber());
        //await this.proofOfExistence.removeNotarizedDocument(_eventObj.docId.toNumber());
        const allDocs = await this.proofOfExistence.getAllDocumentProofs();
        console.log(allDocs);
    });
})