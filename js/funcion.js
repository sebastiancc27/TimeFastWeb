const btnBusarEnvio = document.querySelector(".timefast_seacrh_button");
const inputEnvio = document.getElementById("noGuia");
const listaPagos = document.querySelector(".timefast_main_container");
const textoEliminar = document.querySelector(".timefast_main_container_text");
const imgEliminar = document.querySelector(".timefast_main_container_img");

//!CREACIÓN DE LOS ELEMENTOS PARA 
const containerHistorialStatus = document.createElement('div')
containerHistorialStatus.className="lista-historial"
const tituloHistorialEstatus = document.createElement('h1');
tituloHistorialEstatus.className="timefast_title"
tituloHistorialEstatus.innerHTML="Historial de Estatus"

console.log(btnBusarEnvio);
console.log(inputEnvio)
console.log(listaPagos);

async function obtenerdatosEnvio() {
    let noEnvio = inputEnvio.value;
    const urlWSBase= `http://localhost:8084/TimeFastWS/timefast/envio/envio-NoGuia/${noEnvio}`    
    console.log(urlWSBase);
    try {
        const respuesta = await fetch(urlWSBase,{
            method:'GET'
        })
        if(respuesta.ok){
            const envio = await respuesta.json();            
            console.log(envio)
            mostrarInfoEnvio(envio);
            const idEnvio = envio.idEnvio;
            console.log(`IDENVIO: ${idEnvio}`);
            obtenerHistorial(idEnvio)
        }
    } catch (error) {
        console.error = 'Error en la peticion '+ error;
    }
}

async function obtenerHistorial(idEnvio) {
    const urlWSBase= `http://localhost:8084/TimeFastWS/timefast/envio/historial-envio/${idEnvio}`    
    containerHistorialStatus.innerHTML=""
    console.log(urlWSBase);
    try {
        const respuesta = await fetch(urlWSBase,{
            method:'GET'
        })
        if(respuesta.ok){
            const historial = await respuesta.json();            
            console.log(historial.length)
            if(historial.length>0){
                mostrarInfoHistorial(containerHistorialStatus,historial)
            }else{
                containerHistorialStatus.remove(    )
            }

        }
    } catch (error) {
        console.error = 'Error en la peticion '+ error;
    }
}

function mostrarInfoEnvio(envio) {
    textoEliminar.remove();
    imgEliminar.remove();
    if(envio.motivo == ''){
        envio.motivo='Sin Motivo'
    }
    const calleorigen = `${envio.calle} # ${envio.numero},  ${envio.colonia}, ${envio.cp}`
    const origen = `${envio.ciudad}, ${envio.estado}`
    listaPagos.innerHTML='';
    listaPagos.classList.remove("timefast_main_container");
    listaPagos.classList.add("timefast_infor_paquete");
    //!CREACIÓN DEL ELEMENTOS PARA LA INFORMACIÓN DEL PAQUETE
    const nuevoElemento = document.createElement('div');          
    nuevoElemento.className = "lista-elemento";
    nuevoElemento.innerHTML= `
    <strong class = "timefast_title">Información del Paquete</strong> <br>

    <strong class = "timefast_sutittle">Cliente: </strong> <br>
    <strong class ="timefast_info_envio">${envio.nombreCliente} </strong><br>

    <strong class = "timefast_sutittle">Costo del Envio: </strong> <br>
    <strong class ="timefast_info_envio">$ ${envio.costo} </strong><br>

    <strong class = "timefast_sutittle">Conductor: </strong> <br>
    <strong class ="timefast_info_envio">${envio.conductorAsignado}</strong><br>    

    <strong class = "timefast_sutittle">Estatus: </strong> <br>
    <strong class ="timefast_info_envio" id="estatusEnvio">${envio.estatus} </strong><br> 

    <strong class = "timefast_sutittle">Cantidad de Paquetes: </strong> <br>
    <strong class ="timefast_info_envio">${envio.cantidadPaquetes} </strong><br>    

    <strong class = "timefast_sutittle">Domicilio: </strong> <br>
    <strong class ="timefast_info_envio">${calleorigen} </strong><br>

    <strong class = "timefast_sutittle">Origen: </strong> <br>
    <strong class ="timefast_info_envio">${origen} </strong><br>  

    <strong class = "timefast_sutittle">Destino: </strong> <br>
    <strong class ="timefast_info_envio">${envio.destino} </strong><br>      
    `;
    //!CREACIÓN DE LOS ELEMENTOS PARA VISUALZIAR EL ESTATUS
    const elementoStatus = document.createElement('div')   
    const nuevaImgEstatus = document.createElement('img')
    const estatusEnvio = document.getElementById("estatusEnvio")
    
    nuevaImgEstatus.classList="img"
    elementoStatus.className = "infor_estatus_envio"; 
    if(envio.estatus =="Transito"){
        nuevaImgEstatus.src= '../img/EnTransito.png';       
    }
    if(envio.estatus =="Cancelado"){
        nuevaImgEstatus.src= '../img/Cancelado.png';       
    }
    if(envio.estatus =="Pendiente"){
        nuevaImgEstatus.src= '../img/Enpreparacion.png';       
    }
    if(envio.estatus =="Entregado"){
        nuevaImgEstatus.src= '../img/Entregado.png';       
    }
    if(envio.estatus =="Detenido"){
        nuevaImgEstatus.src= '../img/Detenido.png';       
    }

    
    //!CREACIÓN DE LOS ELEMENTOS PARA VISUALIZAR 
    elementoStatus.appendChild(nuevaImgEstatus);
    listaPagos.appendChild(elementoStatus);
    listaPagos.appendChild(containerHistorialStatus);
    listaPagos.appendChild(nuevoElemento);
}
btnBusarEnvio.addEventListener("click", (e)=>{
    obtenerdatosEnvio();
})

function mostrarInfoHistorial(contenedor, historial){
    contenedor.appendChild(tituloHistorialEstatus)
    historial.forEach(envio =>{
        const nuevoHistorial = document.createElement('div')
        nuevoHistorial.className = "lista-elementoBase";
        nuevoHistorial.innerHTML= `        
        <strong class="timefast_sutittle">Estatus</strong><br>
        <strong class="timefast_info_envio">${envio.estatus}</strong><br>

        <strong class="timefast_sutittle">Fecha de Cambio</strong><br>
        <strong class="timefast_info_envio">${envio.fechaCambio}</strong>    <br>
        `;
        contenedor.appendChild(nuevoHistorial);
    });
}