const Database = require("@replit/database");
const db = new Database();

const http = require("http");
const cors = require("cors");
const url = require("url");
const querystring = require("querystring");

const corsOptions = {
  origin: "*", // Allow requests from any origin. You can specify a specific origin instead.
  methods: "GET, POST, PUT, DELETE", // Allowed request methods
  allowedHeaders: "Content-Type", // Allowed request headers
};


const server = http.createServer((req, res) => {
  // Set CORS headers
	cors(corsOptions)(req, res, () => {
    if (req.method === "POST") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        var info = JSON.parse(data);
        console.log("Parsed:", info);
        let email, password, username, func;

        if (info.email == null || info.email == "") {
          console.log(info.email);
          res.end("Failed, Please Define Email First");
          return;
        }

        if (info.username == null || info.username == "") {
          console.log("Username:", info.username);
          res.end("Please define a username first");
          return;
        }

        email = info.email;
        username = info.username;
        console.log("Email is here");

        if (info.password != null) {
          password = info.password;
          console.log("Password is here");
          if (info.func === "delete") {
            db.get(`Account:${email}`).then((value) => {
              fix = JSON.parse(value);
              console.log(fix.password, "--->", password);
              if (fix.password === password) {
                db.delete(`Account:${email}`);
                console.log(`Account ${email} has been deleted from DB`);
                res.end("Account Deleted From DB");
                return;
              }
            });
          }
          if (info.func === "ip") {
            console.log("Whitelisted IP Addresses Requested");

            // Assuming Auth:IP_1 to Auth:IP_100 are stored consecutively in the database
            const numberOfIPs = 100;

            // Use a loop to check each IP address
            for (let i = 1; i <= numberOfIPs; i++) {
              const key = `Auth:IP_${i}`;

              db.get(key).then((value) => {
                const IP = JSON.parse(JSON.stringify(value));

                if (info.email === IP) {
                  console.log("Authorized");
                  res.end("Proceed");
                  return;
                }
              });
            }
            setTimeout(function () {
              res.end("Unknown");
              console.log("Unknown IP Address");
            }, 2500);
            return;
          } else if (info.func === "ip-add") {
            name = Math.floor(Math.random() * 99) + 2;
            db.set(`Auth:IP_${name}`, info.email).then(() => {
              console.log(
                `Added IP ${info.email} To Whitelist As Auth:IP_${name}`,
              );
              res.end("Added");
              return;
            });
            return;
          }

          const myObject = {
            email: email,
            password: password,
            username: username,
          };
          db.get(`Account:${email}`).then((value) => {
            if (value !== null) {
              res.end("Account Exists. Retry");
            } else {
              db.set(`Account:${email}`, JSON.stringify(myObject)).then(() => {
                console.log("Account Has Been Saved To Database");
                res.end("Welcome Abroad");
              });
            }
          });
        }

        console.log(info);
        console.log("Ended");
      });
    } else if (req.method === "GET") {
      const { query } = url.parse(req.url);
			const { email, password, admin, search, username, applications, what, note, name, coupon } = querystring.parse(query);

			if (applications != null && coupon != null && email != null && password != null && username != null) {
				//Client wants to check if coupon code is valid
				db.get(`Account:${email}`).then((value) => {
					console.log(value);
					const info = JSON.parse(value);
					if (
						info.email === email &&
						info.username === username &&
						info.password === password
					) {
						//Verified
						if (applications === "notes") {
							if (coupon === process.env['notes_coupon_1']) {
								console.log("VALID COUPON")
								let what = "Notes"
								if (what === "Notes" || what === "Images" || what === "Chatvia") {
									db.get(`Apps:${email}`).then((apps) => {
										if (apps === null) {
											//no apps registered yet
											db.set(`Apps:${email}`, `{"${what}": "owned"}`).then(() => {
												res.end(`Registered To Evox ${what}`);
											});
										} else {
											var jsonObject = JSON.parse(apps);
											var propertyName = what;
											console.log(jsonObject[propertyName]); //undefined
											if (jsonObject[propertyName] == null) {
												jsonObject[propertyName] = "owned";
												var finalJsonString = JSON.stringify(jsonObject);
												db.set(`Apps:${email}`, `${finalJsonString}`).then(() => {
													res.end(`Registered To Evox ${what}`);
												});
											} else {
												res.end(`Evox ${what} is already owned by ${username}`);
											}
											//some apps registered add to existing value
										}
									});
								} else {
									res.end("Process Failed (Error Code 2)"); //err code 2 = unknown evox product
								}
							} else {
								res.end("Invalid Coupon")
							}
						} else if (applications === "images") {
							if (coupon === process.env['images_coupon_1']) {
								console.log("VALID COUPON")
								let what = "Images"
								if (what === "Notes" || what === "Images" || what === "Chatvia") {
									db.get(`Apps:${email}`).then((apps) => {
										if (apps === null) {
											//no apps registered yet
											db.set(`Apps:${email}`, `{"${what}": "owned"}`).then(() => {
												res.end(`Registered To Evox ${what}`);
											});
										} else {
											var jsonObject = JSON.parse(apps);
											var propertyName = what;
											console.log(jsonObject[propertyName]); //undefined
											if (jsonObject[propertyName] == null) {
												jsonObject[propertyName] = "owned";
												var finalJsonString = JSON.stringify(jsonObject);
												db.set(`Apps:${email}`, `${finalJsonString}`).then(() => {
													res.end(`Registered To Evox ${what}`);
												});
											} else {
												res.end(`Evox ${what} is already owned by ${username}`);
											}
											//some apps registered add to existing value
										}
									});
								} else {
									res.end("Process Failed (Error Code 2)"); //err code 2 = unknown evox product
								}
							} else {
								res.end("Invalid Coupon")
							}
						} else if (applications === "chatvia") {
							if (coupon === process.env['chatvia_coupon_1']) {
								console.log("VALID COUPON")
								let what = "Chatvia"
								if (what === "Notes" || what === "Images" || what === "Chatvia") {
									db.get(`Apps:${email}`).then((apps) => {
										if (apps === null) {
											//no apps registered yet
											db.set(`Apps:${email}`, `{"${what}": "owned"}`).then(() => {
												res.end(`Registered To Evox ${what}`);
											});
										} else {
											var jsonObject = JSON.parse(apps);
											var propertyName = what;
											console.log(jsonObject[propertyName]); //undefined
											if (jsonObject[propertyName] == null) {
												jsonObject[propertyName] = "owned";
												var finalJsonString = JSON.stringify(jsonObject);
												db.set(`Apps:${email}`, `${finalJsonString}`).then(() => {
													res.end(`Registered To Evox ${what}`);
												});
											} else {
												res.end(`Evox ${what} is already owned by ${username}`);
											}
											//some apps registered add to existing value
										}
									});
								} else {
									res.end("Process Failed (Error Code 2)"); //err code 2 = unknown evox product
								}
							} else {
								res.end("Invalid Coupon")
							}
						} else {
							res.end("Application Does Not Exist")
						}
					}
				})
				return;
			}


      if (email != null && note == "create" && what != null && password != null && name != null) {
        db.get(`Account:${email}`).then((value) => {
          console.log(value);
          const info = JSON.parse(value);
          if (info.email === email && info.password === password) {
            console.log("Auth Ok");
            db.get(`Note:${email}-${name}`).then((isit) => {
							console.log(isit)
              if (isit == null) {
                db.set(`Note:${email}-${name}`, what).then(() => {
                  console.log(`New Note Saved [Note:${email}-${name}]`);
                  res.end(`Note Saved!`);
                });
              } else {
                res.end("Note Exists!");
              }
            });
          } else {
            res.end("Auth Failed. Wrong Credentials");
          }
        });
        return;
      }
      if (
        applications === "buy" &&
        email != null &&
        username != null &&
        password != null &&
        what != null
      ) {
        db.get(`Account:${email}`).then((value) => {
          console.log(value);
          const info = JSON.parse(value);
          if (
            info.email === email &&
            info.username === username &&
            info.password === password
          ) {
            //Verified
            if (what === "Notes" || what === "Images" || what === "Chatvia") {
              db.get(`Apps:${email}`).then((apps) => {
                if (apps === null) {
                  //no apps registered yet
                  db.set(`Apps:${email}`, `{"${what}": "owned"}`).then(() => {
                    res.end(`Registered To Evox ${what}`);
                  });
                } else {
                  var jsonObject = JSON.parse(apps);
                  var propertyName = what;
                  console.log(jsonObject[propertyName]); //undefined
                  if (jsonObject[propertyName] == null) {
                    jsonObject[propertyName] = "owned";
                    var finalJsonString = JSON.stringify(jsonObject);
                    db.set(`Apps:${email}`, `${finalJsonString}`).then(() => {
                      res.end(`Registered To Evox ${what}`);
                    });
                  } else {
                    res.end(`Evox ${what} is already owned by ${username}`);
                  }
                  //some apps registered add to existing value
                }
              });
            } else {
              res.end("Process Failed (Error Code 2)"); //err code 2 = unknown evox product
            }
          } else {
            res.end("Process Failed (Error Code 1)"); //err code 1 = wrong credentials
          }
        });
        return;
      }
      if (applications === "get" && email != null) {
        db.get(`Apps:${email}`).then((value) => {
          if (value != null) {
            try {
              // Parse the JSON data
              const parsedData = JSON.parse(value);

              // Extract variable names and their values
              const variableNamesAndValues = Object.entries(parsedData);

              // Construct the output string
              const outputString = variableNamesAndValues
                .map(([variable, status]) => `${variable}:${status}`)
                .join(", ");

              // Log the output to the console
              console.log(outputString);
              res.end(outputString);
            } catch (error) {
              res.end(
                `Server Error (this is not your fault!): ${error.message}`,
              );
              console.error("Error parsing JSON:", error.message);
            }
          } else {
            res.end("No Apps Owned");
          }
        });
        return;
      }

      if (admin === "t50_username/password" && password === "yes") {
        console.log("WARNING! ADMIN PASS");

        const resultObject = {};

        db.list().then((keys) => {
          // Loop through each account and run the command
          keys.forEach((accountKey) => {
            // Extract the email from the key
            const email = accountKey.split(":")[1];

            // Fetch the value for the current key
            db.get(accountKey).then((value) => {
              // Parse the value assuming it's a JSON string
              const accountInfo = JSON.parse(value);

              // Add the information to the resultObject using the email as the key
              resultObject[email] = accountInfo;

              // Print the result if needed

              return;
            });
          });
          setTimeout(function () {
            res.end(JSON.stringify(resultObject));
          }, 2500);
        });
      }

      if (email !== null) {
        if (password !== null) {
          db.get(`Account:${email}`).then((value) => {
            account = JSON.parse(value); //{ email: 'gregpap03@gmail.com', password: 'notyourtone' }
            if (account !== null) {
              if (account.password === password) {
                if (account.username == null) {
                  res.end(`Credentials Correct, Username:Anonymous`);
                }
                res.end(`Credentials Correct, Username:${account.username}`);
              } else {
                res.end("Credentials Incorrect");
              }
            } else {
              if (admin === "t50_accountnames") {
                if (password === "yes") {
                  console.log("Access ADMIN");
                  db.list().then((keys) => {
                    res.end(JSON.stringify(keys));
                    return;
                  });
                }
              } else if (
                admin === "t50_username/password" &&
                password === "yes"
              ) {
                console.log("WARNING! ADMIN PASS");

                const resultArray = [];

                async function fetchAccountInfo(accountKey) {
                  const email = accountKey.split(":")[1];
                  const value = await db.get(accountKey);
                  const accountInfo = JSON.parse(value);
                  resultArray.push({ email, ...accountInfo });
                }

                db.list()
                  .then(async (keys) => {
                    // Using Promise.all with map to fetch all account info concurrently
                    await Promise.all(keys.map(fetchAccountInfo));

                    // Convert the array to an object
                    const resultObject = resultArray.reduce((obj, item) => {
                      obj[item.email] = item;
                      return obj;
                    }, {});

                    // Send the response when all promises have resolved
                    setTimeout(function () {
                      res.end(JSON.stringify(resultObject));
                    }, 5000);
                  })
                  .catch((error) => {
                    // Handle errors here
                    console.error(error);
                    res.status(500).end("Internal Server Error");
                  });
              } else if (search == "username") {
                db.get(username).then((value) => {
                  const user = JSON.parse(value);
                  const username = user.username;
                  res.end(username);
                });
              } else {
                res.end("Connection Blocked");
              }

              console.log("Unwanted Request");
            }

            return;
          });
        }
      }
    } else {
      res.end("Unsupported request method");
    }
  });
});

const PORT = process.env.PORT || 3000; // Set the port number for the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

db.list().then((keys) => {
  console.log(keys);
});

//const str = "pfpdata=https://hackerx.xyz/Alexia.pfp&email=gregpap03@gmail.com";
//const arr = str.split("&"); // This will split the string into an array based on '&'
//const pfpdata = arr[0].split("=")[1]; // This will extract the value of 'pfpdata'
//const email = arr[1].split("=")[1]; // This will extract the value of 'email'
//console.log(pfpdata); // Output: https://hackerx.xyz/Alexia.pfp
//console.log(email); // Output: gregpap03@gmail.com

//db.set("Account:gregpap03@gmail.com", "79.131.254.162").then(() => {
//		console.log("ok")
//}}
