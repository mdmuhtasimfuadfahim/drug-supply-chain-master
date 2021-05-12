

export function orderDrugUpdate(){

//----------------Update Order Produciton ID--------------
$("#update_orders").submit(function(event){
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
        "url" : `http://localhost:3040/manufacturer/orders/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Order Produciton ID Updated");
        location.reload();
    })
})


}