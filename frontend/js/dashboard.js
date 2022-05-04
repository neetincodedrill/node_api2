  //function to display the choose image in img tag
  function loadFile(event){
    var image = document.getElementById("image");
    image.src = URL.createObjectURL(event.target.files[0])
}