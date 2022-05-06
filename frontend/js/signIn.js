//to view password
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    
    // toggle the icon
    this.classList.toggle("bi-eye");
});

const form = document.querySelector("form");

form.addEventListener('submit',async(e) => {
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // var formData = new FormData();
    // formData.append('email',email);
    // formData.append('password',password)

    const res = await fetch('http://localhost:8000/login',{
    method: 'POST',
    body:JSON.stringify({ email, password }),
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
    }
  });
    document.getElementById('message').innerHTML = "";
    
    const data = await res.json();
    const status = await res.status;
    // const token = await res.
    // console.log(data)
    // console.log(req.headers.jwt)

    if(status === 200){       
         console.log(data.id,data.token)
        // console.log(data)  
        localStorage.setItem('jwt',data.token)
        localStorage.setItem("userId", data.id);
        window.location.href="dashboard.html";
    }else{
        dataValidation(data)
    }
     
})

const message = document.getElementById('message')


function dataValidation(data){
    let error = data;
    var responseData = `<p class="error">${error}</p>`;
    message.innerHTML += responseData
  }
