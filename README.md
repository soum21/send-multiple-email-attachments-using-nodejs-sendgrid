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
