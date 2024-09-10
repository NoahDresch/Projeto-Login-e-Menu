document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});


//botão de Logout
async function logout() {
    window.location = "login.html";
}