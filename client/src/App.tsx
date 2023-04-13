import './App.css';
import { useState } from 'react';

function App() {
  let [currShipperID, setCurrShipperID] = useState<string>("");

  const fetchClassList = async () => {

    // const res = await fetch("https://my-container-apps.bluerock-b7a8c33e.westus2.azurecontainerapps.io/api/HttpExample?name=https://learn.microsoft.com/azure/cognitive-services/computer-vision/media/quickstarts/presentation.png", {
    //   method: "POST",
    // }
    // );
    const res = await fetch("/api/hello");

    const shippingData = await res.json();
    console.log(shippingData)

    // setShippersDataList(shippingData);
  };

    // set the current class id to the one selected in dropdown menu
    const handleChange = (event: any) => {
      setCurrShipperID(event.target.value);
    };
  
    const handleSubmit = (event: any) => {
      if (currShipperID !== "")
      fetchClassList();
      event.preventDefault();
    };
  return (
    <div className="App">
          <div style={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
          <input type="text" value={currShipperID} onChange={handleChange} />
        <input type="submit" value="Submit" />
      </form>
          </div>
    </div>
  );
}

export default App;
