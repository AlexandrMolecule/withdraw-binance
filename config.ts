export const CONFIG = {
    token: 'BUSD',
    network: 'BSC', // if an invalid value is entered, you will get a list of available networks
    amount: 10, // if you want to get random amounts, slightly increase this value
    randomizeAmount: false,  // if true, the final amount will be slightly less for a percent below
    spread: 0.5, // in percents, the final amount will be less for random percent up to this value, increase this value for a cheap coins to get more random values
    delay: { min: 2, max: 20 },  // in seconds
    apikey: 'PASTE_YOUR_API_KEY',
    secret: 'PASTE_YOUR_SECRET_KEY'
}