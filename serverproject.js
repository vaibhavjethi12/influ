let express = require("express");
let mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary").v2;
let app = express();
app.listen(3000, function () {
    console.log("server started");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());
// let config = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "Vaibhav819@",
//     database: "project",
//     dateStrings: true
// }
// let config = {
//     host: "bduhmx4lb0nkhqvzywlw-mysql.services.clever-cloud.com",
//     user: "ugjpqfl9yo29hnex",
//     password: "6uQ8GPcmG5lThFXW4sb5",
//     database: "bduhmx4lb0nkhqvzywlw",
//     dateStrings: true,
//     keepAliveInitialDelay: 10000,
//     enableKeepAlive:true,

// }
cloudinary.config({
    cloud_name: 'dsojru3mk',
    api_key: '939444882175493',
    api_secret: 'rkqgwSpwYvxo4YB5Sgd_JeuEN_0' // Click 'View Credentials' below to copy your API secret
});
let config = "mysql://avnadmin:AVNS_aMxvU4XS6-tPNfgQpO1@mysql-eddeb61-vaibhavjethi819-54e7.g.aivencloud.com:17041/defaultdb";
let mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("connected to database ");
    else
        console.log(err.message + "#############");
})


// adgag
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index2.html";
    resp.sendFile(path);
})
app.get("/signup-process", function (req, resp) {
    // console.log(req.query);
    let txtem = req.query.signem;
    let txtpass = req.query.signp;
    let txtcom = req.query.combo;
    mysql.query("insert into users values(?,?,?,?)", [txtem, txtpass, txtcom, 1], function (err) {

        if (err == null) {
            // console.log("afaf")

            resp.send("signed up successfully !!!!");
        }
        else
            resp.send(err.message);
    })


})
app.get("/login-process", function (req, resp) {
    let email = req.query.loginem;
    let txtp = req.query.loginp;
    mysql.query("select * from users where email=? and pwd=?", [email, txtp], function (err, result) {
        //console.log(result);
        if (err != null) {
            resp.send(err.message);
            return;
        }
        if (result.length == 0) {
            resp.send("invalid email id or password");
            return;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype);
            return;
        }
        else {
            resp.send("u r blocked!!");
            return;

        }
    })
})
app.get("/influ-dash", function (req, resp) {
    let path = __dirname + "/public/influ-dash.html";
    resp.sendFile(path);
})
app.get("/info-profile", function (req, resp) {
    let path = __dirname + "/public/info-profile.html";
    resp.sendFile(path);
})
app.post("/profile-save",  async function (req, resp) {
    let filename = "";
    if (req.files.ppic != null) {
        filename = req.files.ppic.name;
        let path = __dirname + "/public/upload/" + filename;
        await cloudinary.uploader.upload(path)
            .then(function (result) {
                filename = result.url;
            }).catch(function(err){
                console.error("error: "+error);
            });
        req.files.ppic.mv(path);
    }
    else {
        filename = "nopic.jpg";
    }
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.Email, req.body.name, req.body.gender, filename, req.body.dob, req.body.Address, req.body.city, req.body.cont, req.body.field.toString(), req.body.insta, req.body.fb, req.body.youtube, req.body.other], function (err,result) {
        if (err == null)
            resp.redirect("result.html");
        else
            resp.send(err.message);
    })
})

