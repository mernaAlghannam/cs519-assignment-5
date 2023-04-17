import './App.css';
import { useState } from 'react';
import {BlobServiceClient} from "@azure/storage-blob"

function App() {
  const [file, setFile] = useState<File >()


    // // set the current class id to the one selected in dropdown menu
    // const handleChange = (event: any) => {
    //   setCurrShipperID(event.target.value);
    // };

    const handleChange2 = ( event:any) => {
      setFile(event.target.files[0])
      console.log(event.target.files[0].type)
      console.log(event.target.files[0].name)
    };
  
    // const handleSubmit = (event: any) => {
    //   if (currShipperID !== "")
    //   fetchClassList();
    //   event.preventDefault();
    // };

    const handleSubmit2 = async () => {
      if (!file){
        return
      }

      const connectionstring = "BlobEndpoint=https://outqueue.blob.core.windows.net/;QueueEndpoint=https://outqueue.queue.core.windows.net/;FileEndpoint=https://outqueue.file.core.windows.net/;TableEndpoint=https://outqueue.table.core.windows.net/;SharedAccessSignature=sv=2021-12-02&ss=b&srt=co&sp=rwdlaciytfx&se=2023-07-27T08:37:57Z&st=2023-04-14T00:37:57Z&spr=https&sig=aLGp1BRUodkqvHis%2BaFZN2syq3UTESoifbzSPApvUF0%3D"
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionstring);
      const containerName = "image"
      const containerClient = blobServiceClient.getContainerClient(containerName)
      console.log("hello")
      console.log(file.name)
      const blob = new Blob([file], {type: file.type});
      const blockBlobClient = containerClient.getBlockBlobClient(file.name)
      await blockBlobClient.uploadData(blob)
      alert("successfully added to queue")

      // const res = await fetch("/api/productImage/https://outqueue.blob.core.windows.net/image/commImg");
      const res = await fetch("https://my-container-apps.bluerock-b7a8c33e.westus2.azurecontainerapps.io/api/HttpExample?name=https://outqueue.blob.core.windows.net/image/"+file.name
      );

      const shippingData = await res.json();
      console.log(shippingData)

      
      // const res = await fetch("/api/productImage/https://outqueue.blob.core.windows.net/image/"+file.name);

      // const shippingData = await res.json();
      // console.log(shippingData)

      alert("successfully added to queue")
  
    }


  return (
    <div className="App">
          {/* <div style={{ width: "100%" }}> */}
      {/* <form onSubmit={handleSubmit}>
          <input type="text" value={currShipperID} onChange={handleChange} />
        <input type="submit" value="Submit" />
      </form> */}
          {/* </div> */}
        <form onSubmit={handleSubmit2}>
          <h1>React File Upload</h1>
          <input type="file" onChange={handleChange2}/>
          <button type="submit">Upload</button>
        </form>
    </div>
  );
}

export default App;
