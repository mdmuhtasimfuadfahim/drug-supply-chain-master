import axios from 'axios'
import moment from 'moment'



export function initAdminShow(){
    const orderTableBody = document.querySelector('#orderTOShowCompleted')
    let orders = []

    let markup


    axios.get('/manufacturer/orders/completed',{
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
                <p>${ menuItem.drug.drugName } - ${ menuItem.qty } boxes </p>
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
                <td class="border px-4 py-2">${ order.depotId.name }</td>
                <td class="border px-4 py-2">${ order.depotId.phone }</td>
                <td class="border px-4 py-2">${ order.email }</td>               
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                   ${ order.status }
                </td>
                <td class="border px-4 py-2">
                ${ order.dar }
             </td>
             <td class="border px-4 py-2">
                ${ order.proId }
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

