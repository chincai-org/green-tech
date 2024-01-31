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
    let resourceBar = document.getElementsByClassName('progress-bar')[0];
    let resourceBarText = resourceBar.dataset.number;
    const width = (resource / parseInt(resourceBarText.split('/')[1]) * 100) || 0;
    resourceBar.dataset.number = resource + "/" + resourceBarText.split('/')[1];
    resourceBar.style.setProperty("--width", width)

    let pollutionBar = document.getElementsByClassName('progress-bar')[1];
    let pollutionBarText = pollutionBar.dataset.number
    const width2 = (pollution / parseInt(pollutionBarText.split('/')[1]) * 100);
    pollutionBar.dataset.number = pollution + "/" + pollutionBarText.split('/')[1];
    pollutionBar.style.setProperty("--width", width2)
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(image => image.setAttribute('draggable', false));
});