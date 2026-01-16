export declare const SIMPLE_STORAGE_ABI: readonly [{
    readonly inputs: readonly [];
    readonly name: "getValue";
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly name: "newValue";
        readonly type: "uint256";
    }];
    readonly name: "ValueUpdated";
    readonly type: "event";
}];
