"use strict"

//EVENTS
$(document).ready(function(){    
    console.clear();
    readAll();

    var myModalEl = document.getElementById('modalView');
    myModalEl.addEventListener('hidden.bs.modal', function (event) {
        document.getElementById("gameInfo").innerHTML = "";
    });
});

$("#btnNewGame").click(function(){
    openModalCreate();
});

$("#frmGame").submit(function(e){
    sendForm();
    e.preventDefault();
});

//FUNCTIONS
function edit(id){
    if(id <= 0){
        return;
    }
    readById(id, false);
}

function openModalCreate(reset = true){
    $("#modalNewGame").modal("show");

    if(reset){
        resetForm();
    }
}

function hideModalCreate(){
    $("#modalNewGame").modal("hide");
}

function openModalViewGame(id){
    readById(id, true);
    $("#modalView").modal("show");    
}

function confirmDelete(id){
    if(!confirm("Deseja realmente remover id:"+id+"?")){
        return;        
    }
    deleteGame(id);
}

//SEND
function sendForm(){
    var obj = {
        id: $("#txtId").val(),
        titulo: $("#txtTitle").val(),
        descricao: $("#txtDescription").val(),
        videoid: $("#txtVideoId").val(),
    };

    var result = validate(obj);
    $("#dvAlert").text(result);

    if(result != ""){        
        return;
    }

    if(obj.id == 0){
        create(obj)
    }else{
        update(obj);
    }
    
}

function validate(obj){
    if(obj.id < 0){
        return "- ID inválido";
    }
    if(obj.titulo.length < 4 || obj.titulo.length > 100){
        return "- Título inválido";
    }
    if(obj.descricao.length < 10 || obj.descricao > 250){
        return "- Descrição inválida";
    }
    if(obj.videoid == "" || obj.videoid.length > 15){
        return "- Vídeo ID inválido";
    }

    return "";
}

function resetForm(){    
    $("#txtId").val("0");
    $("#txtTitle").val("");
    $("#txtDescription").val("");
    $("#txtVideoId").val("");
    "<div>"+data.Descricao+"</div>";
    $("#dvAlert").html("&nbsp;");
    $("#btnSubmit").attr("disabled", false);
}

function createViewModal(data){
    document.getElementById("titleView").innerHTML = data.Titulo;
    document.getElementById("gameInfo").innerHTML = "<div class='videoWrapper'>"+
    "<iframe width='560' height='315' src='https://www.youtube.com/embed/"+data.Videoid+"' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"+
    "</div>"+
    "<hr class='border border-info'>"+
    "<div>"+data.Descricao+"</div>";
}

function createTable(data){
    if(data.length < 1){
        return;
    }

    var section = document.getElementById("section");
    section.innerHTML = "";

    for(var i = 0; i < data.length; i++){
        var col = 
        "<div class='col-md-4 mt-3'>"+
            "<div class='card border-primary'>"+
                "<div class='card-header'>"+data[i].Titulo+"</div>"+
                    "<div class='card-body'>"+
                        "<div class='videoWrapper'>"+
                            "<iframe width='560' height='315' src='https://www.youtube.com/embed/"+data[i].Videoid+"' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"+
                        "</div>"+
                    "</div>"+
                    "<div class='card-footer'>"+
                        "<div class='row'>"+
                            "<div class='col-md-3'>"+
                                "<button type='button' class='mb-2 w-100 btn btn-outline-warning' onclick='edit("+data[i].Id+")'>Edit</button>"+
                            "</div>"+
                            "<div class='col-md-6'>"+
                                "<button type='button' class='mb-2 w-100 btn btn-outline-success' onclick='openModalViewGame("+data[i].Id+")'>View</button>"+
                            "</div>"+
                            "<div class='col-md-3'>"+
                                "<button type='button' class='mb-2 w-100 btn btn-outline-danger' onclick='confirmDelete("+data[i].Id+")'>Del</button>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>";
        section.innerHTML += col;
    }
}

function editModal(data){
    if(data == null){
        return;
    }
    
    $("#txtId").val(data.Id);
    $("#txtTitle").val(data.Titulo);
    $("#txtDescription").val(data.Descricao);
    $("#txtVideoId").val(data.Videoid);

    openModalCreate(false);
}

//===========AJAX

//Requisição AJAX para consultar
function create(obj){
    $.ajax({
        url: "http://localhost/APIs/api_com_php/gamenews_api/api/game",
        type: "POST",
        data: obj,
        dataType: "json",
        beforeSend: function(){
            //Chama antes de enviar
            $("#btnSubmit").attr("disabled", true);
        },
        success: function(data){
            //Tudo estive ok
            console.log(data);
            if(data.result == "ok"){
                hideModalCreate();
                readAll();
            }else{
                $("#dvAlert").html("Houve um erro ao tentar cadastrar");
            }
        },
        erro: function(error){
            //Quando heuver um erro
            console.log(error);
            $("#dvAlert").html("Houve um erro ao tentar cadastrar");
        },
        complete: function(){
            //Quando finalizar a operação
            $("#btnSubmit").attr("disabled", false);
        }
    });
}

function update(obj){
    $.ajax({
        url: "http://localhost/APIs/api_com_php/gamenews_api/api/game/"+obj.id,
        type: "PUT",
        data: obj,
        dataType: "json",
        beforeSend: function(){
            //Chama antes de enviar
            $("#btnSubmit").attr("disabled", true);
        },
        success: function(data){
            //Tudo estive ok
            console.log(data);
            if(data.result == "ok"){
                hideModalCreate();
                readAll();
            }else{
                $("#dvAlert").html("Houve um erro ao tentar alterar");
            }
        },
        erro: function(error){
            //Quando heuver um erro
            console.log(error);
            $("#dvAlert").html("Houve um erro ao tentar alterar");
        },
        complete: function(){
            //Quando finalizar a operação
            $("#btnSubmit").attr("disabled", false);
        }
    });
}

function readAll(){
    $.ajax({
        url: "http://localhost/APIs/api_com_php/gamenews_api/api/game",
        type: "GET",
        data: {},
        dataType: "JSON",
        success: function(data){
            console.table(data);
            createTable(data);
        },
        error: function(error){
            console.log(error);
        }
    });
}

//view = true || false; Show modal or edit modal
function readById(id, view){
    $.ajax({
        url: "http://localhost/APIs/api_com_php/gamenews_api/api/game/"+id,
        data: {},
        type: "GET",
        dataTyle: "JSON",
        success: function(data){
            if(view){
                //SHOW MODAL
                createViewModal(data);
            }else{
                //EDIT MODAL
                editModal(data);
            }
        }
    });
}

function deleteGame(id){
    $.ajax({
        url: "http://localhost/APIs/api_com_php/gamenews_api/api/game/"+id,
        type: "DELETE",
        dataTyle: "JSON",
        data: {},
        success: function(data){
            console.log(data);
            if(data.result == "ok"){
                readAll();
            }
        },
        error: function(error){
            console.log(error);
        }
    });
}