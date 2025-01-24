document.addEventListener("DOMContentLoaded", function () {
    const toggleSideBoxButton = document.getElementById('side-box-button');
    const sideBox = document.getElementsByClassName('side-box')[0];
    const sideBoxContainer = document.getElementById("side-box-container");
    let sideBoxContainerOpened = true;
    sideBoxContainer.style.animationName = "side-box-container-animations-open";
    toggleSideBoxButton.addEventListener('click', function () {
        if (sideBoxContainerOpened) {
            sideBoxContainer.style.animationName = "side-box-container-animations-close";
            sideBoxContainerOpened = false;
        } else {
            sideBoxContainer.style.animationName = "side-box-container-animations-open";
            sideBoxContainerOpened = true;
        }
    });


    const inventoryElements = document.getElementsByClassName("inventory-box");
    for (let index = 0; index < inventoryElements.length - 1; index++) {
        const inventoryElement = inventoryElements[index];
        inventoryElement.addEventListener("click", () => {
            if (hotkey === index) {
                setHotkey(-1);
            } else {
                setHotkey(index);
            }
        });
    }
});


function setHotkey(value) {
    if (hotkey == value) {
        setHotkey(-1);
        return;
    }
    let oldHotkey = hotkey;
    hotkey = value;
    handleHotkeyChange(oldHotkey);
}

function handleHotkeyChange(oldHotkey) {
    if (oldHotkey != -1) {
        document.getElementsByClassName("inventory-box")[oldHotkey].classList.toggle('selected');
    }
    if (hotkey != -1) {
        document.getElementsByClassName("inventory-box")[hotkey].classList.toggle('selected');
    }
}

function uiUpdate() {
    let resourceBar = document.getElementById('resources');
    let resourceBarText = resourceBar.dataset.number;
    const width = (resource / parseInt(resourceBarText.split('/')[1]) * 100) || 0;
    resourceBar.dataset.number = resource + "/" + resourceBarText.split('/')[1];
    resourceBar.style.setProperty("--width", width)

    let pollutionBar = document.getElementById('carbon-emmision');
    let pollutionBarText = pollutionBar.dataset.number
    const width2 = (pollution / parseInt(pollutionBarText.split('/')[1]) * 100);
    pollutionBar.dataset.number = pollution + "/" + pollutionBarText.split('/')[1];
    pollutionBar.style.setProperty("--width", width2)

    let healthBar = document.getElementById('health-bar');
    let healthBarText = healthBar.dataset.number
    const width3 = (sprout.hp / parseInt(healthBarText.split('/')[1]) * 100);
    healthBar.dataset.number = sprout.hp + "/" + healthBarText.split('/')[1];
    healthBar.style.setProperty("--width", width3)
    healthBar.style.setProperty("--health-color", `hsl(${width3}, 41%, 41%)`)
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(image => image.setAttribute('draggable', false));
});

//sound
// document.addEventListener("click", function() {
//     soundControl.backgroundMusic.startAndLoop(1);
// })