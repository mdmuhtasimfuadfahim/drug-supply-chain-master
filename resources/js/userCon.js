

export function userControl(){
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
            location.reload();
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
}