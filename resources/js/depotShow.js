import axios from 'axios'
import moment from 'moment'



export function initDepotShow(){
    const orderTableBody = document.querySelector('#myCompletedOrderTable')
    let orders = []

    let markup


    axios.get('/api/drug/depot/orders/completed',{
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err =>{
        //req.flash('error', 'Something Went Wrong')
        //console.log(err)
    })

    function renderItems(drugs) {
        let parsedItems = Object.values(drugs)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.drugName } - ${ menuItem.productQuantity } boxes </p>
            `
        }).join('')
      }


    function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2"><img style="border-radius: 5px" height="50px" width="45px" src="/img/${ order.pharmacistId.image }" alt="image"></td>
                <td class="border px-4 py-2 text-green-900 text-center">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.drugs) }</div>
                </td>
                <td class="border px-4 py-2 text-center">${ order.pharmacistId.name }</td>
                <td class="border px-4 py-2 text-center">${ order.pharmacistId.phone }</td>
                <td class="border px-4 py-2 text-center">${ order.pharmacistId.email }</td>               
                <td class="border px-4 py-2 text-center">${ order.pharmacistId.address }</td>
                <td class="border px-4 py-2 text-center">
                   ${ order.status }
                </td>
                <td class="border px-4 py-2 text-center">
                   ${ order.dar }
                </td>
                <td class="border px-4 py-2 text-center">
                    ${ moment(order.createdAt).format('MMMM Do YYYY') }
                </td>
                <td class="border px-4 py-2 text-center">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2 text-center">
                    ${ order.paymentStatus ? 'Paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')
    }


}

