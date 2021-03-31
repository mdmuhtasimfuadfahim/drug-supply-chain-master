import axios from 'axios'
import Noty from 'noty'
import { initToast } from './toast'
import { initFilesShare } from './fileShare'
import { initTheme } from './themeSwitcher'
import { initSun } from './sunSwitecher'
import { initNew } from './new'
import { initAdmin } from './admin'
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
// const updateUser = document.querySelector('#update_user')



$("#update_user").submit(function(event){
    event.preventDefault();
    var unindexed_array = $(this).serializeArray();
    //console.log(unindexed_array)
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    // console.log(data)

    // const base = 'http://localhost:3040',
    var request = {
        "url" : `http://localhost:3040/api/drug/manufacturer/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })
})

if(window.location.pathname == "/manufacturer/accounts"){
    window.$ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3040/api/drug/manufacturer/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do You Want to Revocate this Member?")){
            $.ajax(request).done(function(response){
                alert("Member Informations Deleted Successfully!");
                location.reload();
            })
        }

    })
}

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

//----------Admin JS File----------------
initAdmin(socket)

//--------Join-----------
if(order){
    socket.emit('join', `order_${order._id}`)
}

let manufacturerAreaPath = window.location.pathname
//console.log(manufacturerArea)

if(manufacturerAreaPath.includes('manufacturer')){
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


