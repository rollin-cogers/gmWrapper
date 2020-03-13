//gmSession.js - This class is to handle a session instance on the guerilla mail server.
var rp = require('request-promise');
let baseUrl = "http://api.guerrillamail.com/ajax.php";

class gmSession {
    constructor(emailUser, domain="sharklasers.com") {
        this.email = emailUser;
        this.domain = domain;
        this.sid;

        rp({
            method: 'GET',
            uri: 'http://api.guerrillamail.com/ajax.php?f=get_email_address',
            json: true,
            resolveWithFullResponse: true
        }).then((response) => {
            this.sid = response.body.sid_token
            rp({
                method: 'POST',
                uri: `http://api.guerrillamail.com/ajax.php?f=set_email_user&sid_token=${this.sid}&email_user=${this.email}@${this.domain}`,
                json: true,
                resolveWithFullResponse: true
            })
        }).catch((err) => {
            console.log('Could not connect to the guerilla mail server...')
        })
    }

    establishSession = (sid_token = 0) => {
        let url;
        sid_token == 0 ? url = `${baseUrl}?f=get_email_address&site=${this.domain}` : url = `${baseUrl}?f=get_email_address&sid_token=${this.sid}&site=${this.domain}`;
        rp({
            method: 'GET',
            uri: url,
            json: true,
            resolveWithFullResponse: true
        }).then((response) => {
            this.sid = response.body.sid_token;
            return response.body.sid_token;
        })

    }

    setEmail = (emailUser, domain = "sharklasers.com") => {
        let url = `${baseUrl}?f=set_email_user&email_user=${emailUser}&sid_token=${this.sid}&site=${domain}`;
        
    }
}

module.exports = gmSession;