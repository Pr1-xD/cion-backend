const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const contracts = require('./contracts')

const {Order, OrderStat,UserStat,Position, Action, PositionStat} = require('./models/models');      //importing models

const app = express();
const port = 4000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Web3 = require('web3')
const jsonRpcURL = 'https://arb-mainnet.g.alchemy.com/v2/BrrBgtgC2aUEU_TLB0mb3ADa0PrFzDfO'          // https://canto.slingshot.finance/
const web3 = new Web3(jsonRpcURL)

require('dotenv').config();

const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {        //db connection
    console.log('Database Connected');
})

function getContractDetails(contractName)
{
    let obj = contracts.contracts.find(x => x.contractName === contractName)
    return obj
}

async function readFromSmartContract()
{   
    let contractDetails = getContractDetails('OrderBook')

    const abi = contractDetails.contractAbi
    const contractAddress = contractDetails.contractAddress

    const contract = new web3.eth.Contract(abi, contractAddress)

    tokenName = await contract.methods.router().call()
    console.log("Name: ", tokenName)
    return String(tokenName)
}

readFromSmartContract() // Function call to fetch the information


app.get('/', (req, res) => {
    // let response=readFromSmartContract
    res.json({res:"hi"});
});

app.get('/getorders', async (req, res) => {
    try{
        const data = await Order.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/getorderstats', async (req, res) => {
    try{
        const data = await OrderStat.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/positions', async (req, res) => {
    try{
        const data = await Position.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/position_stats', async (req, res) => {
    try{
        const data = await PositionStat.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/user_stats', async (req, res) => {
    try{
        const data = await UserStat.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/actions', async (req, res) => {
    try{
        const data = await Action.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/actions/:account', async (req, res) => {
    try{
        const data = await Action.find({account:req.params.account});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/ui_version', async (req, res) => {
    try{
        const data = await Action.find({account:req.params.account});
        res.send('1.4')
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


app.listen(port, () => console.log(`Backend running on ${port}!`));