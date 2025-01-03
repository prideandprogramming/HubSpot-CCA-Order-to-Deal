const hubspot = require("@hubspot/api-client");
//replace "PrivateApp" with your own app
exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.PrivateApp,
  });
  //Set order variables from trigger order
  const orderId = event.inputFields["hs_object_id"];
  const ordername = event.inputFields["hs_order_name"];
  const orderamount = event.inputFields["hs_amount"];

  console.log(ordername, orderamount);

  console.log("ID: " + orderId);

  //create a new deal first with the order details
  let dealProps = {
    dealname: ordername,
    amount: orderamount,
    stage: "79419250-f38b-4c5e-abb6-a8782df5c046",
  };
  hubspotClient.crm.deals.basicApi
    .create(dealProps)
    .then((result) => {
      //assign newly created deal id for later use
      const dealId = result.id;
      console.log(dealId);
      //get line items associated to the order
      hubspotClient.crm.associations.v4.basicApi
        .getPage("orders", orderId, "line_items")
        .then((result) => {
          //console.log("order data ", result);
          console.log("order line items", result.results);
          //take orders line items and prep batch read body
          const lineItemIdArray = extractToObjectIds(result.results);
          console.log("line item id array", lineItemIdArray);
          //const lineItemIdReadInput = createIdArray(lineItemIdArray);
          const lineItemProperties = ["name", "amount"];
          const lineItemBatchRead = {
            inputs: lineItemIdArray,
            properties: lineItemProperties,
          };
          console.log("line item batch read", lineItemBatchRead);
          //read details of order's line items in batch
          hubspotClient.crm.lineItems.batchApi
            .read(lineItemBatchRead)
            .then((result) => {
              const orderLineItemDetails = result.results;
              console.log("read result", result);
              console.log("order line item details", orderLineItemDetails);
              //const newLineItemIds = extractLineItemIds(orderLineItemDetails)
              //create the batch body by transforming the batch line item details
              const lineItemBatchBody = transformLineItems(
                orderLineItemDetails,
                dealId
              );
              console.log(lineItemBatchBody);
              //create new line items and associate each to the new deal
              hubspotClient.crm.lineItems.batchApi
                .create({ inputs: lineItemBatchBody })
                .then((result) => {
                  console.log("create results", result.results);
                  callback({
                    outputFields: {
                      orderId: orderId,
                      dealId: dealId,
                    },
                  });
                })
                .catch((err) => {
                  console.log(err.body);
                });
            })
            .catch((err) => {
              console.log(err.body);
            });
        });
    })
    .catch((err) => {
      console.log(err.body);
    });
};

function transformLineItems(inputArray, dealId) {
  // Map over the input array to transform each object
  return inputArray.map((item) => {
    // Construct the associations array
    const associations = [
      {
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 20,
          },
        ],
        to: {
          id: dealId, // Replace with actual dealId if available
        },
      },
    ];

    // Assume that all property values should be converted to strings
    const properties = {
      name: String(item.properties.name),
      amount: String(item.properties.amount),
    };

    // Return the new object structure
    return {
      associations: associations,
      objectWriteTraceId: item.id,
      properties: properties,
    };
  });
}

function createIdArray(ids) {
  return ids.map((id) => ({
    id: id.toString(), // Convert the ID to a string
  }));
}

function extractToObjectIds(data) {
  return data.map((item) => {
    return { id: item.toObjectId };
  });
}
function extractLineItemIds(data) {
  // Use map function to extract ids from each result object
  return data.map((result) => result.id);
}
