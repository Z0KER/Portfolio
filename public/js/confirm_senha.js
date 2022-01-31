var check = function() {
    if(document.getElementById('senha').value.length < 8) {
        document.getElementById('msg').style.color = 'rgb(248, 82, 82)';
        document.getElementById('msg').innerHTML = 'Digite uma senha de no mínimo 8 caracteres';
    } else {
        document.getElementById('msg').innerHTML = '';
    }

    if(document.getElementById('senha').value == '' || document.getElementById('confirm_senha').value == '') {
        document.getElementById('message').innerHTML = '';
    } else if(document.getElementById('senha').value == document.getElementById('confirm_senha').value) {
        document.getElementById('message').innerHTML = '';
    } else {
        document.getElementById('message').style.color = 'rgb(248, 82, 82)';
        document.getElementById('message').innerHTML = 'As senhas não conferem!';
    }
}