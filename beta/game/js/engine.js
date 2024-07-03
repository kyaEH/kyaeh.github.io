// this is a game engine. For now, the player is only able to move from room to room.
// The game engine will be able to handle events, items, and other things.
// This is a textual based game, so no drawings or animations are needed.

console.log('Engine is running');
console.log(mapData);

function toggleButton(Bool = true) {
    var buttons = document.getElementsByClassName('gameButton');
    for (var i = 0; i < buttons.length; i++) {
        //if the button have the class locked, skip
        if(buttons[i].classList.contains('locked')){
            continue;
        }
        buttons[i].disabled = Bool;
    }
}
// init player in bedroom
var player = {
    "currentRoom": 1,
    "inventory": []
};

// Make a onroomchange event

function onRoomChange(room, animateImage = true) {
    // if there is a blur class in the gameImage, remove it
    if(document.getElementById('gameImage').classList.contains('blur')){
        document.getElementById('gameImage').classList.remove('blur');
    }
    console.log('Room changed to ' + room);
    // Update the player object
    player.currentRoom = room;
    //Update the div with id gameChat with the room description mapData.maps[room - 1].description;
    // Update after 1 second until the text is gone
    // change rommTextIn by roomTextOut
    
    //if the gameImage has the class roomImgIn, remove it and add roomImgOut
    if(animateImage){
        if(document.getElementById('gameImage').classList.contains('roomImgIn'))
        document.getElementById('gameImage').classList.remove('roomImgIn');
        document.getElementById('gameImage').classList.add('roomImgOut');
        //Room text in to room text out from gameChat children 
        if(document.getElementById('gameChat').children[0].classList.contains('roomTextIn')){
            document.getElementById('gameChat').children[0].classList.remove('roomTextIn');
            document.getElementById('gameChat').children[0].classList.add('roomTextOut');
        }
    }
    toggleButton(true);
    // give the class fade out to the game nav buttons
    document.getElementById('gameNav').classList.add('roomTextOut');
    // remove the room text in class
    document.getElementById('gameNav').classList.remove('roomTextIn');

    setTimeout(function() {
        document.getElementById('gameChat').innerHTML = "<p class='roomTextIn'>" + mapData.maps[room - 1].description + "</p>";
        document.getElementById('gameNav').classList.add('roomTextIn');
        document.getElementById('gameNav').classList.remove('roomTextOut');
        // Update the gameChat with buttons for the directions
        document.getElementById('gameNav').innerHTML = "";
        var directions = mapData.maps[room - 1].directions;
        var directionsHtml = '';
        for (var key in directions) {
            if (directions.hasOwnProperty(key)) {
                if (directions[key].hidden) {
                    continue;
                }
                if(directions[key].locked) {
                    directionsHtml += '<button class="gameButton locked" onclick="onDirectionClick(' + directions[key].to + ')" disabled> 🔒 ' + key + '</button>';

                }
                else{
                    directionsHtml += '<button class="gameButton" onclick="onDirectionClick(' + directions[key].to + ')">' + key + '</button>';

                }
            }
        }
        document.getElementById('gameNav').innerHTML = directionsHtml;
        // get actions of the map and put it in the gameNav div as directionsHtml, but with a different class which only change the text then change back after a delay
        // Update the gameActions with buttons for the actions
        for (var key in mapData.maps[room - 1].actions) {
            if (mapData.maps[room - 1].actions.hasOwnProperty(key)) {
                var action = mapData.maps[room - 1].actions[key];
                // if the action has a requiredIdDone, check if the event id from eventsData get the attribute eventDone is true
                if (action.requiredIdDone != undefined) {
                    var event = eventsData.events.find(event => event.id === action.requiredIdDone);
                    if (!event.eventDone) {
                        continue;

                    }
                }
                if (action.triggerEvent) {
                    // add a button that will trigger the event
                    document.getElementById('gameNav').innerHTML += '<button class="gameButton actions" onclick="triggerEvent(' + action.eventID + ')">' + key + '</button>';
                } else {
                    // add a button that will just display the text
                    document.getElementById('gameNav').innerHTML += '<button class="gameButton actions" onclick="onActionClick(\'' + action.Text + '\')">' + key + '</button>';
                }
            }
        }
        
        // Update the image
        document.getElementById('gameImage').src = '../img/maps/' + mapData.maps[room - 1].image;
        if(animateImage){
            if(document.getElementById('gameImage').classList.contains('roomImgOut'))
            document.getElementById('gameImage').classList.remove('roomImgOut');
        document.getElementById('gameImage').classList.add('roomImgIn');
        }
        toggleButton(false);
        // onload, check if the room has a key called onLoadTriggerEvent, then trigger the event idd
        if(mapData.maps[room - 1].onMapLoadEvent !=undefined){
            toggleButton(true);
            setTimeout(function() {
                triggerEvent(mapData.maps[room - 1].onMapLoadEvent);
                toggleButton(false);
            }, 500);
            
        }

    }, 750);
}



