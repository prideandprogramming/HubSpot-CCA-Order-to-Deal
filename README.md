# HubSpot-CCA-Order-to-Deal
Description: HubSpot Custom Coded Action (CCA) that creates a Deal + Line Items from an Order + its Line Items. 
<br>
<br>
Use Case: Some eCommerce and ERP integrations (i.e. Shopify) will sync their order objects or abandoned cart objects to HubSpot Order objects. While this is intended to follow best data modeling practices, HubSpot revenue attribution reports rely on there being a Deal object. By using a custom coded action to convert Orders to Deals, you are able to power out-of-the-box revenue attribution reports. (Note: For abandoned cart Objects, second CCA might be required to merge the duplicate Deal, the one created via code and the second created via the integration after it's been purchased).  


