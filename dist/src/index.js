import axios from "axios";
import fs from 'fs';
import { CONFIG } from '../CONFIG.js';
import crypto from 'node:crypto';
import _ from "lodash";
import chalk from "chalk";
import * as CONSTANTS from "./constants.js";
const timeout = (ms) => new Promise(res => setTimeout(res, ms));
const sign = (query_string) => crypto.createHmac('sha256', CONFIG.secret).update(query_string).digest('hex');
function parseFile(file) {
    let data = fs.readFileSync(file, "utf8");
    let array = data.split('\r\n');
    let wallets = [];
    array.forEach(wallet => {
        if (wallet.length > 3) {
            wallets.push(wallet);
        }
    });
    console.log(`${chalk.bgGreenBright.whiteBright(`${wallets}`)}`);
    return wallets;
}
function validateWallets(array, regexp) {
    let invalidWallets = [];
    array.forEach(wallet => {
        !wallet.match(regexp) && invalidWallets.push(wallet);
    });
    if (invalidWallets.length > 0) {
        console.log(`Invalid wallets: ${invalidWallets.join("\n")}`);
    }
    else
        return true;
}
async function getCoinInformation(coin) {
    let query = `timestamp=${Date.now()}`;
    let signature = sign(query);
    let res = await axios(`${CONSTANTS.HOST}/sapi/v1/capital/config/getall?${query}&signature=${signature}`, {
        method: "GET",
        headers: { 'X-MBX-APIKEY': CONFIG.apikey }
    }).catch(err => console.error(err.response.data.msg));
    return res.data.find(query => query.coin === coin);
}
async function getTransactionInfo(coin, txid) {
    let query = `coin=${coin}&timestamp=${Date.now()}`;
    let signature = sign(query);
    let res = await axios(`${CONSTANTS.HOST}/sapi/v1/capital/withdraw/history?${query}&signature=${signature}`, {
        method: "GET",
        headers: { 'X-MBX-APIKEY': CONFIG.apikey }
    }).catch(err => console.error(err.response.data.msg));
    let tx = res.data.find(query => query.id === txid);
    console.log(`${chalk.bgGreenBright.whiteBright(`Sent ${tx.amount} ${tx.coin}, fee: ${tx.transactionFee} ${tx.coin}, status: ${CONSTANTS.TX_STATUSES[tx.status]}`)}`);
    return res.data;
}
async function withdraw(coin, address, amount, network) {
    let query = `coin=${coin}&address=${address}&amount=${amount}&network=${network}&timestamp=${Date.now()}`;
    let signature = sign(query);
    let res = await axios(`${CONSTANTS.HOST}/sapi/v1/capital/withdraw/apply?${query}&signature=${signature}`, {
        method: "POST",
        headers: { 'X-MBX-APIKEY': CONFIG.apikey }
    }).catch(err => console.error(`${chalk.bgRed.whiteBright(`${err.response.data.msg}`)}`));
    if (res?.data) {
        console.log(`Address: ${address} is withdrawing`);
        await timeout(_.random(CONFIG.delay.min, CONFIG.delay.max) * 1000);
        await getTransactionInfo(coin, res.data.id);
        return res;
    }
}
(async () => {
    let coinData = await getCoinInformation(CONFIG.token.toUpperCase());
    let networks = coinData.networkList.map(item => item.network);
    let balance = coinData.free;
    console.log(`Balance: ${balance} ${coinData.coin}`);
    if (networks.includes(CONFIG.network.toUpperCase())) {
        let networkData = coinData.networkList.find(item => item.network == CONFIG.network.toUpperCase());
        let wallets = parseFile("wallets.txt");
        let validWallets = validateWallets(wallets, networkData.addressRegex);
        let amount = CONFIG.amount;
        if (validWallets) {
            if (balance >= wallets.length * amount) {
                for (let i = 0; i < wallets.length; i++) {
                    let decimals = networkData.withdrawIntegerMultiple.length > 1 ? networkData.withdrawIntegerMultiple.split('.')[1].length : 0;
                    let finalAmount = CONFIG.randomizeAmount ? (amount * (_.random(1 - (CONFIG.spread / 100), 1))).toFixed(decimals) : amount;
                    if (+finalAmount >= +networkData.withdrawMin) {
                        await withdraw(CONFIG.token.toUpperCase(), wallets[i], finalAmount, CONFIG.network.toUpperCase());
                    }
                    else
                        console.log(`${chalk.bgRed.whiteBright('Minimal amount is:')}  ${networkData.withdrawMin} ${networkData.coin}, ${chalk.bgRed.whiteBright('current amount is:')} ${finalAmount} ${networkData.coin}`);
                }
            }
            else
                console.log(`${chalk.bgRed.whiteBright("Insufficient funds")}`);
        }
        else
            console.log(`${chalk.bgRed.whiteBright('Please, remove invalid wallets')}`);
    }
    else
        console.log(`${chalk.bgRed.whiteBright(`Invalid network, available networks: ${networks.join(', ')}`)}`);
})();
//# sourceMappingURL=index.js.map