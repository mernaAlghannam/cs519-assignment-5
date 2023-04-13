const https = require("https"); // 1

    // const headers = {            
    //     "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
    //     "Content-Type": "application/json"
    // };

// const options = {
//     hostname: 'assignment5image.cognitiveservices.azure.com',
//     path: '/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview',
//     method: 'POST',
//     headers: {            
//             "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
//             "Content-Type": "application/json",
//             "Content-Length": Buffer.byteLength(message)
//         }
//   };

/**
 * Do a request with options provided.
 *
 * @param {Object} options
 * @param
 * @return {Promise} a promise of request
 */
function doRequest(options, message) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          resolve(JSON.parse(responseBody));
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(JSON.stringify({ "url": message }));
  
      req.end();
      
    });
  }

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
  
    // const headers = {            
    //     "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
    //     "Content-Type": "application/json"}

    // const fetch = await import('node-fetch');
    // const response = await fetch("https://assignment5image.cognitiveservices.azure.com/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview",
    //     { method: 'POST', headers: headers, 
    //     body: "{'url':'"+message+"'}"});
    // const https = require('https');
    // const https = await import('https');

    const options = {
        hostname: 'assignment5image.cognitiveservices.azure.com',
        path: '/computervision/imageanalysis:analyze',
        method: 'POST',
        headers: {            
                "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
                "Content-Type": "application/json"
                // ,
                // "Content-Length": Buffer.byteLength(message)
            },
        query: {
            "features": 'caption,read',
            "model-version": 'latest',
            "language": 'en',
            "api-version": '2023-02-01-preview'
          }  
      };

    const presponse = await doRequest(options, message)

    context.log(presponse);
    context.bindings.productImage = JSON.stringify([presponse]);


    // const headers = {            
    //     "Ocp-Apim-Subscription-Key": "d630391f89a1458081f51b7bf5b1de73",
    //     "Content-Type": "application/json"
    // };
    
    // const postData = JSON.stringify({ "url": message });
    
    // const options = {
    //     hostname: 'assignment5image.cognitiveservices.azure.com',
    //     path: '/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-02-01-preview',
    //     method: 'POST',
    //     headers: headers
    // };
    
    // const req = https.request(options, (res) => {
    //     let data = '';
    //     res.on('data', (chunk) => {
    //         data += chunk;
    //     });
    //     res.on('end', () => {
    //         const imageContent = JSON.parse(data);
    //         context.log(imageContent);
    //         context.bindings.productImage = JSON.stringify([imageContent]);
    //     });
    // });
    
    // req.on('error', (error) => {
    //     context.log.error(error);
    // });
    
    // req.write(postData);
    // req.end();
    
    // const imageContent = await response.json()
    // context.log(imageContent);
    
    // context.bindings.productImage = JSON.stringify([imageContent]);
};

module.exports = { main };

