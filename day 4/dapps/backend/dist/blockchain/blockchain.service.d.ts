export declare class BlockchainService {
    private client;
    private contractAddress;
    constructor();
    getLatestValue(): Promise<{
        value: any;
        updatedAt: string;
    }>;
    getValueUpdatedEvents(fromBlock?: number, toBlock?: string): Promise<any>;
    private handleRpcError;
}
