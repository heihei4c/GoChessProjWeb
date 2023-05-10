var boardElement = document.querySelector(".tenuki-board");
var game = new tenuki.Game({ element: boardElement });

const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
const buttonArea = document.querySelector('.button-area');

let dragAreaButton = document.querySelector('.drag-area .button');
let input = document.querySelector('input');

let file;

// when browse
input.addEventListener('change', function() {
    file = this.files[0];
    dragArea.classList.add('active');
    displayFile();
});

// when file is inside the drag area
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragText.textContent = 'Release to Upload';
    dragArea.classList.add('active');
    //console.log('File is inside the drag area.');
});

// when file leaves the drag area
dragArea.addEventListener('dragleave', (event) => {
    dragText.textContent = 'Drag & Drop';
    dragArea.classList.remove('active');
    //console.log('File left the drag area.');
});

// when file is dropped in drag area
dragArea.addEventListener('drop', (event) => {
    event.preventDefault();

    file = event.dataTransfer.files[0];
    //console.log(file);
    displayFile();
    
});

$(document).ready(function() {
    $('#submit').click(function() {
        // Get the selected file from the input field
        let previewImg = document.querySelector("#previewImg");
        let fileURL = previewImg.getAttribute("src");

        if (!fileURL) {
            alert('Please select an image file.');
            return;
        }


        var base64String = fileURL.replace('data:', '').replace(/^.+,/, '');

            // Make an AJAX call to the API endpoint 
        $.ajax({
            url: "https://api.heihei4c.dev/goChessDetectAPI",
            type: "POST",
            data: base64String,
            processData: false,
            success: function(response) {
                    // Parse the JSON output and display it on the page
                var data = response;
                $(".tenuki-board").empty();
                var boardElement = document.querySelector(".tenuki-board");
                var game = new tenuki.Game({ element: boardElement });
                var blackPiecesXPos = [];
                var blackPiecesYPos = [];
                var whitePiecesXPos = [];
                var whitePiecesYPos = [];

                for (var i = 0; i < data.length; i++) {
                    if (data[i].isBlack === true){
                        blackPiecesXPos.push(data[i].xPos);
                        blackPiecesYPos.push(data[i].yPos);
                    } else {
                        whitePiecesXPos.push(data[i].xPos);
                        whitePiecesYPos.push(data[i].yPos);
                    }
                }

                while (blackPiecesXPos.length > 0 || whitePiecesXPos.length > 0){
                    if (blackPiecesXPos.length > 0){
                        game.playAt(blackPiecesXPos[0], blackPiecesYPos[0]);
                        blackPiecesXPos.shift();
                        blackPiecesYPos.shift();
                    } else {
                        game.pass();
                    }

                    if (whitePiecesXPos.length > 0){
                        game.playAt(whitePiecesXPos[0], whitePiecesYPos[0]);
                        whitePiecesXPos.shift();
                        whitePiecesYPos.shift();
                    } else {
                        if (blackPiecesXPos.length > 0 )
                            game.pass();
                    }

                }
            },
            error: function() {
                alert("Error retrieving data.");
            }
        });

    });

    $('#remove').click(function(){
        dragArea.classList.remove('active');
        dragArea.innerHTML = '<div class="icon"><i class="fas fa-images"></i></div><span class="header">Drag & Drop</span><span class="header">or <span class="button" onclick="browseClick()">browse</span></span><input type="file" hidden /><span class="support">Supports: JPEG, JPG, PNG</span>';
        //dragAreaButton = document.querySelector('.drag-area .button');
        buttonArea.classList.add('hidden');
    });
});

function displayFile(){
    let fileType = file.type;
    //console.log(fileType);

    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    if (validExtensions.includes(fileType)){
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            //console.log(fileURL);
            let previewImg = document.createElement("img");
            previewImg.setAttribute("id", "previewImg");
            previewImg.setAttribute("src", fileURL);
            dragArea.innerHTML = "";
            dragArea.appendChild(previewImg);
        };
        fileReader.readAsDataURL(file);
        buttonArea.classList.remove('hidden');
    } else {
        alert('This file is not an Image');
        dragArea.classList.remove('active');
    }
    //console.log('File is dropped in drag area.');
}

function browseClick(){
    input.click();   
}