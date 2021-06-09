import express from 'express';
import path from 'path';
import mailChimp from '@mailchimp/mailchimp_marketing'
//import https from "https"

//needed for es6?
const __dirname = path.resolve();


const app = express()
const port = 3000

app.use(express.urlencoded( { extended: true } ))

//specify static folder 'public'
app.use(express.static('public'))

mailChimp.setConfig({
    apiKey: 'e3b60a1aeaf70a158d569eed563eb755-us6',
    server: 'us6'

})



const newSubs = async ( listID, newUser) => {
    // const response = await mailChimp.ping.get()
    // console.log(response)

    try {
        const response = await mailChimp.lists.addListMember(listID,{
            email_address: newUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: newUser.firstName,
                LNAME: newUser.lastName
            }
        })
    
        console.log('added new member, contact id is: ' + response.id)
        //console.log(response)
        return response.id

    } catch (error) {
        console.log('error occur')
        console.log(error.status)
        // console.log(error.response.error.text)
        throw new Error('something went wrong')
    }

    
    
    
    // console.log(listID)
    // console.log(newUser)
    // console.log(newUser.firstName + ' ' + newUser.lastName)
}



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    // console.log(req.body)
    // console.log(req.body.signupfName)
    // console.log(req.body.signupEmail)
    const listAudienceId = '388c0df3f9'
    const subscribeUser = {
        firstName: req.body.signupfName,
        lastName: req.body.signuplName,
        email: req.body.signupEmail
    }
    newSubs(listAudienceId, subscribeUser).then( (result) => {
        console.log('id is: ', result)
        res.sendFile(__dirname + '/success.html')
    }).catch( (error) => {
        console.log('err here! ', error)
        res.sendFile(__dirname + '/failure.html')
    })
    
})

app.post('/backToSignUp', (req, res) => {
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('now served at port: ' + port)
    console.log(__dirname)
})


/* Audience ID || list ID
388c0df3f9 */

/* apiKey
e3b60a1aeaf70a158d569eed563eb755-us6 */