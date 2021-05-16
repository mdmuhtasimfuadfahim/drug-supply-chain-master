import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'

export function initDepot(socket){
    const myOrderTableBody = document.querySelector('#myOrderTableBody')
    let ordersPharmacist = []
    let markupPharma 

    axios.get('/api/drug/depot/orders',{
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        ordersPharmacist = res.data
        markupPharma = generateMarkupPharma(ordersPharmacist)
        myOrderTableBody.innerHTML = markupPharma
    }).catch(err =>{
        //req.flash('error', 'Something Went Wrong')
        console.log(err)
    })

    function renderItemsPharma(drugs) {
        let parsedItems = Object.values(drugs)
        return parsedItems.map((menuItem) => {
            return `
            <p>${ menuItem.drugName } - ${ menuItem.productQuantity } boxes </p>
            `
        }).join('')
      }
     


    function generateMarkupPharma(ordersPharmacist){
    
        return ordersPharmacist.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItemsPharma(order.drugs) }</div>
                </td>
                <td class="border px-4 py-2">${ order.pharmacistId.name }</td>
                <td class="border px-4 py-2">${ order.pharmacistId.phone }</td>
                <td class="border px-4 py-2">${ order.pharmacistId.email }</td>               
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/api/drug/depot/orders/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/api/drug/depot/orders/dar" method="POST">
                            <input type="hidden" name="darNum" value="${ order._id }">
                            <select name="dar" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="Not Selected"
                                    ${ order.dar === 'Not Selected' ? 'selected' : '' }>
                                    Not Selected</option>
                                <option value="Single DAR" ${ order.dar === 'Single DAR' ? 'selected' : '' }>
                                    Single DAR</option>
                                <option value="Multiple DAR" ${ order.dar === 'Multiple DAR' ? 'selected' : '' }>
                                Multiple DAR</option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
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

    // Socket
    socket.on('newOrderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New Order... Hurray!',
            progressBar: false,
        }).show();
        ordersPharmacist.unshift(order)
        myOrderTableBody.innerHTML = ''
        myOrderTableBody.innerHTML = generateMarkupPharma(ordersPharmacist)
    })
}