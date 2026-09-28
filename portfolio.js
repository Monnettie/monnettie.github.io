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


function selectCategory(button, category){

    if (category === null) {
        displayAll();
    } else {
        filterBy(category);
    }

    document.querySelectorAll('.category').forEach(function(item){
        item.classList.remove('active');
    });

    button.classList.add('active');

    const underline = document.querySelector('.category-underline');

    if (underline) {
        underline.style.left = button.offsetLeft + 'px';
        underline.style.width = button.offsetWidth + 'px';
    }
}


function positionCategoryUnderline(){

    const activeCategory = document.querySelector('.category.active');
    const underline = document.querySelector('.category-underline');

    if (!activeCategory || !underline) {
        return;
    }

    underline.style.left = activeCategory.offsetLeft + 'px';
    underline.style.width = activeCategory.offsetWidth + 'px';
}


document.addEventListener('DOMContentLoaded', function(){

    displayAll();

    positionCategoryUnderline();

});


window.addEventListener('resize', function(){

    positionCategoryUnderline();

});



