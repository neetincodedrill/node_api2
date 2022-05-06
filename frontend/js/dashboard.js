  if(!localStorage.getItem('jwt')){
    window.location.href="signIn.html";
  }
  
  //function to display the choose image in img tag
  function loadFile(event){
    var image = document.getElementById("image");
    image.src = URL.createObjectURL(event.target.files[0])
}

//define the elements we need to update or adding user values inside it
const username = document.getElementById('name')
const useremail = document.getElementById('email')
var image = document.getElementById("image");
const heading = document.getElementById('heading')
const message = document.getElementById('message')

//to get the values of id and token from localstorage
const id = localStorage.getItem('userId');
const token = localStorage.getItem('jwt')

//get request to get login usert data
  fetch( `http://localhost:8000/${id}`,{
    headers : {
      'jwt' : token
    }
  })
    .then( response => response.json() )
    .then( response => {
         console.log(response.firstName,response.lastName,response.email,response.file)
        // Do something with response.
        let userheading = response.firstName;
        var responseData = `<span>Welcome back, ${userheading}</span>`;
        heading.innerHTML += responseData


        let userName = response.firstName + "  " + response.lastName;
        var responseData = `<span>${userName}</span>`;
        username.innerHTML += responseData

        let userEmail = response.email;
        var responseData = `<span>${userEmail}</span>`;
        useremail.innerHTML += responseData

        image.src = response.file
    });

//update request to update user info 
async function updateAccount(e){
  
  const id = localStorage.getItem('userId');
  const token = localStorage.getItem('jwt')
  var formData = new FormData();
  formData.append('file',file.files[0])
    const res = await fetch(`http://localhost:8000/update/${id}`,{
      method: 'PUT',
      body:formData,
      headers: {
        'jwt' : token
      }
    });
  const data = await res.json();
  const status = await res.status;
  console.log(data)
  console.log(status)
  if(status === 200) {
    let res = data
    var response = `<p class="success">${res}</p>`;
    message.innerHTML += response
  }
}

async function logOut(){
  localStorage.removeItem('userId');
  localStorage.removeItem('jwt');
  window.location.href="signIn.html";
}
