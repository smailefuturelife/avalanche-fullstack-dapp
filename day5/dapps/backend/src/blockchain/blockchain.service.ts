import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { SIMPLE_STORAGE_ABI } from './simple-storage.abi';

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}` =
    '0x740F534cab196B819dBBfD1C2fBbA42cB17FCCA7';

  constructor() {
    // Public client (READ ONLY)
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });
  }

 
  // Read Smart Contract

  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'getValue',
      });

      return {
        value: value.toString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      this.handleRpcError(error);
    }
  }

  
  // Event Query


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
    } catch (error: any) {
      this.handleRpcError(error);
    }
  }

  // RPC Error Handler
 
  private handleRpcError(error: any): never {
    const message = error?.message?.toLowerCase() || '';

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException(
        'Tidak dapat terhubung ke blockchain RPC.',
      );
    }

    throw new InternalServerErrorException(
      'Terjadi kesalahan saat membaca data blockchain.',
    );
  }
}
