// elem.style.display = 'block';


function showImage(imageID){
    var elem = document.getElementById(imageID);
    elem.classList.add('active');

}



function closeWindow(imageID){
    var elem = document.getElementById(imageID);
    elem.classList.remove('active');
    
}



function filterBy(category){
    const boxes = document.querySelectorAll('.project');
            boxes.forEach(box => {
                if (box.classList.contains(category)) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
}


function displayAll(){
     const boxes = document.querySelectorAll('.project');
            boxes.forEach(box => {
                    box.style.display = 'block';
            });
}