# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:4-node16-appservice
FROM mcr.microsoft.com/azure-functions/node:4-node16

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    queueconnectionstring=DefaultEndpointsProtocol=https;AccountName=outqueue;AccountKey=Wl5sqxOD31D92vsxiqrYVdPn6T4XgJcUA6MgjjnlE7OvIT+AZCuT15c0Ty6EzS+u2C/qc06LurCI+AStxdyTag==;EndpointSuffix=core.windows.net \
    shipping-data-dbs-acc_DOCUMENTDB=AccountEndpoint=https://shipping-data-dbs-acc.documents.azure.com:443/;AccountKey=5Nt6vj3gjIPwv24QMmjlXuy2FAc31D5OE5FttwTbjdKji0hfKhE4TawvrGzo4kQiZ1KzsNz1NzXxACDbTnz6mQ==; \
    CORS_ALLOWED_ORIGIN='["*"]'

COPY . /home/site/wwwroot

RUN cd /home/site/wwwroot && \
    npm install \
    npm install node-fetch@2