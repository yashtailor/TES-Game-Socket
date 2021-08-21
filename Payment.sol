// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//functions:
//1. createBill
//2. getTotalBillAmount
//3. getEMIBillAmount
//4. payBill
//5. checkMonthlyEMIPaid
//6. checkTotalBillPaid

//modifiers:
//1. onlyOwner
//2. onlyIfNotPaid
//3. onlyIfEqualAmount

//EMI contains the status of EMI as true, the amount to be paid every month, the number of times the amount is paid and the last date when the amount was paid
struct EMI{
    bool isEmi;
    uint numMonthlyPayAmount;
    uint numPaid;
    uint lastDatePaid; 
}

//TV contains the id, the owner of the TV, the fixed bill amount for the tv, the emi status and the bill payers
struct TV{
    uint id;
    address payable owner;
    uint fixedBillAmount;
    mapping(address => EMI) emiStatus; // (bill payer => emi status)
    mapping(address => bool) billPayers; // (bill payer => payment made/payment not made)
}

contract Payment {

    uint numTVs; //number of tvs
    mapping(uint => TV) TVs; //(tv id => TV details)
    
    //function to create bill, it takes the owner and the fixed bill amount
    function createBill(address payable owner, uint fixedBillAmount) public{
        TV storage newTV = TVs[numTVs];
        newTV.id = numTVs;
        newTV.owner = owner;
        newTV.fixedBillAmount = fixedBillAmount;
        numTVs++; //increment number of TVs
    }
    
    //function to get the total bill amount of a particular TV
    function getTotalBillAmount(uint id) public view returns (uint billAmount){
        return TVs[id].fixedBillAmount;
    }
    
    //function to get the monthly EMI bill amount
    function getEMIBillAmount(uint id) public view returns (uint billAmount){
        return TVs[id].fixedBillAmount / 12;
    }
    
    //modifier to check if the current user is the owner
    modifier onlyOwner(uint id){
        require(msg.sender == TVs[id].owner,"Only owner allowed!");//not owner
        _;
    }
    
    //function to update the bill amount by the owner
    function updateBillAmount(uint id, uint updatedBillAmount) public payable onlyOwner(id) returns (uint billAmount){
        TVs[id].fixedBillAmount = updatedBillAmount;
        return updatedBillAmount;
    }

    //to check if the bill is already paid or not
    //assumption : 1 month == 1 minute (i.e. tenure of emi is 12 minutes)
    modifier onlyIfNotPaid(uint id, bool isEmi){
        if(isEmi){ //if user wants to make payment in the form of emi
            if(TVs[id].emiStatus[msg.sender].numPaid == 0)_; //first installment
            else{
                require(TVs[id].emiStatus[msg.sender].numPaid < 12,"Already Paid for the entire amount"); //all 12 installments paid
                require(block.timestamp - TVs[id].emiStatus[msg.sender].lastDatePaid >  60,"Already Paid the monthly amount");//monthly installment paid
            }
        }else{
            require(TVs[id].billPayers[msg.sender] == false,"Already Paid"); //not emi and already paid  
        }
        _;
    }
    
    //to check if the bill amount matches the fixed bill amount
    modifier onlyIfEqualAmount(uint id,uint billAmount,bool isEmi){
        if(isEmi){
            require(TVs[id].fixedBillAmount / 12 == billAmount,"Bill monthly amount doesn't match the EMI amount!"); //emi monthy amount doesn't match
        }else{
            require(TVs[id].fixedBillAmount == billAmount,"Bill amount doesn't match the fixed amout!");//bill amount doesn't match
        }
        _;
    }
    
    //function to pay the bill, it takes the bill id, the fixed amount to be paid and the emi status
    function payBill(uint id,uint billAmount,bool isEmi) public payable onlyIfNotPaid(id,isEmi) onlyIfEqualAmount(id,billAmount,isEmi) returns (bool payStatus){
        TVs[id].owner.transfer(billAmount); //transfer the bill amount to the owner
        if(isEmi){
            //if emi and first installment
            if(TVs[id].emiStatus[msg.sender].numPaid == 0){
                EMI storage emi = TVs[id].emiStatus[msg.sender];
                emi.isEmi = isEmi; //set the status of the bill as emi
                emi.numMonthlyPayAmount = billAmount/12; //set the monthly bill amount
            } 
            TVs[id].emiStatus[msg.sender].numPaid++; //increase the number of installments paid
            TVs[id].emiStatus[msg.sender].lastDatePaid = block.timestamp; //update the paid time
            if(TVs[id].emiStatus[msg.sender].numPaid==12)TVs[id].billPayers[msg.sender] = true; //all installments paid, hence update the status as total bill paid
        }else TVs[id].billPayers[msg.sender] = true;
        return true;
    }
    
    //function to check if the monthly emi payment is done or not
    function checkMonthlyEMIPaid(uint id) public view returns (uint){
        return block.timestamp - TVs[id].emiStatus[msg.sender].lastDatePaid;
    }

    //function to check if the total bill is paid or not
    function checkTotalBillPaid(uint id) public view returns (bool hasPaid){
        return TVs[id].billPayers[msg.sender];
    }
    
}