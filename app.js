function buscar(tipo, valor) {
    if (!valor) {
        document.getElementById('resultado').textContent = 'Por favor, ingresa un ' + tipo;
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (!this.responseText) {
                document.getElementById('resultado').textContent = 'No se encontró ningún registro con ese ' + tipo.toUpperCase();
                return;
            }
            var data = JSON.parse(this.responseText);
            if (typeof data === 'object' && data !== null && 'codigo' in data && 'nombre' in data) {
                var resultado = 'Código: ' + data.codigo + '\n' + 'Nombre: ' + data.nombre;
                document.getElementById('resultado').textContent = resultado;
            } else {
                document.getElementById('resultado').textContent = 'Este ' + tipo + ' no se encuentra en la base de datos';
            }
        } else if (this.readyState == 4 && this.status == 404) {
            document.getElementById('resultado').textContent = 'Este ' + tipo + ' no se encuentra en la base de datos';
        }
    };
    xhttp.onerror = function() {
        document.getElementById('resultado').textContent = 'Ha ocurrido un error al realizar la solicitud';
    };
    xhttp.open("GET", "https://api-i2h0.onrender.com/api/codigosPor" + tipo.charAt(0).toUpperCase() + tipo.slice(1) + "/" + valor, true);
    xhttp.send();
}

function buscarPorNombre() {
    var nombre = document.getElementById('nombre').value;
    buscar('nombre', nombre);
}

function buscarPorCodigo() {
    var codigo = document.getElementById('codigo').value;
    buscar('codigo', codigo);
}
