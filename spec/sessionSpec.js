let gmSession = require('../src/gmSession.js');

describe('Test the gmSession module: ', () => {
    it('Should be able to create a new instance of gmSession', () => {
        let session = new gmSession();
        expect(session).toBeInstanceOf(gmSession);
    })
    it('Establishing a new session without arguments should give a random email', () => {
        let session = new gmSession();
        session.establishSession();
        expect(session.getEmailAddr()).not.toContain('undefined');
    })
    it('Creating a new session should set the sid for the session', () => {
        let session = new gmSession();
        session.establishSession();
        expect(session.getSid()).toBeDefined();
    })
    it('Creating a new session with a string argument should set that as the email', () => {
        let session = new gmSession('newUser');
        session.establishSession();
        expect(session.getEmailAddr()).toContain('newUser');
    })
})