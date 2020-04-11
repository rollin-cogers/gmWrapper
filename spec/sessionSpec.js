let gmSession = require('../src/gmSession.js');

describe('Test the gmSession module: ', () => {
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
})