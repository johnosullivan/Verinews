import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import Web3 from 'web3';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newmanager_abi = [{"constant":true,"inputs":[],"name":"numberOfNewsStories","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_news","type":"string"}],"name":"addNews","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"news_contracts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"news","type":"address"},{"indexed":false,"name":"publisher","type":"address"}],"name":"AddNews","type":"event"}];


  news_abi = [{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"end_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastvoter_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"news","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"details","outputs":[{"name":"_news","type":"string"},{"name":"_voted","type":"bool"},{"name":"_balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyer","type":"address"}],"name":"transferOrderOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publisher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"done","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"votingOpened","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"downvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_publisher","type":"address"},{"name":"_news","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

  feed:any;

  constructor(public navCtrl: NavController) {
    this.feed = [];
    this.test();
  }

  test() {
    console.log("Testing...");

    var web3url = "http://localhost:8545";

    var publicKey = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

    var newManager = "0xaa588d3737b611bafd7bd713445b314bd453a5c8";

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
