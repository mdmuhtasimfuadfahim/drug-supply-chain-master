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
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.drugs) }</div>
                </td>
                <td class="border px-4 py-2">${ order.pharmacistId.name }</td>
                <td class="border px-4 py-2">${ order.pharmacistId.phone }</td>
                <td class="border px-4 py-2">${ order.pharmacistId.email }</td>               
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                   ${ order.status }
                </td>
                <td class="border px-4 py-2">
                   ${ order.dar }
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('MMMM Do YYYY') }
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'Paid' : 'Not paid' }
                </td>
            </tr>
        `
        }).join('')
    }


}

