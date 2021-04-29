import axios from 'axios'
import Noty from 'noty'
import { initToast } from './toast'
import { initFilesShare } from './fileShare'
import { initTheme } from './themeSwitcher'
import { initSun } from './sunSwitecher'
import { initNew } from './new'
import { initAdmin } from './admin'
import { userControl } from './userCon'
import { drugControl } from './drugCon'
import { initDepot } from './depot'
import { initAdminShow } from './adminShow'
import { durgStorageControl } from './durgStoreCon'
import { initDepotShow } from './depotShow'
import jQuery from 'jquery'
import moment from 'moment'
window.$ = window.jQuery = jQuery
// export for others scripts to use



const categoryTitle = document.querySelectorAll('.category-title');
const allCategoryPosts = document.querySelectorAll('.all');

for(let i = 0; i < categoryTitle.length; i++){
    categoryTitle[i].addEventListener('click', filterPosts.bind(this, categoryTitle[i]));
}

function filterPosts(item){
    changeActivePosition(item);
    for(let i = 0; i < allCategoryPosts.length; i++){
        if(allCategoryPosts[i].classList.contains(item.attributes.id.value)){
            allCategoryPosts[i].style.display = "block";
        } else {
            allCategoryPosts[i].style.display = "none";
        }
    }
}

function changeActivePosition(activeItem){
    for(let i = 0; i < categoryTitle.length; i++){
        categoryTitle[i].classList.remove('active');
    }
    activeItem.classList.add('active');
};



let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
function updateCart(drug){
    axios.post('/update_cart', drug).then(res =>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'You Added Drugs into Your Cart',
            progressBar: false
        }).show();
    }).catch(err =>{
     new Noty({
         type: 'error',
         timeout: 1000,
         text: 'Something Went Wrong',
         progressBar: false
     }).show();
    })
}
addToCart.forEach((btn)=>{
    if(!addToCart){
        return;
    }
    btn.addEventListener('click', (e)=>{
        let drug = JSON.parse(btn.dataset.drug)
        updateCart(drug)
        //console.log(drug)
    })
})


//-------------Toast JS File-------------
initToast()


//-------------Email File Share-------------
initFilesShare()


//-------------Theme Switcher------------
initTheme()
initSun()

//--------------SideBar Manufacturer Panel---------
initNew()


//--------------Update User--------------
userControl()


//--------------Drug Controller JS----------
drugControl()

//-------------Drug Storage Controller JS-------
durgStorageControl()


//--------- Remove Alert---------
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}




//--------Change Order Status-----------
let statuses = document.querySelectorAll('.status-line')
// console.log(statuses)

let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null

order = JSON.parse(order)
// console.log(order)

let time = document.createElement('small')


function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status) =>{
     let dataPro = status.dataset.status
     if(stepCompleted){
         status.classList.add('step-completed')
     }
     if(dataPro === order.status){
        stepCompleted = false
        time.innerText = moment(order.updatedAt).format('hh:mm A')
        status.appendChild(time)
        if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current')
        }
         
     }
    })
}

updateStatus(order);

//---------Socket-----------
let socket = io()



//--------Join-----------
if(order){
    socket.emit('join', `order_${order._id}`)
}

let manufacturerAreaPath = window.location.pathname

//console.log(manufacturerArea)



if(manufacturerAreaPath.includes('manufacturer')){
    //----------Admin JS File----------------
    initAdmin(socket)
    socket.emit('join', 'manufacturerRoom')
}

socket.on('orderUpdated', (data)=>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Updated Order',
        progressBar: false
    }).show();
    // console.log(data)
})

//-----------------Change Lcoation----------
const hiddenInput2 = document.querySelector('#hiddenInput2')
let roles = document.querySelectorAll('.status-line-2')
//console.log(roles)

let order2 = hiddenInput2 ? hiddenInput2.value : null

order2 = JSON.parse(order2)
//console.log(order2)



function updateRole(order2){
    roles.forEach((role)=>{
        role.classList.remove('step-completed2')
        role.classList.remove('current2')
    })

     let stepCompleted2 = true;
    roles.forEach((role) =>{
     let dataPro2 = role.dataset.role
     if(stepCompleted2){
         role.classList.add('step-completed2')
     }
     if(dataPro2 === order2.role){
        stepCompleted2 = false
        time.innerText = moment(order2.updatedAt).format('hh:mm A')
        role.appendChild(time)
        if(role.nextElementSibling){
            role.nextElementSibling.classList.add('current2')
        }
         
     }
    })
 }

updateRole(order2);

//------------Depot Order Control----------
let depotInAreaPath = window.location.pathname
//console.log(depotInAreaPath)

if(depotInAreaPath.includes('depot')){
    //----------Depot JS File----------------
    initDepot(socket)
    socket.emit('join', 'DepotInRoom')
}

//--------------Completed Order Pages of Manufacturer and Depot In-charge
initAdminShow()
initDepotShow()


socket.on('locationUpdate', (data)=>{
    const locationUpdated = { ...order }
    locationUpdated.updatedAt = moment().format()
    locationUpdated.role = data.role
    updateRole(locationUpdated)
    // new Noty({
    //     type: 'success',
    //     timeout: 1000,
    //     text: 'Location Updated',
    //     progressBar: false
    // }).show();
    // console.log(data)
})


