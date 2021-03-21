import axios from 'axios'
import Noty from 'noty'
import { initToast } from './toast'
import { initFilesShare } from './fileShare'
import { initTheme } from './themeSwitcher'
import { initSun } from './sunSwitecher'
import { initNew } from './new'

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







