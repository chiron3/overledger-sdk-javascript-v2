import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import Provider, { TESTNET } from '@quantnetwork/overledger-provider';
import { NetworkOptions, DLTOptions, SDKOptions } from '@quantnetwork/overledger-types';
/**
 * **
 * @memberof module:overledger-core
 */
class OverledgerSDK {
    /**
     * The object storing the DLTs loaded by the Overledger SDK
     */
    dlts: { [key: string]: AbstractDLT } = {};
    network: NetworkOptions;
    provider: Provider;

    /**
     * Create the Overledger SDK
     *
     * @constructor
     * @param {SDKOptions} options The DLT Options and Provider Options
     */
    constructor(options: SDKOptions) {
        this.network = options.provider && options.provider.network || TESTNET;

        this.validateOptions(options);

        options.dlts.forEach((dltConfig: DLTOptions) => {
            const dlt = this.loadDlt(dltConfig);
            this.dlts[dlt.name] = dlt;
        });

        this.provider = new Provider(options.provider);
    }

    /**
     * Validate the provided Overledger SDK Options
     *
     * @param {SDKOptions} options The DLT Options and Provider Options
     */
    private validateOptions(options: SDKOptions): void {
        if (!options.dlts) {
            throw new Error('The dlts are missing');
        }
    }

    /**
     * Load the DLT in the Overledger SDK
     *
     * @param {DLTOptions} config DLT name and an optional Private Key to use as the main account
     *
     * @return {AbstractDLT} The loaded DLT class
     */
    private loadDlt(config: DLTOptions): AbstractDLT {

        const dltName = `overledger-dlt-${config.dlt}`;
        try {
            const provider = require(`@quantnetwork/${dltName}`).default;

            return new provider(this, config);
        } catch (error) {
            if (error.code === 'MODULE_NOT_FOUND') {
                throw `Could not find the package for this DLT. Please install @quantnetwork/${dltName} manually.`;
            }
        }
    }
}

export default OverledgerSDK;

