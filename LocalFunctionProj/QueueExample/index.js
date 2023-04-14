const fetch = require("node-fetch"); // 1


async function main(context, message) {
    context.log('Node.js queue trigger function processed work item', message);
    // OR access using context.bindings.<name>
    // context.log('Node.js queue trigger function processed work item', context.bindings.myQueueItem);
    context.log('expirationTime =', context.bindingData.expirationTime);
    context.log('insertionTime =', context.bindingData.insertionTime);
    context.log('nextVisibleTime =', context.bindingData.nextVisibleTime);
    context.log('id =', context.bindingData.id);
    context.log('popReceipt =', context.bindingData.popReceipt);
    context.log('dequeueCount =', context.bindingData.dequeueCount);
  
    const headers = {            
        "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
        "Content-Type": "application/json"}

    // const fetch = await import('node-fetch');
    const response = await fetch("https://assignment5image.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview",
        { method: 'POST', headers: headers, 
        body: "{'url':'"+message+"'}"});

    const imageCont = await response.json()


    context.log(imageCont);
    context.bindings.productImage = JSON.stringify([imageCont]);

};

module.exports = { main };

