let gmSession = require('../src/gmSession.js');
let _ = require('lodash');

describe('Test the gmSession module: ', () => {
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    })
    it('Should be able to create a new instance of gmSession', () => {
        let session = new gmSession();
        expect(session).toBeInstanceOf(gmSession);
    })
    it('Establishing a new session without arguments should give a random email', async () => {
        let session = new gmSession();
        await session.establishSession();
        expect(session.getEmailAddr()).not.toContain('undefined');
    })
    it('Creating a new session should set the sid for the session', async () => {
        let session = new gmSession();
        await session.establishSession();
        expect(session.getSid()).toBeDefined();
    })
    it('Creating a new session with a string argument should set that as the email', async () => {
        let session = new gmSession('newUser');
        await session.establishSession();
        expect(session.getEmailAddr()).toContain('newUser');
    })
    it('Should be able to set an email manually', async () => {
        let session = new gmSession();
        await session.establishSession();
        await session.setEmail('testUser')
        expect(session.getEmailAddr()).toContain('testUser');
    })
    it("Should be able to check a session's inbox", async () => {
        let session = new gmSession();
        await session.establishSession();
        let inbox = await session.checkEmail();
        //console.log(inbox)
        expect(inbox).toBeDefined();
    })
    it("A session's inbox should come back as an array", async () => {
        let session = new gmSession();
        await session.establishSession();
        let inbox = await session.checkEmail();
        expect(inbox).toBeInstanceOf(Array);
    })
    it('Should be able to wait for an email from a specific address', async () => {
        let session = new gmSession();
        await session.establishSession();
        let email = await session.findEmailBySender("no-reply@guerrillamail.com");
        expect(email).toBeDefined();

    })
    it('Should be able to set the timeout when checking for an email', async () => {
        let session = new gmSession();
        await session.establishSession();
        let email;
        try {
            email = await session.findEmailBySender("notanemailaddress@fhiwklfnfdcd.com", 2000);
            fail();//fails if the promise returns and executes to here
        } catch (err) {
            expect(err).toEqual(Error('Could not find email within 2000ms'))
        }
    })
    it("Should be able to delete a specific email", async () => {
        let sender = new gmSession('testSender');
        await sender.establishSession();
        await sender.sendEmail('deleteTest@sharklasers.com', 'Please delete this email', 'Dont read it either');
        let receiver = new gmSession('deleteTest');
        await receiver.establishSession();
        let email = await receiver.findEmailBySubject('Please delete this email');
        let response = await receiver.deleteEmail(email);
        expect(response.deleted_ids).toContain(email.mail_id)
    })
    it('Should be able to send an email', async () => {
        let sender = new gmSession('testSender');
        await sender.establishSession();
        await sender.sendEmail('otherTestUser@sharklasers.com', 'This is the subject', 'This is the body');
        let receiver = new gmSession('otherTestUser');
        await receiver.establishSession();
        let email = await receiver.findEmailBySubject('This is the subject');
        expect(email.mail_subject).toEqual('This is the subject');
    })
    it('Should get an error when sending an email without the needed arguments', async () => {
        let sender = new gmSession('testSender');
        await sender.establishSession();
        try {
            await sender.sendEmail('Not an email', 'This is the subject', 'This is the body');
            fail();//fails if the promise returns and executes to here
        } catch (err) {
            expect(err).toEqual(Error('Failed to send email. Please check arguments.'));
        }
    })
})