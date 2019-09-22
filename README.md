## How to send Multiple PDF Attachments using Sendgrid and Nodejs
###### Towfiqur Rahman edited this page on Septem 21 2019
## Getting Started
1) Install Nodejs and NPM
2) Get Sendgrid Account and Api key
     * Visit https://sendgrid.com/
     * Sign In/ Sign Up 
     * From left side menu. Select Setup Guide .
     * Select Send Your First Email.
     * Select Integrate using our Web API or SMTP relay.
     * Select Web Api. Then Choose Nodejs then select create key.
    
3) Running the project: 
    * Clone Repositiory
    * Run in the cli npm install
    * Create .env file. Inside the .env file
    
    ```javascript
      SENDGRID_API_KEY= XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX //your api key recieved from sendgrid
      ```
    * Modify file email.js file Line Number 19 , change email Id you want to send the email to .
     ```var ticketDetails = {
        firstName: 'Towfiq',
        email: 'soum.ragan@gmail.com',
    };
      ```
    * Or Modify Line Number 59 , "to" means the email reciepient and "from" means email sender.
    
    ```javascript
        var email_message = {
        to: ticketDetails.email,
        from: 'soum.ragan@gmail.com',
        subject: 'Here attached is your tickets',
        text: 'Your Ticket is attached with this email. Please view it.',
        attachments: [],
        html: html
    };
      ```
    * run nodemon server.js 
    * In your browser type: http://localhost:5100/email
    * Get response Email sent check 
    * Visit your email id 
    ![](views/images/Screenshot%202019-09-22%20at%208.35.33%20PM.png)
    ![](views/images/Screenshot%202019-09-22%20at%208.40.42%20PM.png)
    
    
## Explanation of Code :
###### Most of us know how to create server file on nodejs as a result i will only be explaining how i send multiple attachments with one email.
## Lets begin
 1) Under app folder-> email folder -> we have email.js file 
 2) We have also created two handle bar files under views folder. email.hjs is the html that will be attached with the email.
  indiv_tickets.hjs will be send as pdf. Because this file in our case is for each ticket. After that we are converting them      in   to handlebars file.
       
       ```javascript
          var template = fs.readFileSync('./views/email.hjs', 'utf-8');
          var indiv_template = fs.readFileSync('./views/indiv_ticket.hjs', 'utf-8');
          var hndl_template = handlebars.compile(template);
          var hndl_indiv_template = handlebars.compile(indiv_template);
       ```
 3) We are sending some json data as an array of objects to be viewed on the handlebars file.
      ```javascript
         var html = hndl_template(ticketDetails);
      ```
 4) we are using html-pdf library to convert our handlebars to pdf file.
 5) Below given code is used to create the email. Over here we have created attachments and left it as an empty array. Later on we will push our attachments inside the array.
     ```javascript
        var email_message = {
        to: ticketDetails.email,
        from: 'soum.ragan@gmail.com',
        subject: 'Here attached is your tickets',
        text: 'Your Ticket is attached with this email. Please view it.',
        attachments: [],
        html: html
    };
      ```
    *  Over Here we are converting our each html file to pdf, then converting the pdf into base64 encoding buffer and pushing into our email attachments array.
    ```javascript
       for (var i in ticketDetails.package_details) {
                        await pdf.create(hndl_indiv_template(ticketDetails.package_details[i])).toFile('./indiv.pdf', async function (err, resp) {
                            if (err) return console.log(err);
                            if (resp) {
                                var bitmap = await fs.readFileSync(resp.filename);
                                var Buf = await Buffer(bitmap).toString('base64');
                                var x = {
                                    filename: `My-Ticket-${i+1}.pdf`,
                                    content: Buf,
                                    type: 'application/pdf',
                                    disposition: 'attachment'
                                }
                                await email_message.attachments.push(x)
                                // console.log(email_message.attachments.length)
                            }
                        })
                    }
      ```
      
      * Once all the attachments are completed we run the below code. The reason for doing this is to allow the javascript thread an opportunity to trigger any other events that may be waiting in the queue in our case pushing all the attachments inside the attachments array through our for loop. Javascript is single-threaded. If an event is triggered, it can only run when the currently running code has finished.
      ```javascript
      
       setTimeout(async() => {
                        await console.log("Number of attachments :",email_message.attachments.length)
                           
                        await sgMail.send(email_message, function (err, json) {
                        if (err) {
                            // return res.send("Email Couldnt be sent")
                            console.log(err)
                        }
                        else {
                            // res.send({
                            //     "msg": "email sent"
                            // })
                            console.log("email-sent")
                        }
                    });
    
                    }, 10000)
                    
      ```          
      
