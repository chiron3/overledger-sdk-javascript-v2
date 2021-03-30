//NOTE: You may need to run "yarn install" inside the examples/create-account folder, then node create-account.js
//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const CustomKeytool = require('@quantnetwork/overledger-keytool').default;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const partyAxrpPrivateKey = 'sswERuW1KWEwMXF6VFpRY72PxfC9b';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        //TODO: I do not know how to generate the jks file correctly via the PKCS12 flow
        //read from JKS file input and retrieve the key
        //const test = new CustomKeytool("JKS", true);
        //let keyFromFile = await test.getKeyFromFile("pk.jks", "password", "1");
        //console.log("Key: " + keyFromFile);

        //TODO: assuming i have the correct file, it would be a matter of decoding the keyFromFile back via Base64.decodeBase64 I am guessing
        //TODO: then that decoded value will be passed into the setAccount method for Ripple account.

        const overledger = new OverledgerSDK({
            dlts: [{ dlt: DltNameOptions.BITCOIN },
            { dlt: DltNameOptions.ETHEREUM },
            { dlt: DltNameOptions.XRP_LEDGER }
            ],
            provider: { network: 'testnet' },
        });

        let preparedTransaction = "{\n" +
            " \"requestId\": \"b670c3ec-1bd9-4773-8e9d-aa18868c8648\",\n" +
            "    \"requestTime\": null,\n" +
            "    \"gatewayFee\": 10,\n" +
            "    \"gatewayFeeUnit\": \"QNT\",\n" +
            "    \"nativeData\": {\n" +
            "\t\t\t  \"TransactionType\":\"Payment\",\n" +
            "\t\t\t  \"Account\":\"rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC\",\n" +
            "\t\t\t  \"Destination\":\"rKoGTTkPefCuQR31UHsfk9jKnrQHz6LtKe\",\n" +
            "\t\t\t  \"Amount\":\"1\",\n" +
            "\t\t\t  \"Flags\":2147483648,\n" +
            "\t\t\t  \"Memos\":\n" +
            "\t\t\t    [\n" +
            "\t\t\t        {\n" +
            "\t\t\t            \"Memo\":\n" +
            "\t\t\t                {\n" +
            "\t\t\t                    \"MemoData\":\"4F564C2053444B2054657374\"\n" +
            "\t\t\t                }\n" +
            "\t\t\t        }\n" +
            "\t\t\t   ],\n" +
            "\t\t\t   \"LastLedgerSequence\":4294967295,\n" +
            "\t\t\t   \"Fee\":\"12\",\n" +
            "\t\t\t   \"Sequence\":557\n" +
            "\t\t\t }\n" +
            "}"

        overledger.dlts[DltNameOptions.XRP_LEDGER].setAccount({privateKey: partyAxrpPrivateKey});

        let result = await overledger.sign(DltNameOptions.XRP_LEDGER, JSON.parse(preparedTransaction) );
        console.log("Signed: " + JSON.stringify(result));

    } catch (e) {
        console.error('error', e);
    }
})();