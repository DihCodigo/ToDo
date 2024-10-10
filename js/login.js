// Lista de emails autorizados
const emailsAutorizados = ["cesar@objctv.one", "vinicius.souza@objctv.com"];

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const emailInput = document.getElementById('email').value; 

    if (emailsAutorizados.includes(emailInput)) {
        localStorage.setItem('logado', true); 
        localStorage.setItem('emailUsuario', emailInput);

        window.location.href = "index.html"; 
    } else {
        const errorMessage = document.getElementById('login-error');
        errorMessage.style.display = 'block';
    }
});
