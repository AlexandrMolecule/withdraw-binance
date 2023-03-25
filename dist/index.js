import fs from 'fs';
import chalk from "chalk";
const timeout = (ms) => new Promise(res => setTimeout(res, ms));
// const sign = (query_string: crypto.BinaryLike) => crypto.createHmac('sha256', config.secret).update(query_string).digest('hex');
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
parseFile("wallets.txt");
//# sourceMappingURL=index.js.map