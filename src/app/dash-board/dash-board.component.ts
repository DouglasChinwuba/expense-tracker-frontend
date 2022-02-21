import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})

export class DashBoardComponent implements OnInit {
  
  user = this.storageService.getUser();
  getAccountUrl = "http://localhost:8081/account/" + this.user.username;
  currentDate = new Date().toDateString();
  currentTransaction : any = {};
  userAccount : any = {};
  math = Math;
  transactionTypeHasError = true;

  constructor(private http : HttpClient, 
              private storageService : StorageService,
              public accountService : AccountService){}


  ngOnInit(): void {
    this.http.get<any>(this.getAccountUrl).subscribe(
      res => {
        this.userAccount = res;
        console.log(this.userAccount);
        this.populateTransDates();
        console.log(this.accountService.getAllDates())
      },err => {
        console.log(err);
      }
    )
  }

  populateTransDates(){
    for(let transaction of this.userAccount.transactions){
      let formattedDate = new Date(transaction.date).toDateString();
      this.accountService.getAllDates()[formattedDate] ??= [];
      this.accountService.getAllDates()[formattedDate].push(transaction);
    }
  }

  addTransaction(){
     this.currentTransaction.date = new Date().toDateString();
     this.accountService.getAllDates()[this.currentTransaction.date] ??= [];
     this.accountService.getAllDates()[this.currentTransaction.date].push(this.currentTransaction);
     console.log(this.accountService.getAllDates());
  }

  resetForm(form: NgForm){
    this.currentTransaction = {};
    form.reset();
  }

  validateTransactionType(value : string){
    if(value === 'default'){
      this.transactionTypeHasError = true;
    }else{
      this.transactionTypeHasError = false;
    }
  }

  originalOrder = (a: KeyValue<string, Array<any>>, b: KeyValue<string,Array<any>>): number => {
    return 0;
  }


}
