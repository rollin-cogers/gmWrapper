//gmSession.js - This class is to handle a session instance on the guerilla mail server.
const axios = require('axios');
var FormData = require('form-data')
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
        this.alias;
    }

    establishSession(sid_token = null) {
        let url;
        sid_token === null ? url = `ajax.php?f=get_email_address` : url = `ajax.php?f=get_email_address&sid_token=${sid_token}`;
        return axiosInstance.get(url).then((response) => {
            if (response.status !== 200) {
                throw Error("Status code: " + response.status);
            } else if (response.data === '') {
                throw Error("Empty response, check arguments. ");
            }
            this.sid = response.data.sid_token;
            if (this.user === undefined) {
                this.user = response.data.email_addr.split('@')[0];
                this.alias = response.data.alias + '@guerrillamail.com';
            } else {
                return this.setEmail(this.user)
            }
        }).finally(() => {
            return this.sid;
        })
    }

    setEmail(emailUser) {
        let url = `ajax.php?f=set_email_user&email_user=${emailUser}&sid_token=${this.sid}`;
        return axiosInstance.post(url).then((response) => {
            if (response.status !== 200) {
                throw Error("Status code: " + response.status);
            } else if (response.data === '') {
                throw Error("Empty response, check arguments. ");
            }
            this.user = response.data.email_addr.split('@')[0];
            this.alias = response.data.alias + '@guerrillamail.com';
            return this.user
        })
    }

    checkEmail() {
        let url = `ajax.php?f=check_email&sid_token=${this.sid}&seq=0`
        return axiosInstance.get(url).then((response) => {
            if (response.status !== 200) {
                throw Error("Status code: " + response.status);
            } else if (response.data === '') {
                throw Error("Empty response, check arguments. ");
            }
            return response.data.list
        })
    }
    deleteEmail(email) {
        let url = `ajax.php?f=del_email&email_ids%5B%5D=${email.mail_id}&sid_token=${this.sid}`
        return axiosInstance.get(url).then((response) => {
            return response.data
        })
    }

    findEmailBySender(senderAddress, timeout = 30000, interval = 5000) {
        return new Promise((resolve, reject) => {
            let foundEmail;
            let intervalID = setInterval(() => {
                this.checkEmail().then((inbox) => {
                    for (const email of inbox) {
                        if (email.mail_from === senderAddress) {
                            foundEmail = email;
                        }
                    }
                }).then(() => {
                    if (typeof foundEmail !== 'undefined') {
                        clearInterval(intervalID)
                        resolve(foundEmail);
                    }
                })
            }, interval)
            setTimeout(() => {
                clearInterval(intervalID)
                if (foundEmail !== undefined) resolve();
                else reject(new Error(`Could not find email within ${timeout}ms`));
            }, timeout)
        })
    }

    findEmailBySubject(subject, timeout = 30000, interval = 5000) {
        return new Promise((resolve, reject) => {
            let foundEmail;
            let intervalID = setInterval(() => {
                this.checkEmail().then((inbox) => {
                    for (const email of inbox) {
                        if (email.mail_subject === subject) {
                            foundEmail = email;
                        }
                    }
                }).then(() => {
                    if (typeof foundEmail !== 'undefined') {
                        clearInterval(intervalID)
                        resolve(foundEmail);
                    }
                })
            }, interval)
            setTimeout(() => {
                clearInterval(intervalID)
                if (foundEmail !== undefined) resolve();
                else reject(new Error(`Could not find email within ${timeout}ms`));
            }, timeout)
        })
    }

    fetchEmail(emailID) {
        let url = `ajax.php?f=fetch_email&email_id=${emailID}&sid_token=${this.sid}`
        return axiosInstance.get(url).then((response) => {
            if (response.status !== 200) {
                throw Error("Status code: " + response.status);
            } else if (response.data === '') {
                throw Error("Empty response, check arguments. ");
            }
            return response.data
        })
    }

    sendEmail(recipient, subject, body) {
        let url = 'ajax.php?f=send_email'
        let form = new FormData();
        form.append('to', recipient);
        form.append('from', this.getEmailAddr());
        form.append('subject', subject);
        form.append('body', body);
        return axiosInstance.post(url, form, {
            headers: form.getHeaders()
        }).then((response) => {
            if (response.status !== 200) {
                throw Error("Status code: " + response.status);
            } else if (response.data.security_check_status === false) {
                throw Error('Failed to send email. Please check arguments.')
            }
        })

    }

    getEmailAddr() {
        return this.user + '@' + this.domain;
    }

    getAlias() {
        return this.alias;
    }

    getSid() {
        return this.sid;
    }
}

module.exports = gmSession;