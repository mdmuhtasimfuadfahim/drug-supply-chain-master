# <h1 align="center">Drug Guard: Secure and Transparent Supply Chain Management to Prevent Counterfeit Drugs</h1>

## Keywords: Counterfeit drug · Blockchain · Security · Encrypted QR Code · Traceability · Transparency</br>

## Drug supply chain</br>
This platform provides a secure network where countefeiting of drugs will be reduced or removed. It is a tranparent network through blockchain where all the users can see others activities. I have built a platform over the Ethereum network.

## ResearchGate
 - [Project and Paper](https://www.researchgate.net/project/Drug-Guard-A-Secure-and-Transparent-Supply-Chain-Management-to-Prevent-Counterfeit-Drugs)

## Project demo video
 - [Link](https://drive.google.com/file/d/1RPKnCdRp2FT4k20m16M9HxriwzdFAgmx/view)
 
## Technology satcks and tools

<h4 align="left">
#### Backend
 - Node.JS
 - Express.JS
 - Laravel Mix
 - MongoDB (DB)
</h4>

<h4 align="center">
#### Frontend
 - EJS
 - SCSS
 - Tailwind CSS
 - JavaScript
</h4>

<h4 align="right">
#### Blockchain
 - Language: Solidity
 - Platform: Ethereum
 - Packages: Web3.js
 - Node & TestRPC: Geth
</h4>

## Features</br>
 - Place order for pharmacist or depot in-charge.</br>
 - Blockchain for all the transaction history.</br>
 - Real time update role or receive confirmation.</br>
 - Invoice sharing via email.</br>
 - Real time order status or location update.</br>
 - Encrypted QR code.</br>
 - Add manufactured drugs information and add secret informations about any production.</br>
 
## Getting started</br>
**Step 1: Clone the repo by: `git clone https://github.com/mdmuhtasimfuadfahim/drug-supply-chain-master` or download the repository.**</br>
**Step 2: Change PORT according to your preference or leave it as it is.**</br>
**Step 3: Install all the dependencies (from root directory) by: `yarn install or npm install`.**</br>
>If you download the repo then you have to install all the dependencies of *package.json* file.</br>

**Step 4: Run the development server by: `yarn dev or npm run dev` and for production: `yarn serve or npm run serve`.**</br>
**Step 5: Run the *laravel-mix* server by: `yarn watch or npm run watch` and for production: `yarn produciton or npm run produciton`.**</br>

## Environment variables</br>
Open or create a .env file then edit add these settings</br>
```
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
