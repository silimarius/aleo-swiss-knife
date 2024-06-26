import { readFile } from "fs/promises";
import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  AleoKeyProvider,
} from "@kryha-labs/aleo-sdk-canary";

const deploy = async () => {
  try {
    const NETWORK_URL = process.env.NETWORK_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const FILE_PATH = process.env.FILE_PATH;

    if (!NETWORK_URL || !PRIVATE_KEY || !FILE_PATH)
      throw new Error("Missing env variables");

    const account = new Account({ privateKey: PRIVATE_KEY });

    const keyProvider = new AleoKeyProvider();
    keyProvider.useCache(true);

    const networkClient = new AleoNetworkClient(NETWORK_URL);
    const recordProvider = new NetworkRecordProvider(account, networkClient);

    // Initialize a program manager to talk to the Aleo network with the configured key and record providers
    const programManager = new ProgramManager(
      NETWORK_URL,
      keyProvider,
      recordProvider,
    );

    programManager.setAccount(account);

    // Define a fee to pay to deploy the program
    const fee = 2.1;

    // const program = await readFile(
    //   "../programs/leaderboard/build/main.aleo",
    //   "utf-8",
    // ).then((p) => p.replaceAll("leaderboard.aleo", PROGRAM_NAME));

    const program = await readFile(FILE_PATH, "utf-8");

    const txId = await programManager.deploy(program, fee, false);

    if (txId instanceof Error) {
      console.error(txId);
      return;
    }

    // Verify the transaction was successful
    // const transaction = await programManager.networkClient.getTransaction(txId);

    // if (transaction instanceof Error) {
    //   console.error(transaction);
    //   return;
    // }

    // console.log(transaction);

    console.log(
      "Deployment successful! Check your wallet and wait a couple of seconds for your transaction to complete.",
    );
  } catch (error) {
    console.error(error);
    return;
  }
};

await deploy();
