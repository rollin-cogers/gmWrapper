//gmSession.js - This class is to handle a session instance on the guerilla mail server.
const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: "http://api.guerrillamail.com/",
    timeout: 1000,
    //headers: {}
})

class gmSession {
    constructor(emailUser = undefined) {
        this.user = emailUser;
        this.domain = "sharklasers.com";
        this.sid;
    }

    async establishSession(sid_token = null) {
        let url;
        sid_token === null ? url = `ajax.php?f=get_email_address` : url = `ajax.php?f=get_email_address&sid_token=${sid_token}`;
        try {
            let response = await axiosInstance.get(url)
            console.log(`SID => ${this.sid} USER => ${this.user}`)
            if (response.status !== 200) {
                throw "Status code: " + response.status;
            }
            this.sid = await response.data.sid_token;
            if (this.user === undefined) {
                this.user = await response.data.email_addr.split('@')[0];
            } else {
                await this.setEmail(this.user)
            }
        } catch (err) {
            console.log('Could not connect to the guerilla mail server: ' + err)
        }
        return this.sid;
    }

    async setEmail(emailUser) {
        let url = `ajax.php?f=set_email_user&email_user=${emailUser}&sid_token=${this.sid}`;
        try {
            let response = await axiosInstance.post(url)
            if (response.status !== 200) {
                throw "Status code: " + response.status;
            }
            console.log(response);
            this.user = await response.data.email_addr.split('@')[0];
        } catch (err) {
            console.log('Could not email User: ' + err)
        }
        console.log(this.user)
        return this.user
    }

    checkEmail = () => {

    }

    waitForSpecificEmail = (senderAddress) => {

    }

    fetchEmail = (emailID) => {
        let url = `ajax.php?f=fetch_email&email_id=${emailID}`
    }

    getEmailAddr() {
        return this.user + '@' + this.domain;
    }

    getSid() {
        return this.sid;
    }
}

module.exports = gmSession;