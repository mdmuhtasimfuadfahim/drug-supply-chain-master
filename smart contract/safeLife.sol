// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;


contract safeLife{
   enum Role { Manufacturer, DepotIncharge, Pharmacist }
   
   //---------------VARIAABLES FOR PLACED ORDER AND COMPLETED ORDER-------------
   string email;
   string orderId;
   string status;
   string productionIdNums;
   
   //--------------STRUCTS FOR CREATE ENCRYPTED QR CODE AND RECEIVED DRUGS-----------
   struct drugInfo{ 
    string orderId;
    string buyer;
    string seller;
    string fromAdd;
    string toAdd;
    Role role;
   }
   
   struct qrCodeInfo{
       string productionId;
       string secretKey;
       string darNumber;
       Role role;
   }
   
   
   //--------------MAPPING FOR ENCRYPTED QR AND RECEIVED DRUGS----------------------
   mapping(string => drugInfo) pharmaceutical;
   mapping(string => qrCodeInfo) pharmaQR;
   
   
   //-------------EVENTS FOR ENCRYPTED QR CODE AND RECEIVED DRUGS INFORMATION--------------------
   event logDrugInfo(
    string orderId,
    string buyer,
    string seller,
    string fromAdd,
    string toAdd,
    string role
   );
   
   event logQRCodeInfo(
       string productionId,
       string secretKey,
       string darNumber,
       string role
    );
   
   address public seller;
   address public buyer;
   
   constructor () public {
      seller = msg.sender;
   }
   
  //--------------MODIFIERS-------------
    modifier isBuyer() {
        require (buyer != msg.sender, "Depot In-charge or Pharmacist can not send Message");
        _;
    }
    modifier isSeller() {
        require (seller == msg.sender, "Message from Manufacturer"); 
        _;
    }
    
    modifier inManufacturerHand(string memory _orderId){
        require ((pharmaceutical[_orderId].role != Role.Manufacturer), "Something is Wrong from Manufacturer :( ");
        _;
    }
    
    modifier createQRbyManufacturer(string memory _productionId){
        require ((pharmaQR[_productionId].role != Role.Manufacturer), "Something is Wrong from Manufacturer :( ");
        _;
    }
    
    modifier inDepotInchargeHand(string memory _orderId){
        require ((pharmaceutical[_orderId].role != Role.DepotIncharge), "Something is Wrong from DepotIncharge :( ");
        _;
    }
    
    modifier createQRbyDepotIncharge(string memory _productionId){
        require ((pharmaQR[_productionId].role != Role.DepotIncharge), "Something is Wrong from DepotIncharge :( ");
        _;
    }
    
    modifier inPharmacistHand(string memory _orderId){
        require ((pharmaceutical[_orderId].role != Role.Pharmacist), "Something is Wrong from Pharmacist :( ");
        _;
    }
    
    modifier createQRbyPharmacist(string memory _productionId){
        require ((pharmaQR[_productionId].role != Role.Pharmacist), "Something is Wrong from Pharmacist :( ");
        _;
    }
    
    //---------------GET STORE DRUG INFORMATION FOR DEPOT IN-CHARGE---------------
    function getStoreDrugs(string memory _orderId)public view returns(string memory, string memory, string memory, string memory, string memory){
        return (pharmaceutical[_orderId].orderId, pharmaceutical[_orderId].buyer, pharmaceutical[_orderId].seller, pharmaceutical[_orderId].fromAdd, pharmaceutical[_orderId].toAdd);
    }
    
    //---------------GET QR CODE INFORMATION------------------
    function getQRInfo(string memory _productionId) public view returns(string memory, string memory, string memory){
        return(pharmaQR[_productionId].productionId, pharmaQR[_productionId].secretKey, pharmaQR[_productionId].darNumber);
    }
    
    //--------------GET ORDERERS INFORMATION------------------
    function getOrderInfo() public view returns(string memory, string memory, string memory){
        return(orderId, status, email);
    }
    
    //--------------GET ORDER STATUS INFORMATION------------------
    function getOrderStatusInfo() public view returns(string memory, string memory){
        return(orderId, status);
    }
    
    //----------------SET ORDER DAR NUMBER STRING-----------------
    function getOrderDAR() public view returns (string memory, string memory){
        return(orderId, productionIdNums);
    }
    
    
    //---------------SET STORE DURG INFORMATION FOR DEPOT IN-CHARGE------------------
    function storeDrugs(string memory _orderId, string memory _buyer, string memory _seller,  string memory _fromAdd, string memory _toAdd) public
    isSeller()
    inDepotInchargeHand(_orderId)
    inPharmacistHand(_orderId)
    {
        pharmaceutical[_orderId].orderId = _orderId;
        pharmaceutical[_orderId].buyer = _buyer;
        pharmaceutical[_orderId].seller = _seller;
        pharmaceutical[_orderId].fromAdd = _fromAdd;
        pharmaceutical[_orderId].toAdd = _toAdd;
        emit logDrugInfo(_orderId, _buyer, _seller, _fromAdd, _toAdd, "Depot In-charge");
    }
    
    //---------------SET STORE DURG INFORMATION FOR PHARMACIST------------------
    function storeDrugsAgain(string memory _orderId, string memory _buyer, string memory _seller,  string memory _fromAdd, string memory _toAdd) public
    isSeller()
    inDepotInchargeHand(_orderId)
    inPharmacistHand(_orderId)
    {
        pharmaceutical[_orderId].orderId = _orderId;
        pharmaceutical[_orderId].buyer = _buyer;
        pharmaceutical[_orderId].seller = _seller;
        pharmaceutical[_orderId].fromAdd = _fromAdd;
        pharmaceutical[_orderId].toAdd = _toAdd;
        emit logDrugInfo(_orderId, _buyer, _seller, _fromAdd, _toAdd, "Pharmacist");
    }
    
    
    //---------------SET QR CODE INFORMATION------------------
    function createQR(string memory _productionId, string memory _secretKey, string memory _darNumber) public
    isSeller()
    createQRbyDepotIncharge(_productionId)
    createQRbyPharmacist(_productionId)
    {
        pharmaQR[_productionId].productionId = _productionId;
        pharmaQR[_productionId].secretKey = _secretKey;
        pharmaQR[_productionId].darNumber = _darNumber;
        emit logQRCodeInfo(_productionId, _secretKey, _darNumber, "Manufacturer");
    }


   //--------------SET INFORMATIONS FOR ORDERS--------------
   function setOrderInfo(string memory _orderId, string memory _status, string memory _email) public
   isSeller()
   {
       orderId = _orderId;
       status = _status;
       email = _email;
   }
   
   //--------------SET INFORMATIONS FOR ORDER STATUS--------------
   function setOrderStatusInfo(string memory _orderId, string memory _status) public
   isSeller()
   {
       orderId = _orderId;
       status = _status;
   }
   
   //----------------SET ORDER DAR NUMBER STRING-----------------
   function setOrderDAR(string memory _orderId, string memory _productionIdNums) public
   isSeller()
   {
       orderId = _orderId;
       productionIdNums = _productionIdNums;
   }
    
    
    //-----------HELPERS---------
    function isBuyer_() public view returns (bool) {
        return msg.sender == buyer;
        
    }
    
    function isSeller_() public view returns (bool) {
        return msg.sender == seller;
    }
}