"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const simple_storage_abi_1 = require("./simple-storage.abi");
let BlockchainService = class BlockchainService {
    client;
    contractAddress = '0x740F534cab196B819dBBfD1C2fBbA42cB17FCCA7';
    constructor() {
        this.client = (0, viem_1.createPublicClient)({
            chain: chains_1.avalancheFuji,
            transport: (0, viem_1.http)('https://api.avax-test.network/ext/bc/C/rpc'),
        });
    }
    async getLatestValue() {
        try {
            const value = await this.client.readContract({
                address: this.contractAddress,
                abi: simple_storage_abi_1.SIMPLE_STORAGE_ABI,
                functionName: 'getValue',
            });
            return {
                value: value.toString(),
                updatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            this.handleRpcError(error);
        }
    }
    async getValueUpdatedEvents(fromBlock = 0, toBlock = 'latest') {
        try {
            const logs = await this.client.getLogs({
                address: this.contractAddress,
                event: {
                    type: 'event',
                    name: 'ValueUpdated',
                    inputs: [
                        {
                            indexed: false,
                            name: 'newValue',
                            type: 'uint256',
                        },
                    ],
                },
                fromBlock: BigInt(fromBlock),
                toBlock: toBlock === 'latest' ? 'latest' : BigInt(toBlock),
            });
            return logs.map((log) => ({
                blockNumber: Number(log.blockNumber),
                value: log.args?.newValue?.toString(),
                txHash: log.transactionHash,
            }));
        }
        catch (error) {
            this.handleRpcError(error);
        }
    }
    handleRpcError(error) {
        const message = error?.message?.toLowerCase() || '';
        if (message.includes('network') ||
            message.includes('fetch') ||
            message.includes('failed')) {
            throw new common_1.ServiceUnavailableException('Tidak dapat terhubung ke blockchain RPC.');
        }
        throw new common_1.InternalServerErrorException('Terjadi kesalahan saat membaca data blockchain.');
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map