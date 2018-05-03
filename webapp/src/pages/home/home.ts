import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import Web3 from 'web3';
import { VotePage } from '../vote/vote';
import Tx from 'ethereumjs-tx';
import randomid from 'random-id';

declare const Buffer

//http://127.0.0.1:8080/ipfs/QmaEn3oG9BuneFyd4K81rjbYsmLLEqnHmc32Cbgyz5Pvgw
import ipfsAPI from 'ipfs-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  publicKey: any;
  privateKey: any;
  web3url = "http://localhost:8545";
  ipfsurl = "http://127.0.0.1:8080";
  newManager = "0x3ddfE111B39772651C0a1d1f90Ca8f60c1cF94Ce";
  story_data = "";
  ipfs: any;
  ether:any;

  newmanager_abi = [{"constant":true,"inputs":[],"name":"numberOfNewsStories","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_news","type":"string"}],"name":"addNews","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"news_contracts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"stories","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"news","type":"address"},{"indexed":false,"name":"publisher","type":"address"}],"name":"AddNews","type":"event"}];

  news_abi = [{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"end_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastvoter_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"news","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"details","outputs":[{"name":"_news","type":"string"},{"name":"_voted","type":"bool"},{"name":"_balance","type":"uint256"},{"name":"_votingOpened","type":"bool"},{"name":"_isFake","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyer","type":"address"}],"name":"transferOrderOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"gasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publisher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"votingOpened","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"downvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_publisher","type":"address"},{"name":"_news","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

  feed: any;

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    public http: HttpClient) {

    this.publicKey = "0x1c1e61ec8c521c2fb88f173f7c47fe525e7a8a04";
    this.privateKey = "";

    this.feed = [];

    this.ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });

  }

  done(address) {
    var privateKey = new Buffer(this.privateKey, 'hex')
    var publicKey = this.publicKey;
    const provider = new Web3.providers.HttpProvider(this.web3url);
    var web3 = new Web3(provider);
    web3.eth.defaultAccount = publicKey;
    var contract = new web3.eth.Contract(this.news_abi, address);
    console.log(contract);
    var myCallData;
    var seconds = new Date().getTime() / 1000;
    myCallData = contract.methods.done().encodeABI();
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
    //let votemodel = this.modalController.create(VotePage, { type: type });
    //votemodel.present();
  }

  new(_data) {
    var self = this;
    var paddress = this.publicKey;
    var datatemp = _data;
    console.log(datatemp);
    return new Promise(function(resolve, reject) {
      var ran_id = randomid(50, "aA0");
      var data = new Buffer(datatemp);
      var path = paddress + "_" + ran_id + ".json";
      const stream = self.ipfs.files.addReadableStream();
      stream.on('data', function(file) {
        console.log(file);
        resolve(file);
      });
      stream.write({ path: path, content: data });
      stream.end();
    });
  }

  isJson(item) {
    item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
  }

  news_ipfs_submit() {

    if (this.isJson(this.story_data)) {

      this.new(this.story_data).then((file) => {
        var hash = file['hash'];

        var privateKey = new Buffer(this.privateKey, 'hex')
        var publicKey = this.publicKey;

        //const provider = new Web3.providers.HttpProvider(this.web3url);
        //const provider = new Web3(web3.currentProvider);
        const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/");

        var web3 = new Web3(provider);
        web3.eth.defaultAccount = publicKey;

        var news_manager = new web3.eth.Contract(this.newmanager_abi, this.newManager);
        console.log(news_manager);

        var calldata = news_manager.methods.addNews(hash).encodeABI();
        console.log(hash);
        var nonce;


        web3.eth.getTransactionCount(web3.eth.defaultAccount).then((val) => {
          nonce = val;

          web3.eth.getGasPrice().then((gasPrice) => {

            const gasPriceHex = web3.utils.toHex(gasPrice);
            const gasLimitHex = web3.utils.toHex(3000000);

            console.log("gasPrice: ", gasPrice);
            console.log("nonce: ", nonce);

            const rawTx = {
              "from": publicKey,
              "nonce": "0x" + nonce.toString(16),
              "gasPrice": gasPriceHex,
              "gasLimit": gasLimitHex,
              "to": this.newManager,
              "data": calldata
            };

            console.log(rawTx);
            const tx = new Tx(rawTx);
            tx.sign(privateKey);
            const serializedTx = tx.serialize();
            console.log("serializedTx", serializedTx);

            function waitForTransactionReceipt(hash) {
              const receipt = web3.eth.getTransactionReceipt(hash);
              if (receipt == null) {
                setTimeout(() => { waitForTransactionReceipt(hash); }, 1000);
              } else {
              }
            }
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
              if (err) { console.log(err); return; }
              waitForTransactionReceipt(hash);
            });


          });
        });


      });

    }

  }

  vote(type, address) {
    var privateKey = new Buffer(this.privateKey, 'hex')
    var publicKey = this.publicKey;

    //const provider = new Web3.providers.HttpProvider(this.web3url);
    //const provider = new Web3(web3.currentProvider);
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/");

    var web3 = new Web3(provider);
    web3.eth.defaultAccount = publicKey;
    var contract = new web3.eth.Contract(this.news_abi, address);
    console.log(contract);
    console.log(type);
    var myCallData;
    var seconds = new Date().getTime() / 1000;
    if (type == 'down') {
      myCallData = contract.methods.downvote(seconds).encodeABI();
    }
    if (type == 'up') {
      myCallData = contract.methods.upvote(seconds).encodeABI();
    }
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
    //let votemodel = this.modalController.create(VotePage, { type: type });
    //votemodel.present();
  }

  getItemFromIPFS(hash) {
    console.log(hash);
    var self = this;
    return new Promise(function(resolve, reject) {
      self.http.get(self.ipfsurl + '/ipfs/' + hash).subscribe(data => {
        console.log(data);
        resolve(data);
      })
    });
  }

  refresh() {
    this.feed = [];
    console.log("Fetching Feed...");
    var publicKey = this.publicKey;

    //const provider = new Web3.providers.HttpProvider(this.web3url);
    //const provider = new Web3(web3.currentProvider);
    const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/");

    var web3 = new Web3(provider);
    web3.eth.defaultAccount = publicKey;

    web3.eth.getBalance(publicKey).then((user_ether) => {
      this.ether = user_ether;
    });

    var contract = new web3.eth.Contract(this.newmanager_abi, this.newManager);

    var self = this;
    contract.methods.numberOfNewsStories().call(function(error, total_numberOfNewsStories) {
      console.log("total_numberOfNewsStories: ", total_numberOfNewsStories);
      // Gets the articles
      for (var i = 0; i < total_numberOfNewsStories; i++) {
        //Getting article at index
        contract.methods.news_contracts(i).call(function(error, address) {
          var current_news = new web3.eth.Contract(self.news_abi, address);
          current_news.methods.details().call(function(error, details) {
            var cur_hash = details['_news'];
            self.getItemFromIPFS(cur_hash).then((data) => {
              console.log("details: ", details);
              console.log("current_news: ", current_news);
              console.log("address: ", address);
              console.log("data: ", data);
              self.feed.push({ contract: current_news, address: address, news: data['news'], balance: details['_balance'], voted: details['_voted'], votingOpened: details['_votingOpened'], isFake: details['_isFake'] });
            })

          });
        });
      }
    });
  }


}
