  //function to display the choose image in img tag
  function loadFile(event){
    var image = document.getElementById("image");
    image.src = URL.createObjectURL(event.target.files[0])
}

//to view password when required
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
  const userimage = document.getElementById('file').value;



  //get the values
  var first_name = document.getElementById('firstName').value;
  var last_name = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
 
 
  var formData = new FormData();
  formData.append('file',file.files[0])
  formData.append('firstName',first_name)
  formData.append('lastName',last_name)
  formData.append('email',email);
  formData.append('password',password)


  if(!userimage){
    const message = document.getElementById('message')
    let error = 'Image field need to be selected';
    var responseData = `<p class="error">${error}</p>`;
    message.innerHTML += responseData
  }

    const res = await fetch('http://localhost:8000/signup',{
      method: 'POST',
      body:formData
    });
    document.getElementById('message').innerHTML = "";
    const data = await res.json();
    const status = await res.status;
    if(status === 201){
      userResonse(data);
      var image = document.getElementById("image");
      image.src = "images/vimage.jpg";
      document.getElementById('firstName').value = '';
      document.getElementById('lastName').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('file').value = "";   
    }else if(status === 400){
      fileError(data)
    }else{
      dataValidation(data)
    }

})

const message = document.getElementById('message')

function userResonse(data){
  let res = data
  var response = `<p class="success">${res}</p>`;
  message.innerHTML += response     
}

function fileError(data){
  let error = data;
  var responseData = `<p class="error">${error}</p>`;
  message.innerHTML += responseData
}

function dataValidation(data){
  let err = data;      
  for(i=0;i<err.length;i++){                 
      var responseData = `<p class="error">${err[i]}</p>`;
      message.innerHTML += responseData
  }    
}