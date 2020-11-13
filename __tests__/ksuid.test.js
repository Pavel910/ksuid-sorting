const KSUID = require("ksuid");
const { DocumentClient } = require("aws-sdk/clients/dynamodb");

describe("test KSUID sorting", () => {
    const docClient = new DocumentClient({
        convertEmptyValues: true,
        sslEnabled: false,
        endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
        region: "local",
    });

    test("should properly order items", async () => {
        // Generate documents
        const insert = [];
        for (let i = 1; i <= 5; i++) {
            insert.push({ id: `R#${KSUID.randomSync().string}`, order: i })
        }
        
        for (let i = 0; i < insert.length; i++) {
            await docClient
                .put({
                    TableName: "Items",
                    Item: {
                        PK: "T",
                        SK: insert[i].id,
                        ORDER: insert[i].order,
                    },
                })
                .promise();
        }

        // Load documents
        const { Items: items } = await docClient
            .query({
                TableName: "Items",
                KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
                ExpressionAttributeValues: {
                    ":PK": "T",
                    ":SK": "R#",
                },
                ScanIndexForward: true
            })
            .promise();

        console.log("expected order", insert);
        console.log("actual order", items);
        
        expect(items[0].ORDER).toBe(insert[0].order);
        expect(items[1].ORDER).toBe(insert[1].order);
        expect(items[2].ORDER).toBe(insert[2].order);
        expect(items[3].ORDER).toBe(insert[3].order);
        expect(items[4].ORDER).toBe(insert[4].order);
    });
});
