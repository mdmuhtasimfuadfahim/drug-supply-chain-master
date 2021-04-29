

export function durgStorageControl(){

    //----------------Update Drug Information--------------
$("#update_drugstorage").submit(function(event){
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
        "url" : `http://localhost:3040/manufacturer/drugstorage/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Drug Storage Information Updated Successfully!");
        location.reload();
    })
})

if(window.location.pathname == "/manufacturer/drugstorage"){
    window.$ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id3")

        var request2 = {
            "url" : `http://localhost:3040/manufacturer/drugstorage/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do You Want to Delete this Drug Information?")){
            $.ajax(request2).done(function(response){
                alert("Drug Informations Deleted Successfully!");
                location.reload();
            })
        }

    })
}



}