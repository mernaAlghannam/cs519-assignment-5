import express from "express";
import path from "path";
import fetch from "node-fetch"

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
// Serve the React static files after build
app.use(express.static("../client/build"));

app.listen(PORT, () => {
  // console.log(`Server listening on ${PORT}`);
});

app.get("/api/hello", (req, res) => {
  // const response = fetch()
  res.send({ message: "Hello" });
});

// app.get('/api/productImage/', async (req, res) => {
//   // fetch("https://my-container-apps.bluerock-b7a8c33e.westus2.azurecontainerapps.io/api/HttpExample?name="+req.params.imageUrl,
//   // { method: 'GET'}).then(res => res.json())
//   // .then(json => res.send(json));;

//   // try {
//   //   const apiResponse = await fetch(
//   //     "https://my-container-apps.bluerock-b7a8c33e.westus2.azurecontainerapps.io/api/HttpExample?name=https://outqueue.blob.core.windows.net/image/"+req.params.imageUrl)
//   //   const apiResponseJson = await apiResponse.json()

//   //   console.log(apiResponseJson)
//   //   res.send('Running 🏃')
//   // } catch (err) {
//   //   console.log(err)
//   //   res.status(500).send('Something went wrong')
//   // }
//   // request.headers({"x-functions-key": process.env.HOSTKEY });

//   // request.end(function (response) {
//   //   if (response.error) throw new Error(response.error);

//     res.send({ message: "hi" });
//   //   res.json(response.body || {});
//   // });

// });

// All other unmatched requests will return the React app
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});