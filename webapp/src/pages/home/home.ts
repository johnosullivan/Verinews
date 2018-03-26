import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import Web3 from 'web3';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  news_abi = [{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"upvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"end_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastvoter_timestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"upvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"news","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBuyer","type":"address"}],"name":"transferOrderOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isFake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start_time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publisher","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"done","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"votingOpened","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_datetime","type":"uint256"}],"name":"downvote","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"downvoters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_publisher","type":"address"},{"name":"_news","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

  constructor(public navCtrl: NavController) {

  }

  test() {
    console.log("Testing...");

    var web3url = "http://localhost:8545";

    var publicKey = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

    var newManager = "0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f";

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
        console.log("index: ", i);
        contract.methods.news_contracts(i).call(function(error, address){
          var current_news = new web3.eth.Contract(self.news_abi, address);
          console.log("current_news: ", current_news);
          console.log("address: ", address);
          current_news.methods.news().call(function(error, news){
            console.log("news: ", news);
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
