# gmWrapper
This module is a simple wrapper for the [Guerillamail](http://www.guerrillamail.com) API.

# Features
- Programmatically access a disposable but persistent inbox
- Set email username (different domains are not supported yet with this package)
- Manage multiple email sessions as objects
- Send, receive and delete emails
#### Please use this package responsibly, and checkout [the project](https://github.com/flashmob/go-guerrilla) that inspired this wrapper!



<!-- # Installing
Using npm:
```bash
$ npm install <whateverItWillBe>
``` -->

# Examples
### **Note**: In order for the session to work, the `establishSession()` function must resolve. Because of the requests to the guerilla mail api, most functions return promises.

### Checking an inbox using async/await:
```js
async function () {
    let session = new gmSession();
    await session.establishSession();
    let inbox = await session.checkEmail();
}
```
### Checking an inbox using promises:
```js
function () {
    let session = new gmSession();
    session.establishSession().then(() => {
        session.checkEmail().then((inbox)=> {
            console.log(inbox)
        })
    });
}
```

### Setting a username:
```js
async function () {
    let session = new gmSession();
    await session.establishSession();
    await session.setEmail('newusername')
}

//Optionally usernames can be set in the constructor
async function () {
    let session = new gmSession('username');
    await session.establishSession();
}
```

## gmWrapper API
<!-- TODO: add more details in api section. -->
### `session.establishSession()`
This function is required to start the session. Returns the session ID.

### `session.setEmail(emailUser)`
Sets the username for the email. Returns the username.

### `session.checkEmail()`
Checks the inbox for the session. Returns an array of email objects.

### `session.deleteEmail(email)`
Deletes an email from the inbox, and requires the email object as an argument. Returns the response from the endpoint.

### `session.findEmailBySender(senderAddress[, timeout[, interval]])`
Searches the inbox for an email by the sender address. Returns the email object.

### `session.findEmailBySubject(subject[, timeout[, interval]])`
Searches the inbox for an email by the email subject. Returns the email object.

### `session.fetchEmail(emailID)`
Queries for an email based on the email ID. Returns the email object.

### `session.sendEmail(recipient, subject, body)`
Sends an email from the session to the recipient. **Please use with care!**

### `session.getEmailAddr()`
Returns the actual address for the inbox.

### `session.getAlias()`
Returns an alias to conceal the address for the inbox.

### `session.getSid()`
Returns session ID.
