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

    establishSession(sid_token = null) {
        let url;
        sid_token === null ? url = `ajax.php?f=get_email_address` : url = `ajax.php?f=get_email_address&sid_token=${sid_token}`;
        return axiosInstance.get(url).then((response) => {
            if (response.status !== 200) {
                throw "Status code: " + response.status;
            }
            this.sid = response.data.sid_token;
            if (this.user === undefined) {
                this.user = response.data.email_addr.split('@')[0];
            } else {
                return this.setEmail(this.user)
            }
        })//.catch((err) => {
            //console.log('Could not connect to the guerilla mail server: ' + err)
        /*})*/.finally(() => {
            return this.sid;
        })
    }

    setEmail(emailUser) {
        let url = `ajax.php?f=set_email_user&email_user=${emailUser}&sid_token=${this.sid}`;
        return axiosInstance.post(url).then((response) => {
            if (response.status !== 200) {
                throw "Status code: " + response.status;
            }
            this.user = response.data.email_addr.split('@')[0];
            return this.user
        })//.catch((err) => {
        //     console.log('Could not set user email: ' + err);
        // })
    }

    checkEmail = () => {

    }

    waitForSpecificEmail = (senderAddress) => {

    }

    fetchEmail(emailID) {
        let url = `ajax.php?f=fetch_email&email_id=${emailID}`
    }

    sendEmail(recipient, subject, body) {
        let url = 'ajax.php'
        return axiosInstance.post(url, {
            data: {
                to: recipient,
                from: this.getEmailAddr(),
                subject: subject,
                body: body,
                ref_mind: "",
                attach: "",
                site: "", //This might be required
                in: "" //This might be required
            }
        }).then((response) => {
            if (response.status !== 200) {
                throw "Status code: " + response.status;
            }
        })

    }

    getEmailAddr() {
        return this.user + '@' + this.domain;
    }

    getSid() {
        return this.sid;
    }
}

module.exports = gmSession;