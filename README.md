# HubSpot-CCA-Order-to-Deal
Description: HubSpot Custom Coded Action (CCA) that creates a Deal + Line Items from an Order + its Line Items. 
<br>
<br>
Use Case: Some eCommerce and ERP integrations (i.e. Shopify) will sync their order objects or abandoned cart objects to HubSpot Order objects. While this is intended to follow best data modeling practices, HubSpot revenue attribution reports rely on there being a Deal object. By using a custom coded action to convert Orders to Deals, you are able to power out-of-the-box revenue attribution reports. (Note: For abandoned cart Objects, second CCA might be required to merge the duplicate Deal, the one created via code and the second created via the integration after it's been purchased).  
<br>
<br>
Use this in an Order triggered workflow.
<br>
<br>
In your workflow, add an action to copy the output "dealID" to a string value on the Order's associated Contact. You can modify the code to create the Deal:Contact association OR this value can be used in another workflow to set the association using HubSpot's out-of-the-box association action. 


