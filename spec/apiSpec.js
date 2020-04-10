const axios = require('axios');
const axiosInstance = axios.create({
    baseURL: "http://api.guerrillamail.com/",
    timeout: 1000,
    //headers: {}
})

describe('Verify the guerilla mail API is functioning as intended', () => {
    it('Should get a 200 response back from the base Url', async () => {
        let response = await axiosInstance.request('ajax.php');
        expect(response.status).toEqual(200)
    })
    it('Should be able to get a response from the get_email_address endpoint', async () => {
        let response  = await axiosInstance.get('ajax.php?f=get_email_address')
        expect(response.data).toBeDefined()
        console.log(response.data);
    })

})