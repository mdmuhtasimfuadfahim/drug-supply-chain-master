import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'



export function initAdmin(socket){
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []

    let markup


    axios.get('/manufacturer/orders',{
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
                <td class="border px-4 py-2"><img style="border-radius: 5px; height:70px; width: 55px;" src="/img/${ order.depotId.image }" alt="image"></td>
                <td class="border px-4 py-2 text-green-900">
                    <p>${ order._id }</p>
                    <div>${ renderItems(order.drugs) }</div>
                </td>
                <td class="border px-4 py-2">${ order.depotId.name }</td>
                <td class="border px-4 py-2">${ order.depotId.phone }</td>
                <td class="border px-4 py-2">${ order.email }</td>               
                <td class="border px-4 py-2">${ order.address }</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/manufacturer/order/status" method="POST">
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
                        <form action="/manufacturer/order/dar" method="POST">
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
                    ${ order.proId }
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mmA') }
                </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('DD:MM:YYYY') }
                </td>
               
                <td class="border px-4 py-2">
                    ${ order.paymentStatus ? 'Paid' : 'Not paid' }
                </td>
                <td><a href="/manufacturer/update_orders?id=${ order._id }" class="btn border-shadow update">
                    <span class="text-gradient"><i class="fas fa-user-edit"></i></span></a>
                </td>
            </tr>
        `
        }).join('')
    }

    // Socket
    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New Order... Hurray!',
            progressBar: false,
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })

}

