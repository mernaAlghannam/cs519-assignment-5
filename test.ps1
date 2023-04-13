az extension add --upgrade --yes --name connectedk8s
az extension add --upgrade --yes --name k8s-extension
az extension add --upgrade --yes --name customlocation
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.Web --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az extension remove --name appservice-kube
az extension add --upgrade --yes --name appservice-kube


$aksClusterGroupName = "merna-group-name" # Name of resource group for the AKS cluster
$aksName = "${aksClusterGroupName}-aks" # Name of the AKS cluster
$resourceLocation = "eastus" # "eastus" or "westeurope"

az group create -g $aksClusterGroupName -l $resourceLocation
az aks create --resource-group $aksClusterGroupName --name $aksName --enable-aad --generate-ssh-keys
az aks get-credentials --resource-group $aksClusterGroupName --name $aksName --admin

kubectl get ns

$groupName = "merna-group-name" # Name of resource group for the connected cluster

az group create -g $groupName -l $resourceLocation

$clusterName = "${groupName}-cluster" # Name of the connected cluster resource

az connectedk8s connect --resource-group $groupName --name $clusterName

az connectedk8s show --resource-group $groupName --name $clusterName

$workspaceName = "$groupName-workspace"

az monitor log-analytics workspace create `
    --resource-group $groupName `
    --workspace-name $workspaceName

$logAnalyticsWorkspaceId = $(az monitor log-analytics workspace show `
        --resource-group $groupName `
        --workspace-name $workspaceName `
        --query customerId `
        --output tsv)


$logAnalyticsWorkspaceIdEnc = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($logAnalyticsWorkspaceId))# Needed for the next step
$logAnalyticsKey = $(az monitor log-analytics workspace get-shared-keys `
        --resource-group $groupName `
        --workspace-name $workspaceName `
        --query primarySharedKey `
        --output tsv)
$logAnalyticsKeyEnc = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($logAnalyticsKey))

$extensionName = "appservice-ext" # Name of the App Service extension
$namespace = "appservice-ns" # Namespace in your cluster to install the extension and provision resources
$kubeEnvironmentName = "merna-kube-environment-name" # Name of the App Service Kubernetes environment resource

az k8s-extension create `
    --resource-group $groupName `
    --name $extensionName `
    --cluster-type connectedClusters `
    --cluster-name $clusterName `
    --extension-type 'Microsoft.Web.Appservice' `
    --release-train stable `
    --auto-upgrade-minor-version true `
    --scope cluster `
    --release-namespace $namespace `
    --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" `
    --configuration-settings "appsNamespace=${namespace}" `
    --configuration-settings "clusterName=${kubeEnvironmentName}" `
    --configuration-settings "keda.enabled=true" `
    --configuration-settings "buildService.storageClassName=default" `
    --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" `
    --configuration-settings "customConfigMap=${namespace}/kube-environment-config" `
    --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${aksClusterGroupName}" `
    --configuration-settings "logProcessor.appLogs.destination=log-analytics" `
    --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${logAnalyticsWorkspaceIdEnc}" `
    --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${logAnalyticsKeyEnc}"

$extensionId = $(az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $clusterName `
        --resource-group $groupName `
        --name $extensionName `
        --query id `
        --output tsv)

kubectl get pods -n $namespace

$customLocationName = "my-custom-location" # Name of the custom location

$connectedClusterId = $(az connectedk8s show --resource-group $groupName --name $clusterName --query id --output tsv)

az customlocation create `
    --resource-group $groupName `
    --name $customLocationName `
    --host-resource-id $connectedClusterId `
    --namespace $namespace `
    --cluster-extension-ids $extensionId

az customlocation show --resource-group $groupName --name $customLocationName

$customLocationId = $(az customlocation show `
        --resource-group $groupName `
        --name $customLocationName `
        --query id `
        --output tsv)



az appservice kube create `
    --resource-group $groupName `
    --name $kubeEnvironmentName `
    --custom-location $customLocationId

az appservice kube show --resource-group $groupName --name $kubeEnvironmentName

az functionapp create --resource-group $customLocationGroup --name mernaappname --custom-location $customLocationId --storage-account mernastoragename  --functions-version 4 --runtime node --runtime-version 12 --deployment-container-image-name maalghan/azurefunctionsimage:v1.0.0