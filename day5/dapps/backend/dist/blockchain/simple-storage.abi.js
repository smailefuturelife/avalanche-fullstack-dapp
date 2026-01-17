"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMPLE_STORAGE_ABI = void 0;
exports.SIMPLE_STORAGE_ABI = [
    {
        "inputs": [],
        "name": "getValue",
        "outputs": [{ "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "name": "newValue", "type": "uint256" }
        ],
        "name": "ValueUpdated",
        "type": "event"
    }
];
//# sourceMappingURL=simple-storage.abi.js.map