//button on click event
function onDirectionClick(room) {
    // room is the id, we need the name from the id
    //get the locked state of the door
    var key = Object.keys(mapData.maps[player.currentRoom - 1].directions).find(key => mapData.maps[player.currentRoom - 1].directions[key].to === room);
    console.log(key);
    if (mapData.maps[player.currentRoom - 1].directions[key].locked) {
        console.log('The door is locked');
        // append to gameChat
        alert("The door is locked");
        return;
    }
    onRoomChange(room);
}

function onActionClick(text) {
    //fade in text with animate css
    document.getElementById('gameChat').innerHTML = '<p class="actionsText">' + text + '</p>';
    // after a delay, remove the text and put the room description back
    // disable all button if there is an action
    toggleButton(true);

    
    
    var timeout = setTimeout(function() {
        toggleButton(false);
        onRoomChange(player.currentRoom, false);

    }, 6600);
}
function onEventButtonClick(goto, event){
    //trigger the event from the passed event

}
function triggerEvent(eventID) {
    // get the event from the eventID
    document.getElementById('characterPortrait').style.display="none";
    console.log(eventID);
    var event = eventsData.events.find(event => event.id === eventID);
    console.log(event);
    // if "eventDone": false, "eventDefDone": false
    if(!event.eventDone && !event.eventDefDone){
        // show the event text and buttons
        
    
    //if isCharacterTalk is true, then show the character image and the text
    if(event.isCharacterTalk){
        console.log("Character");
        // id="characterPortrait" is actually display none, so we need to remove it
        //document.getElementById('characterPortrait').style.display="block";
        //
        characterID = event.characterID;
        console.log(charactersData[characterID]);
        document.getElementById('characterPortrait').src = '../img/characters/' + charactersData[characterID].image;
        //Once the image is loaded, add the blur class to the gameImage
        document.getElementById('characterPortrait').onload = function(){
            document.getElementById('gameImage').classList.add('blur');
            document.getElementById('characterPortrait').style.display="block";
        }
        //add a filter to the background

    }
        // display text with id 1 with buttons in gameChat for the text and the buttons in gameNav
        // event.texts is an array of objects with id including Text and Buttons array objects
        var text = event.text
        console.log(text.Text);
        // if text.Text contains $CHAR, replace it with the character name
        var characterName = charactersData[characterID].name;
        text.Text = text.Text.replace('$CHAR', characterName);
        document.getElementById('gameChat').innerHTML = '<p class="characterText">' + text.Text + '</p>';
        // Update the gameNav with the buttons
        var buttons = text.Buttons;
        //clear the buttons
        document.getElementById('gameNav').innerHTML = "";
        var buttonsHtml = '';
        for (var i = 0; i < buttons.length; i++) {
            console.log("GOTO "+buttons[i].Goto);
            if(buttons[i].Goto == 99){
                console.log("BBBBBBBBBBBBBBB");
                //get event from Buttons.endEvent
                var endEvent = eventsData.events.find(event => event.id === buttons[i].endEvent);
                console.log(endEvent);
                // If edvEvent exists, set eventDone to true
                if(endEvent != undefined){
                    endEvent.eventDone = true;
                    endEvent.eventDefDone = true;
                }
                buttonsHtml += '<button class="gameButton" onclick="onRoomChange(' + player.currentRoom +', false);">' + buttons[i].Text + '</button>';

            }
            else {
                buttonsHtml += '<button class="gameButton" onclick="triggerEvent(' + buttons[i].Goto +')">' + buttons[i].Text + '</button>';
        
            }
        }
            document.getElementById('gameNav').innerHTML = buttonsHtml;

    }
}
// init
onRoomChange(player.currentRoom);
