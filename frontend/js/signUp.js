  //function to display the choose image in img tag
  function loadFile(event){
    var image = document.getElementById("image");
    image.src = URL.createObjectURL(event.target.files[0])
}

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    
    // toggle the icon
    this.classList.toggle("bi-eye");
});