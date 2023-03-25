# withdraw-binance
## Get Binance API key

1) Binance -> Settings -> API Management -> Create API.
2) Copy API key and Secret key to `config.js` file.
3) Edit restrictions -> Restrict access to trusted IPs only -> Input your IP address.
4) Сheck the box next to the <b>Enable Withdrawals</b>.

## Setup bot

1) Download ZIP and extract it to a folder
2) Install node.js: `https://nodejs.org/en/` (LTS)
3) Setup your settings in `config.js`
4) Paste your wallets to `wallets.txt` file, each wallet on a new line
5) Open folder with the bot in `cmd`
```bash
cd <path to folder with script>
```
6) Install dependencies
```bash
npm i
```
7) Start
```bash
npm run .
```
