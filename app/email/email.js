const express = require('express');
const fs = require('fs');
const handlebars = require("handlebars");
const app = express.Router();
var template = fs.readFileSync('./views/email.hjs', 'utf-8');

var hndl_template = handlebars.compile(template);
var indiv_template = fs.readFileSync('./views/indiv_ticket.hjs', 'utf-8');
var hndl_indiv_template = handlebars.compile(indiv_template);
var Buffer = require('buffer').Buffer
var options = { format: 'Letter' };
var pdf = require('html-pdf');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.get('/', async (req,res)=>{
    var ticketDetails = {
        firstName: 'Towfiq',
        email: 'soum.ragan@gmail.com',
        phone: '019228282',
        quantity: 2,
        order_date: '25 March 2019',
        order_time: '12am',
        trnsc_id: '1PXSJSJSJ',
        total_amount: 1600,
        package_details: [{
            firstName: 'Towfiq',
            email: 'towfiqur@stubapp.com',
            phone: '019228282',
            area_name: 'Main GranStand',
            package_name: 'Concert',
            package_type: 'Standard',
            quantity: 1,
            price: 750,
            order_date: '25 March 2019',
            order_time: '12am',
            trnsc_id: '1PXSJSJSJ',
            total_amount: 1600,
            package_serial_number: "GTLIY0000000022"
        },
        {
            firstName: 'Towfiq',
            email: 'towfiqur@stubapp.com',
            phone: '019228282',
            area_name: 'Main GranStand',
            package_name: 'Concert',
            package_type: 'Standard',
            quantity: 1,
            order_date: '25 March 2019',
            order_time: '12am',
            trnsc_id: '1PXSJSJSJ',
            total_amount: 1600,
            price: 850,
            package_serial_number: 'GTLIY0000000023'
        }]
    }

    var html = hndl_template(ticketDetails);
    var email_message = {
        to: ticketDetails.email,
        from: 'soum.ragan@gmail.com',
        subject: 'Here attached is your tickets',
        text: 'Your Ticket is attached with this email. Please view it.',
        attachments: [],
        html: html
    };
   


    try {
        try{
            pdf.create(html, options).toFile('./ticket.pdf', async function (err, res) {
            
                if (err) return console.log(err);
                if (res) {
                    // console.log(res); // { filename: '/app/businesscard.pdf' }
                    var bitmap = fs.readFileSync(res.filename);
                    var Buf = Buffer(bitmap).toString('base64');
                    email_message.attachments.push({
                        filename: `My-Ticket-${ticketDetails.firstName}.pdf`,
                        content: Buf,
                        type: 'application/pdf',
                        disposition: 'attachment'
                    })
                    // console.log(email_message.attachments.length)
                    // console.log(Buf)
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
                    
                }
            });
    
        }
        finally{
            setTimeout(()=>{
                res.send({
                    status:200,
                    msg:`Email sent to:${ticketDetails.firstName}`
                })
                // res.render('email',ticketDetails)
            },1000)
        }
        // return res.render('indiv_ticket', ticketDetails.package_details[0]);
        // return res.render('email',ticketDetails)

    }
    catch (error) {
        res.send(error)
    }

    // res.render('email',ticketDetails)
})

module.exports = app;