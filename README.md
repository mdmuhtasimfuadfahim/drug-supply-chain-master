# <h1 align="center"><img src="https://user-images.githubusercontent.com/69357704/159665149-11d0993a-db6f-4422-8554-94a16406d87a.png" width="70px" height="70px"/>Drug Guard: Secure and Transparent Supply Chain Management to Prevent Counterfeit Drugs</h1>

## Keywords: Counterfeit drug · Blockchain · Security · Encrypted QR Code · Traceability · Transparency</br>

## Drug supply chain</br>
This platform provides a secure network where countefeiting of drugs will be reduced or removed. It is a tranparent network through blockchain where all the users can see others activities. I have built a platform over the Ethereum network.

## ResearchGate
 - [Project and Paper](https://www.researchgate.net/project/Drug-Guard-A-Secure-and-Transparent-Supply-Chain-Management-to-Prevent-Counterfeit-Drugs)

## Project demo video
 - [Link](https://drive.google.com/file/d/1RPKnCdRp2FT4k20m16M9HxriwzdFAgmx/view)
 
## Technology satcks and tools


#### Backend
 - Node.JS
 - Express.JS
 - Laravel Mix
 - MongoDB (DB)

#### Frontend
 - EJS
 - SCSS
 - Tailwind CSS
 - JavaScript

#### Blockchain
 - Language: Solidity
 - Platform: Ethereum
 - Packages: Web3.js
 - Node & TestRPC: Geth


## Features</br>
 - Place order for pharmacist or depot in-charge.</br>
 - Blockchain for all the transaction history.</br>
 - Real time update role or receive confirmation.</br>
 - Invoice sharing via email.</br>
 - Real time order status or location update.</br>
 - Encrypted QR code.</br>
 - Add manufactured drugs information and add secret informations about any production.</br>
 
## Getting started</br>
**Step 1: Download the repository or clone it by:**
  ```shell
  git clone https://github.com/bitecUGC/icvbd
  ```

  **Step 2: Run the following commands from the root directory to install all dependencies:**
  ```shell
  yarn install 
  # or
  npm install
  ```

  **Step 3: Change the PORT number or leave it as it is.**
  **Step 4: Create and setting up the .env variables.**

  ```shell
  COOKIE_SECRET = secret_goes_here
  MONGO_CONNECTION_URL = "mongo_url_goes_here"
  APP_BASE_URL = http://localhost:3040 or change it
  SMTP_HOST = host_goes_here
  SMTP_PORT = port_goes_here
  MAIL_USER = mail_user_goes_here
  MAIL_PASSWORD = password_goes_here
  algorithm = aes-256-ctr
  ENCRYPT_DECRYPT_PASS = d6F3fequee92hd

  privateKeyOf1 = accounts_password_goes_here
  privateKeyOf2 = accounts_password_goes_here
  privateKeyOf3 = accounts_password_goes_here
  privateKeyOf4 = accounts_password_goes_here
  privateKeyOfTestAccount1 = accounts_password_goes_here
  privateKeyOfTestAccount2 = accounts_password_goes_here
  privateKeyOfTestAccount3 = accounts_password_goes_here
  privateKeyOfTestAccount4 = accounts_password_goes_here

  accountOrpa = account_address_goes_here
  accountOrpaPass = pass_goes_here
  accountMe = account_address_goes_here 
  accountMePass = pass_goes_here
  accountFaisal = account_address_goes_here 
  accountFaisalPass = pass_goes_here
  accountTusu = account_address_goes_here
  accountTusuPass = pass_goes_here
  testAccount1 = account_address_goes_here
  accountPass1 = pass_goes_here
  testAccount2 = account_address_goes_here
  accountPass2 = pass_goes_here
  testAccount3 = account_address_goes_here
  accountPass3 = pass_goes_here
  testAccount4 = account_address_goes_here
  accountPass4 = pass_goes_here
  testAccount5 = account_address_goes_here
  accountPass5 = pass_goes_here


  ALLOWED_CLIENTS = "http://localhost:3040,http://localhost:3060,http://localhost:3080"
  ```
  > You have to create geth accounts and private key by your own. Use your own account addresses name and password.

  **Step 5: Change the geth server and create your own blockchain account by the following commands:**

  ```shell
  mkdir blockchain
  cd blockchain
  mkdir data
  puppeth
  
  2. Configure new genesis
  1. Create new genesis from scratch
  1. Etash - proof-of-work
  give your network ID (ex: 3452)
  2. Manage existing genesis
  2. Export genesis configurations

  geth --datadir=./data init yourJSON_Name.json

  geth --http --http.port "8000" --http.corsdomain "*" --datadir=./data --port "30303" --nodiscover --allow-insecure-unlock --http.api "eth,net,web3,personal,miner,admin" --networkid your_networkID --nat "any" --syncmode="fast"

  geth attach "http://127.0.0.1:8000"
  personal.newAccount("password")
  miner.start()
  miner.stop()
  ```
  **Step 6: Run the nodejs and laravel-mix server by:**
  ```shell
  yarn serve
  # or
  npm run serve

  yarn production
  # or
  npm run production
  ```


## Requiments

- For development, you will need to have Node.js and geth installed in your device. You can use MongoDB Compass or MongoDB Atlas by your own choice.</br>
### Node
   #### Node installation on Windows

   -Just go on [official Node.js website](https://nodejs.org/) and download the installer.</br>
   -Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).</br>
     ----------------------------------------------------------------
### Geth
   #### Geth installation on Windows

   -Just go on [official Geth website](https://geth.ethereum.org/) and download the installer.</br>
    ----------------------------------------------------------------
### MongoDB

   -Just go on [official MongoDB website](https://www.mongodb.com/) and download the Compass or create MongoDB Atlas project..</br>
    ----------------------------------------------------------------
## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contribution</br>
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.</br>
Please make sure to update tests as appropriate.</br>

<h5 align="center">Thank you</h5>
