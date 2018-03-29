import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import Web3 from 'web3';
import { VotePage } from '../vote/vote';
import Tx from 'ethereumjs-tx';
declare const Buffer

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  publicKey:any;
  privateKey:any;

  newmanager_abi = [{"constant":true,"inputs":[],"name":"numberOfNewsStories","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_news","type":"string"}],"name":"addNews","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"news_contracts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"news","type":"address"},{"indexed":false,"name":"publisher","type":"address"}],"name":"AddNews","type":"event"}];


  news_abi = [{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"end_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastvoter_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"news","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"details","outputs":[{"name":"_news","type":"string"},{"name":"_voted","type":"bool"},{"name":"_balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyer","type":"address"}],"name":"transferOrderOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publisher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"done","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"votingOpened","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"downvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_publisher","type":"address"},{"name":"_news","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

  feed:any;

  constructor(public navCtrl: NavController, public modalController:ModalController) {
    this.publicKey = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
    this.privateKey = "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f";

    this.feed = [];

  }

  vote(type, address) {
    console.log(type);
    console.log(address);

    var privateKey = new Buffer(this.privateKey, 'hex')

    var web3url = "http://localhost:8545";
    var publicKey = this.publicKey;
    const provider = new Web3.providers.HttpProvider(web3url);
    var web3 = new Web3(provider);
    web3.eth.defaultAccount = publicKey;
    var contract = new web3.eth.Contract(this.news_abi, address);
    console.log(contract);

    var myCallData = contract.methods.upvote(1522298999).encodeABI();

    console.log(myCallData);




    var nonce;
    web3.eth.getTransactionCount(web3.eth.defaultAccount).then((val) => {
      nonce = val;

      web3.eth.getGasPrice().then((gasPrice) => {

        const gasPriceHex = web3.utils.toHex(gasPrice);
        const gasLimitHex = web3.utils.toHex(300000);

        var value = web3.utils.toWei('1', 'ether');

        const rawTx = {
          "from": publicKey,
          "nonce": "0x" + nonce.toString(16),
          "gasPrice": gasPriceHex,
          "gasLimit": gasLimitHex,
          "to": address,
          "value": web3.utils.toHex(value),
          "data": myCallData
        };

        console.log(rawTx);
        const tx = new Tx(rawTx);
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        console.log("serializedTx", serializedTx);
        function waitForTransactionReceipt(hash) {
        console.log('waiting for contract to be mined');
        const receipt = web3.eth.getTransactionReceipt(hash);
        // If no receipt, try again in 1s
          if (receipt == null) {
            setTimeout(() => {
                waitForTransactionReceipt(hash);
            }, 1000);
          } else {
            console.log('contract address: ' + receipt['contractAddress']);
          }
        }

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
        if (err) { console.log(err); return; }

          waitForTransactionReceipt(hash);
        });

      });





    });
    /*const rawTx = {
      nonce: web3.utils.toHex(web3.eth.getTransactionCount(publicKey)),
      gasLimit: web3.utils.toHex(800000),
      gasPrice: web3.utils.toHex(20000000000),
      data: myCallData,
      to: address,
      chainId: 1,
      value: web3.utils.toWei("2.0", "ether")
    };*/





    //let votemodel = this.modalController.create(VotePage, { type: type });
    //votemodel.present();
  }

  refresh() {
    this.feed = [];
    console.log("Testing...");

    var web3url = "http://localhost:8545";

    var publicKey = this.publicKey;

    var newManager = "0x8cdaf0cd259887258bc13a92c0a6da92698644c0";

    const provider = new Web3.providers.HttpProvider(web3url);

    var web3 = new Web3(provider);
    web3.eth.defaultAccount = publicKey;

    var contract = new web3.eth.Contract(this.newmanager_abi, newManager);

    var self = this;
    contract.methods.numberOfNewsStories().call(function(error, total_numberOfNewsStories){
      console.log("total_numberOfNewsStories: ", total_numberOfNewsStories);
      // Gets the articles
      for (var i = 0; i < total_numberOfNewsStories; i++) {
        //Getting article at index
        contract.methods.news_contracts(i).call(function(error, address){
          var current_news = new web3.eth.Contract(self.news_abi, address);
          current_news.methods.details().call(function(error, details){
            console.log("details: ", details);
            console.log("current_news: ", current_news);
            console.log("address: ", address);
            self.feed.push({ contract:current_news, address:address, news:details['_news'], balance:details['_balance'], voted:details['_voted'] });
          });
        });
      }
    });





    //this.tokenContract = contract.at(this.configProvider.dMARK_Address);
    //var newsContract = new web3.eth.contract(this.newmanager_abi);
    //var manager = newsContract.at(newManager);
    //console.log(contract);
  }


}
