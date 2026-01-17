'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';


// CONFIG SMART CONTRACT


const CONTRACT_ADDRESS = '0x740F534cab196B819dBBfD1C2fBbA42cB17FCCA7';

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];


// BACKEND CONFIG

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


// PAGE

export default function Page() {

  // WALLET

  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();


  // LOCAL STATE

  const [inputValue, setInputValue] = useState('');

  // BACKEND STATE (DITAMBAHKAN)
  const [backendValue, setBackendValue] = useState<any>(null);
  const [backendEvents, setBackendEvents] = useState<any[]>([]);
  const [backendLoading, setBackendLoading] = useState(false);

  // AUTO SWITCH KE FUJI

  useEffect(() => {
    if (isConnected && chainId !== avalancheFuji.id) {
      switchChain({ chainId: avalancheFuji.id });
    }
  }, [isConnected, chainId, switchChain]);

 
  // READ CONTRACT (ON-CHAIN)

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
    chainId: avalancheFuji.id,
  });


  // WRITE CONTRACT

  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = () => {
    if (!inputValue) return;
    if (chainId !== avalancheFuji.id) {
      alert('Switch to Avalanche Fuji first');
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
      chainId: avalancheFuji.id,
    });
  };


  // FETCH BACKEND API (MODUL)

  useEffect(() => {
    if (!BACKEND_URL) return;

    const fetchBackendData = async () => {
      try {
        setBackendLoading(true);

        const valueRes = await fetch(`${BACKEND_URL}/blockchain/value`);
        const eventsRes = await fetch(`${BACKEND_URL}/blockchain/events`);

        setBackendValue(await valueRes.json());
        setBackendEvents(await eventsRes.json());
      } catch (err) {
        console.error('Backend fetch error:', err);
      } finally {
        setBackendLoading(false);
      }
    };

    fetchBackendData();
  }, []);


  // UI

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-6">

        <h1 className="text-xl font-bold">
          Day 3 – Frontend dApp (Avalanche Fuji)
        </h1>

        {/* WALLET */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Connected Address</p>
            <p className="font-mono text-xs break-all">{address}</p>
            <p className="text-xs text-green-400">Network: Avalanche Fuji</p>

            <button
              onClick={() => disconnect()}
              className="text-red-400 text-sm underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* ON-CHAIN READ */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400">Contract Value (On-chain)</p>
          {isReading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{value?.toString()}</p>
          )}

          <button
            onClick={() => refetch()}
            className="text-sm underline text-gray-300"
          >
            Refresh value
          </button>
        </div>

        {/* WRITE */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-sm text-gray-400">Update Contract Value</p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting || chainId !== avalancheFuji.id}
            className="w-full bg-blue-600 py-2 rounded disabled:opacity-50"
          >
            {isWriting ? 'Updating...' : 'Set Value'}
          </button>
        </div>

        {false && (
  <div className="border-t border-gray-700 pt-4 space-y-2">
    <p className="text-sm text-gray-400">Backend API Data</p>

    {backendLoading ? (
      <p>Loading backend...</p>
    ) : (
      <>
        <pre className="text-xs">
          {JSON.stringify(backendValue, null, 2)}
        </pre>
        <pre className="text-xs">
          {JSON.stringify(backendEvents, null, 2)}
        </pre>
      </>
    )}
  </div>
)}


        <p className="text-xs text-gray-500 pt-2">
          Smart contract = source of truth | Backend = read-only layer
        </p>
      </div>
    </main>
  );
}
