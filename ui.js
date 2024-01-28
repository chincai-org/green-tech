document.addEventListener("DOMContentLoaded", function () {
    const toggleSideBoxButton = document.getElementById('side-box-button');
    const sideBox = document.getElementsByClassName('side-box')[0];

    toggleSideBoxButton.addEventListener('click', function () {
        if (sideBox.style.display != 'none') {
            sideBox.style.display = 'none';
        } else {
            sideBox.style.display = 'block';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    for (let index = 0; index < document.getElementsByClassName("inventory-box").length; index++) {
        const inventoryElement = document.getElementsByClassName("inventory-box")[index];
        inventoryElement.addEventListener("click", () => {
            if (hotkey === index) {
                setHotkey(-1);
            } else {
                setHotkey(index);
            }
        });
    }

});

for (let index = 0; index < document.getElementsByClassName("inventory-box").length; index++) {
    const inventoryElement = document.getElementsByClassName("inventory-box")[index];
    alert("run");
    inventoryElement.addEventListener("click", () => {
        if (hotkey === index) {
            setHotkey(-1);
        } else {
            setHotkey(index);
        }
    });
}

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
    let resourceBar = document.getElementsByClassName('bar')[0];
    let resourceBarText = resourceBar.getElementsByClassName('text')[0].innerText;
    resourceBar.getElementsByClassName('text')[0].innerText = resource + "/" + resourceBarText.split('/')[1];
    resourceBar.getElementsByClassName('fill')[0].style.width = parseInt(resource) / parseInt(resourceBarText.split('/')[1]) * 100 + '%';

    let pollutionBar = document.getElementsByClassName('bar')[1];
    let pollutionBarText = pollutionBar.getElementsByClassName('text')[0].innerText;
    pollutionBar.getElementsByClassName('text')[0].innerText = pollution + "/" + pollutionBarText.split('/')[1];
    pollutionBar.getElementsByClassName('fill')[0].style.width = parseInt(pollution) / parseInt(pollutionBarText.split('/')[1]) * 100 + '%';
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(image => image.setAttribute('draggable', false));
});