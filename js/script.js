//GLOBAL VARS----------------------------------------------------
var canon = Vector.canonVectors(); //i, j
var vectors = [canon[0], canon[1]]; //vector list
var vector; //vector object
var screen = "";
//---------------------------------------------------------------
//MAIN-----------------------------------------------------------
$(document).ready(function () {
    operationBtn(); //set click event to buttons   
    updateData(); //keyup update vector
    saveVector(); //save
});
//---------------------------------------------------------------
//CLICK EVENT BUTTONS FUNCTION-----------------------------------
function operationBtn() {
    let list = ["components", "module", "select"] //classes
    const dnoneDiv = () => {
        $(".replaceable").addClass("d-none");
        $(".input-div").removeClass("d-none");
        //hide initial div
    }
    list.forEach(i => {
        $("."+i+"-btn").click(function () {
            dnoneDiv();
            list.forEach(j => {
                if (i==j) {
                    $("."+j+"-div").removeClass("d-none");
                }else{
                    $("."+j+"-div").addClass("d-none");
                }
            });
            screen = $(this).attr("id"); //id
            resetData();            
        });
    });
}
//---------------------------------------------------------------
//RESET DATA VALUES 0 VECTOR NULL--------------------------------
function resetData() {
    let list = ["x", "y", "module", "direction", "escalar"]; //classes
    list.forEach(i => {
        //reset span, input, radios
        $(".data-"+i+" span").text(0);
        $("#"+i+"-input").val("");
        let a = document.querySelectorAll("input[type=radio]")
        a.forEach(j=>{j.checked = false});
    });
    displayVectorsBox() //update vector list div
    vector = new Vector(); //reset vector 
    if (screen=="p-escalar") {
        $(".calculated-div").addClass("d-none");
        $(".calculated-3d").addClass("d-none");
        $(".calculated-esc").removeClass("d-none");
    }else if(screen=="p-vectorial"){
        $(".calculated-div").addClass("d-none");
        $(".calculated-3d").removeClass("d-none");
        $(".calculated-esc").addClass("d-none");
    }
    else{
        $(".calculated-div").removeClass("d-none");
        $(".calculated-3d").addClass("d-none");
        $(".calculated-esc").addClass("d-none");
    }
    switch (screen) {
        case "unit": 
            $("input[type=radio]").click(function () {unitFun($(this));}); 
            $(".select-vector-subdiv .input-group").addClass("d-none"); //escalar input d-none
            break;
        case "escalar": 
            $("input[type=radio]").click(function () {escalarFun($(this));});
            $(".select-vector-subdiv .input-group").removeClass("d-none").keyup(escalarInputFunKey); 
            break;
        case "suma-resta":            
            $(".select-vector-subdiv .input-group").addClass("d-none");
            $("input[type=checkbox]").click(function () {additionFun($(this))});
            break;
        case "p-escalar":            
            $(".select-vector-subdiv .input-group").addClass("d-none");
            $("select").click(function () {escalarProduct()});
            escalarProduct();
            break;
        case "p-vectorial":            
            $(".select-vector-subdiv .input-group").addClass("d-none");
            $("select").click(function () {vecProduct()});
            vecProduct();
            break;
        default: break;
    }   
}
//---------------------------------------------------------------
//DISPLAY LIST VECTORS-------------------------------------------
function displayVectorsBox() {
    //vector screen
    $(".vectors ul").replaceWith("<ul class='list-group'></ul>");
    vectors.forEach(i => {
        let c = i.components;
        $(".vectors ul").append( //add list from vectors list
            "<li class='list-group-item list-vector-li'>\
            Vector "+i.name+": ("+c[0]+";"+c[1]+")</li>"
        );
    });
    //select vector div append elements radio - checkbox - select
    $(".select-vector-subdiv").replaceWith("<div class='select-vector-subdiv'></div>");
    if (screen=="unit" || screen=="escalar") {        
        for (let i = 0; i < vectors.length; i++) {
            let c = vectors[i].components;
            $(".select-vector-subdiv").append(
                "<div class='form-check'>\
                <input class='form-check-input' type='radio' name='select-vector' id='select-vector-"+(i+1)+"'>\
                <label class='form-check-label' for='select-vector-"+(i+1)+"'>\
                Vector "+vectors[i].name+": ("+c[0]+";"+c[1]+")</label>\
                </div>"
            );
        }
    }else if(screen=="p-escalar"||screen=="p-vectorial"){
        $(".select-vector-subdiv").append("<label class='form-check-label' for='v1-select'>Vector 1</label>");
        $(".select-vector-subdiv").append("<select class='form-select form-select-sm my-2' id='v1-select'></select>");
        $(".select-vector-subdiv").append("<label class='form-check-label' for='v2-select'>Vector 2</label>");
        $(".select-vector-subdiv").append("<select class='form-select form-select-sm my-2' id='v2-select'></select>");
        for (let i = 0; i < vectors.length; i++) {
            let c = vectors[i].components;
            $("#v1-select").append(
                "<option value='"+(i+1)+"'>\
                Vector "+vectors[i].name+": ("+c[0]+";"+c[1]+")</label>\
                </option>"
            );
            $("#v2-select").append(
                "<option value='"+(i+1)+"'>\
                Vector "+vectors[i].name+": ("+c[0]+";"+c[1]+")</label>\
                </option>"
            );
        }
    }else{
        for (let i = 0; i < vectors.length; i++) {
            let c = vectors[i].components;
            $(".select-vector-subdiv").append(
                "<div class='form-check'>\
                <input class='form-check-input' type='checkbox' value='vector-"+(i+1)+"' id='select-vector-"+(i+1)+"'>\
                <label class='form-check-label' for='select-vector-"+(i+1)+"'>\
                Vector "+vectors[i].name+": ("+c[0]+";"+c[1]+")</label>\
                </div>"
            );
        }
    }
    $(".select-vector-subdiv").append(//escalar input
        "<div class='input-group flex-wrap d-none'>\
        <span class='input-group-text' id='addon-wrapping-z'>λ</span>\
        <input type='number' id='escalar-input' class='form-control' placeholder='Escalar'>"
    );
}
//---------------------------------------------------------------
//SPAN UPDATE VALUES---------------------------------------------
function writeData(v, param) {
    if (v=="") {
        $(".data-"+param+" span").text(0);
    }else{
        //v = parseFloat(v);
        $(".data-"+param+" span").text(v);
    }
}
//---------------------------------------------------------------
//WRITE DATA ON KEYUP--------------------------------------------
function updateData() {
    let list = ["x", "y", "module", "direction"];
    list.forEach(i => {
        $("#"+i+"-input").keyup(function(){
            let v = $(this).val();
            writeData(v, i)
            if (i=="x" || i=="y") {
                //calc module and direction
                let x = $(".data-x span").text();
                let y = $(".data-y span").text();
                vector.componentx = parseFloat(x);
                vector.componenty = parseFloat(y);
                vector.moduleCalc();
                vector.directionCalc();
                writeData(vector.module, "module");
                writeData(vector.direction, "direction");
            }else{
                let m = $(".data-module span").text();
                let d = $(".data-direction span").text();
                vector.module = parseFloat(m);
                vector.direction = parseFloat(d);
                vector.componentsCalc();
                let c = vector.components;
                writeData(c[0], "x");
                writeData(c[1], "y");
            }
        });
    });
}
//---------------------------------------------------------------
//CLICK EVENT SAVE VECTOR BTN------------------------------------
function saveVector() {
    const searchName = (e) => {
        for (let i = 0; i < vectors.length; i++) {
            if (vectors[i].name==e) {
                return true;
            }
        }
        return false;
    }
    $("#save").click(function () {
        let n = prompt("Inserta nombre del vector: ");
        if (n!="" && n!=null)  {  
            if (searchName(n)) {
                alert("Ese nombre ya existe...");
            }else{
                vector.name = n;
                vectors.push(vector);
                displayVectorsBox();
                resetData();
            }     
        }
    });
}
function getNumberID(params) {
    let id = params.attr("id");
    let ind = id.lastIndexOf("-");
    let numstr = id.slice(ind+1, id.length)
    let num = parseInt(numstr);
    return num;
}
//---------------------------------------------------------------
//RADIO UNIT CALC------------------------------------------------
function unitFun(radio) {
    let num = getNumberID(radio);
    let v = vectors[num-1];
    vector.unitVector(v);
    let c = vector.components;
    writeData(c[0], "x");
    writeData(c[1], "y");
    writeData(vector.module, "module");
    writeData(vector.direction, "direction");
}
//---------------------------------------------------------------
//RADIO ESCALAR CALC---------------------------------------------
function escalarFun(radio) {
    let num = getNumberID(radio);
    let v = vectors[num-1];
    let esc = parseFloat($("#escalar-input").val());
    if (Number.isNaN(esc)) {
        esc = 0;
    }
    vector.escalarVector(v, esc);
    let c = vector.components;
    writeData(c[0], "x"); 
    writeData(c[1], "y");
    writeData(vector.module, "module");
    writeData(vector.direction, "direction");
}
//---------------------------------------------------------------
//INPUT ESCALAR CALC KEYUP---------------------------------------
function escalarInputFunKey() {    
    document.querySelectorAll("input[type=radio]").forEach(i => {
        if (i.checked) {
            escalarFun($(i));
        }
    });
}
//---------------------------------------------------------------
//ADDITION AND SUSTRACTION---------------------------------------
function additionFun(check) {
    let id = check.attr("id");
    let num = getNumberID(check);
    let b = document.getElementById(id).checked;
    vector.addition(vectors[num-1], b);
    let c = vector.components;
    writeData(c[0], "x"); 
    writeData(c[1], "y");
    writeData(vector.module, "module");
    writeData(vector.direction, "direction");
}
//---------------------------------------------------------------
//ESCALAR PRODUCT------------------------------------------------
function escalarProduct() {
    let index1 = $("#v1-select").val();
    let index2 = $("#v2-select").val();
    let v1 = vectors[index1-1];
    let v2 = vectors[index2-1];
    let escp = Vector.escalarProduct(v1, v2);
    writeData(v1.name, "v1");
    writeData(v2.name, "v2");
    writeData(escp, "esc");
}
//---------------------------------------------------------------
//VECTORIAL PRODUCT----------------------------------------------
function vecProduct() {
    let index1 = $("#v1-select").val();
    let index2 = $("#v2-select").val();
    let v1 = vectors[index1-1];
    let v2 = vectors[index2-1];
    let vect = Vector.vectorialProduct(v1, v2);
    writeData(vect[0].toString(), "x3d");
    writeData(vect[1].toString(), "y3d");
    writeData(vect[2].toString(), "z3d");
    writeData(vect[3].toString(), "module3d");
}