app.post("/profile-update",async  function (req, resp) {
    let filename = "";
    if (req.files != null) {
        filename = req.files.ppic.name;
        let path = __dirname + "public/upload/" + filename;
        req.files.ppic.mv(path);
        await cloudinary.uploader.upload(path)
            .then(function (result) {
                filename = result.url;
            }).catch(function(err){
                console.error("error: "+error);
            });

    }
    else {
        filename = req.body.hdn;
    }

    mysql.query("update iprofile set iname=?,gender=?,picpath=?,dob=?,address=?,city=?,contact=?,field=?,insta=?,fb=?,youtube=?,others=? where email=?", [req.body.name, req.body.gender, filename, req.body.dob, req.body.Address, req.body.city, req.body.cont, req.body.field, req.body.insta, req.body.fb, req.body.youtube, req.body.other, req.body.Email], function (err,result) {
        if (err == null) {
            if (result.affectedRows >= 1)
                resp.redirect("result.html");
            else
                resp.send("invalid email id")
        }
        else
            resp.send(err.message);
    })
})
app.get("/find-user", function (req, resp) {
    //console.log(req.query.Email)

    let email = req.query.Email;
    mysql.query("select * from iprofile where email=?", [email], function (err, resultjson) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjson);
    })

})
app.get("/save-event", function (req, resp) {
    email = req.query.Bemail;
    title = req.query.eventt;
    bdate = req.query.bdate;
    time = req.query.stime;
    v = req.query.venue;
    city = req.query.bcity;
    mysql.query("insert into evn values(null,?,?,?,?,?,?)", [email, title, bdate, time, city, v], function (err) {
        if (err == null) {
            resp.send("event registered");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/change-pass", function (req, resp) {
    let semail = req.query.semail;
    let newpass = req.query.snewpass;
    let oldpass = req.query.soldpass;
    let repeatpass = req.query.srpass;
    mysql.query("select * from users where email=?", [semail], function (err, jsonres) {
        if (oldpass == jsonres[0].pwd) {
            //console.log("true");
            if (repeatpass == newpass) {
                mysql.query("update users set pwd=? where email=?", [newpass, semail], function (err, res) {
                    if (err == null) {
                        if (res.affectedRows >= 1)
                            resp.send("updated password ");
                        else {
                            resp.send("invalid email");
                        }
                    }
                    else {
                        resp.send(err.message);
                    }
                })

            }
            else {
                resp.send("repeat password not match with new password")
            }



        }
        else {
            resp.send("check your old password");
        }
    })


})
app.get("/send-pass", function (req, resp) {
    let retpwd;
    let toem = req.query.loginem;

    mysql.query("select * from users where email=?", [toem], function (err, result) {
        if (err == null) {
            if (toem == "") {
                resp.send("fill email plz")
            }
            else {


                console.log(result[0].pwd);
                retpwd = result[0].pwd;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // use SSL
                    auth: {
                        user: 'vaibhavjethi819@gmail.com',
                        pass: 'qtek vsnf qvek mphd',
                    }
                });
                var mailOptions = {
                    from: 'vaibhavjethi819@gmail.com',
                    to: req.query.loginem,
                    subject: "sending email using nodemailer",
                    html: "Thank you for placing your order<br>visit again-your old pass is" + retpwd,
                };
                transporter.sendMail(mailOptions, function (error, info) {

                    if (error != null) {
                        console.log("Error:" + error);
                    } else {
                        console.log('Email sent: ' + info.response);

                    }
                })
                resp.send("password retrieved");
            }
        }
        else {
            resp.send(err.message);
        }
    })

})
app.get("/admin-dash", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html"
    resp.sendFile(path);
})
app.get("/admin-users", function (req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
})
app.get("/admin-all-influ", function (req, resp) {
    let path = __dirname + "/public/admin-all-influ.html";
    resp.sendFile(path);

})
app.get("/fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })
})
app.get("/del-one", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted successfully")
    })
})
app.get("/fetch-all-inf", function (req, resp) {
    mysql.query("select * from iprofile", function (err, res) {

        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })
})
app.get("/dodelinf", function (req, resp) {
    mysql.query("delete from iprofile where email=?", [req.query.email], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted successfully")
    })


})
app.get("/do-block", function (req, resp) {
    //console.log(req.query.email);
    mysql.query("update users set status=0 where email=?", [req.query.email], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("blocked user");
    }
    )
})
app.get("/do-resume", function (req, resp) {
    //console.log(req.query.email);
    mysql.query("update users set status=1 where email=?", [req.query.email], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("blocked user");
    }
    )
})
app.get("/influ-finder", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
})
app.get("/fill-city", function (req, resp) {
    mysql.query("select distinct city from iprofile", function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })
})
app.get("/fill-distinct", function (req, resp) {

    mysql.query("select distinct city from iprofile where field=? ", [req.query.sfield], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })
})
app.get("/findbyname", function (req, resp) {
    let name = "%" + req.query.sname + "%";
    mysql.query("select * from iprofile where iname like ?", [name], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })

})
app.get("/findbyfandcity", function (req, resp) {
    let field = "%" + req.query.sfield + "%";
    let city = "%" + req.query.scity + "%";
    mysql.query("select * from iprofile where field like ? and city like ? ", [field, city], function (err, res) {
        if (err != null) {

            resp.send(err.message);
            return;

        }
        resp.send(res);

    })
})
app.get("/event-manageropen", function (req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
})
app.get("/fetch-event-details", function (req, resp) {
    mysql.query("select * from evn where doe>=current_date()", function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);
    })


})
app.get("/delevent", function (req, resp) {
    console.log(req.query.email);
    mysql.query("delete from evn where emailid=?", [req.query.email], function (err, res) {

        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted successfully")
    })
})
app.get("/cprofile-save", function (req, resp) {
    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [req.query.cEmail, req.query.cname, req.query.ccity, req.query.cstate, req.query.ctype, req.query.ccont], function (err, res) {
        if (err == null)
            resp.redirect("result.html");
        else
            resp.send(err.message);

    })

})
app.get("/cprofile-update", function (req, resp) {
    mysql.query("update cprofile set iname=?,city=?,state=?,org=?,mobile=? where email=?", [req.query.cname, req.query.ccity, req.query.cstate, req.query.ctype, req.query.ccont, req.query.cEmail], function (err, res) {
        if (err == null) {
            if (res.affectedRows >= 1)
                resp.redirect("result.html");
            else
                resp.send("invalid email id")
        }
        else
            resp.send(err.message);

    })

})
app.get("/find-client", function (req, resp) {
    let email = req.query.cEmail;
    mysql.query("select * from cprofile where email=?", [email], function (err, res) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(res);

    })
})
app.get("/info-cprofile", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})
app.get("/findbyc", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
})
app.get("/change-passc", function (req, resp) {
    let scemail = req.query.scemail;
    let newpass = req.query.snewpass;
    let oldpass = req.query.soldpass;
    let repeatpass = req.query.srpass;
    mysql.query("select * from users where email=?", [scemail], function (err, jsonres) {
        if (err != null) {
            console.log(err.message);
            return;
        }
        if (oldpass == jsonres[0].pwd) {


            if (repeatpass == newpass) {
                mysql.query("update users set pwd=? where email=?", [newpass, scemail], function (err, res) {
                    if (err == null) {
                        if (res.affectedRows >= 1)
                            resp.send("updated password ");
                        else {
                            resp.send("invalid email");
                        }
                    }
                    else {
                        resp.send(err.message);
                    }
                })

            }
            else {
                resp.send("repeat password not match with new password")
            }



        }
        else {
            resp.send("check your old password");
        }
    })


})
app.get("/admin-open", function (req, resp) {
    //console.log(req.query.adminpass)
    let pass = req.query.adminpass;
    if (pass === 'Vaibhav819@2005') {
        resp.send("Correct pass");

    }
    else {
        resp.send("Wrong password No Access!!!");
    }
})