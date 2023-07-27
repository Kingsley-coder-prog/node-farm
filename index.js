const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

/////////////////////////////////////////////////////////////
// FILES
// Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

/**
 * When you write File is async, we don't need 2 args but 1 which is the err arg
 * fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err)=>{})
 */

///////////////////////////////////////////////////////////
// Non-Blocking, Asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("Your file has been written!😁");
//       });
//     });
//   });
// });

// console.log("Will read this!");

/////////////////////////////////////////////////////////////
// SERVERS
/**
 * In order to build our server we have to do two things:
 * 1. Create the servers
 * 2. Start the servers
 * http.createServer()// accepts a callback function which will be fired off each time a new request hits our server. The callback function gets access to two important variables; (request,response)
 * The 'response' is sent back to the client, and it gives us a bunch of ways of sending the response in which .end() is the simplest
 */

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json"
    });
    res.end(data);

    // Not found
  } else {
    // In the 404 we can still send headers and to do that we need an object
    // An http header is simply a piece of information about the response we are sending back
    // The header and the 404 always need to be sent out before we send our 'response'
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world"
    }); // status code error
    res.end("<h1>Page not found!</h1>");
  }

  //   res.end("Hello from the server!!"); // .end is the simplest way of sending back a response
});

/**
 * Now to listen to the server that has been created, we can save the server in a variable, like above.
 * In order to listen to the server we need .listen() which takes in two args, one of which is a port(a sub-address on a host on a certain host) and a host.
 * local host standard IP address: '127.0.0.1'
 * we can include an optional callback function in the args, this will be run as soon as the server starts listening
 */

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});

// const server2 = http.createServer((req, res) => {
//   console.log("We are live!");
// });

// server2.listen(7000, "127.0.0.1", () => {
//   console.log("Another request incoming!");
// });

// ROUTING
/**
 * Inorder to be able to do routing the first step is in been able to analyse the url, and for that we need a built in node module called 'url'
 * When we are using a browser, the browser automatically performs a request for the website favicon
 * To implement the routing we need a big 'if/else' statement
 */
