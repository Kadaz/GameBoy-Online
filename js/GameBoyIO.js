"use strict";

var gameboy = null;
var gbRunInterval = null;

var settings = [
true,
true,
false,
1,
true,
false,
8,
10,
20,
false,
false,
false,
false,
true,
[true, true, true, true]
];

function start(canvas, ROM) {
clearLastEmulation();
autoSave();

```
gameboy = new GameBoyCore(canvas, ROM);

gameboy.openMBC = openSRAM;
gameboy.openRTC = openRTC;

gameboy.start();

run();
```

}

function run() {
if (GameBoyEmulatorInitialized()) {
if (!GameBoyEmulatorPlaying()) {

```
        gameboy.stopEmulator &= 1;

        cout("Starting the iterator.", 0);

        var dateObj = new Date();

        gameboy.firstIteration = dateObj.getTime();
        gameboy.iterations = 0;

        gbRunInterval = setInterval(function () {

            if (
                !document.hidden &&
                !document.msHidden &&
                !document.mozHidden &&
                !document.webkitHidden
            ) {
                gameboy.run();
            }

        }, settings[6]);

    }
}
```

}

function pause() {
if (GameBoyEmulatorInitialized()) {

```
    if (GameBoyEmulatorPlaying()) {
        autoSave();
        clearLastEmulation();
    }

}
```

}

function clearLastEmulation() {

```
if (
    GameBoyEmulatorInitialized() &&
    GameBoyEmulatorPlaying()
) {

    clearInterval(gbRunInterval);

    gameboy.stopEmulator |= 2;

    cout(
        "The previous emulation has been cleared.",
        0
    );

}
```

}

function save() {

```
if (GameBoyEmulatorInitialized()) {

    var state_suffix = 0;

    while (
        findValue(
            "FREEZE_" +
            gameboy.name +
            "_" +
            state_suffix
        ) != null
    ) {
        state_suffix++;
    }

    saveState(
        "FREEZE_" +
        gameboy.name +
        "_" +
        state_suffix
    );

}
```

}

function saveSRAM() {

```
if (GameBoyEmulatorInitialized()) {

    if (gameboy.cBATT) {

        try {

            var sram =
                gameboy.saveSRAMState();

            if (sram.length > 0) {

                if (
                    findValue(
                        "SRAM_" +
                        gameboy.name
                    ) != null
                ) {

                    deleteValue(
                        "SRAM_" +
                        gameboy.name
                    );

                }

                setValue(
                    "B64_SRAM_" +
                    gameboy.name,
                    arrayToBase64(sram)
                );

            }

        }
        catch (error) {

            cout(
                "Could not save SRAM: " +
                error.message,
                2
            );

        }

    }

    saveRTC();

}
```

}

function saveRTC() {

```
if (
    GameBoyEmulatorInitialized() &&
    gameboy.cTIMER
) {

    try {

        setValue(
            "RTC_" + gameboy.name,
            gameboy.saveRTCState()
        );

    }
    catch (error) {

        cout(
            "Could not save RTC: " +
            error.message,
            2
        );

    }

}
```

}

function autoSave() {

```
if (GameBoyEmulatorInitialized()) {

    saveSRAM();
    saveRTC();

}
```

}

function openSRAM(filename) {

```
try {

    if (
        findValue(
            "B64_SRAM_" +
            filename
        ) != null
    ) {

        return base64ToArray(
            findValue(
                "B64_SRAM_" +
                filename
            )
        );

    }

    if (
        findValue(
            "SRAM_" +
            filename
        ) != null
    ) {

        return findValue(
            "SRAM_" +
            filename
        );

    }

}
catch (error) {}

return [];
```

}

function openRTC(filename) {

```
try {

    if (
        findValue(
            "RTC_" +
            filename
        ) != null
    ) {

        return findValue(
            "RTC_" +
            filename
        );

    }

}
catch (error) {}

return [];
```

}

function saveState(filename) {

```
if (GameBoyEmulatorInitialized()) {

    try {

        setValue(
            filename,
            gameboy.saveState()
        );

    }
    catch (error) {

        cout(
            "Could not save state: " +
            error.message,
            2
        );

    }

}
```

}

function openState(filename, canvas) {

```
try {

    if (findValue(filename) != null) {

        clearLastEmulation();

        gameboy =
            new GameBoyCore(
                canvas,
                ""
            );

        gameboy.savedStateFileName =
            filename;

        gameboy.returnFromState(
            findValue(filename)
        );

        run();

    }

}
catch (error) {

    alert(error.message);

}
```

}

function matchKey(key) {

```
var keymap = [
    "right",
    "left",
    "up",
    "down",
    "a",
    "b",
    "select",
    "start"
];

for (
    var index = 0;
    index < keymap.length;
    index++
) {

    if (keymap[index] == key) {
        return index;
    }

}

return -1;
```

}

function GameBoyEmulatorInitialized() {

```
return (
    typeof gameboy == "object" &&
    gameboy != null
);
```

}

function GameBoyEmulatorPlaying() {

```
return (
    (gameboy.stopEmulator & 2) == 0
);
```

}

function GameBoyKeyDown(key) {

```
if (
    GameBoyEmulatorInitialized() &&
    GameBoyEmulatorPlaying()
) {

    GameBoyJoyPadEvent(
        matchKey(key),
        true
    );

}
```

}

function GameBoyJoyPadEvent(
keycode,
down
) {

```
if (
    GameBoyEmulatorInitialized() &&
    GameBoyEmulatorPlaying()
) {

    if (
        keycode >= 0 &&
        keycode < 8
    ) {

        gameboy.JoyPadEvent(
            keycode,
            down
        );

    }

}
```

}

function GameBoyKeyUp(key) {

```
if (
    GameBoyEmulatorInitialized() &&
    GameBoyEmulatorPlaying()
) {

    GameBoyJoyPadEvent(
        matchKey(key),
        false
    );

}
```

}

function GameBoyGyroSignalHandler(e) {

```
if (
    GameBoyEmulatorInitialized() &&
    GameBoyEmulatorPlaying()
) {

    if (e.gamma || e.beta) {

        gameboy.GyroEvent(
            e.gamma * Math.PI / 180,
            e.beta * Math.PI / 180
        );

    }
    else {

        gameboy.GyroEvent(
            e.x,
            e.y
        );

    }

    try {
        e.preventDefault();
    }
    catch (error) {}

}
```

}

function initNewCanvas() {

```
if (GameBoyEmulatorInitialized()) {

    gameboy.canvas.width =
        gameboy.canvas.clientWidth;

    gameboy.canvas.height =
        gameboy.canvas.clientHeight;

}
```

}

function initNewCanvasSize() {

```
if (GameBoyEmulatorInitialized()) {

    if (!settings[12]) {

        if (
            gameboy.onscreenWidth != 160 ||
            gameboy.onscreenHeight != 144
        ) {

            gameboy.initLCD();

        }

    }
    else {

        if (
            gameboy.onscreenWidth !=
                gameboy.canvas.clientWidth ||
            gameboy.onscreenHeight !=
                gameboy.canvas.clientHeight
        ) {

            gameboy.initLCD();

        }

    }

}
```

}

# /*

# AUTOMATIC ROM LOADER

Reads ROMs from this repository:

GameBoy-Online/roms/

Supported:
.gb
.gbc

No PC file picker.
No Retro-Media dependency.
==========================

*/

async function loadLocalRepositoryROM() {

```
try {

    cout(
        "Searching GameBoy-Online/roms/...",
        0
    );

    var repositoryAPI =
        "https://api.github.com/repos/" +
        "Kadaz/GameBoy-Online/git/trees/master?recursive=1";


    var response =
        await fetch(
            repositoryAPI,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "GitHub API error: HTTP " +
            response.status
        );

    }


    var data =
        await response.json();


    if (
        !data.tree ||
        !Array.isArray(data.tree)
    ) {

        throw new Error(
            "Could not read repository files."
        );

    }


    var roms =
        data.tree.filter(
            function(file) {

                return (
                    file.type === "blob" &&
                    /^roms\/.*\.(gb|gbc)$/i
                        .test(file.path)
                );

            }
        );


    if (!roms.length) {

        throw new Error(
            "No .gb or .gbc ROMs found in roms/."
        );

    }


    /*
    --------------------------------------------------------
    SORT ROMS ALPHABETICALLY
    --------------------------------------------------------
    */

    roms.sort(
        function(a, b) {

            return a.path.localeCompare(
                b.path
            );

        }
    );


    var selectedROM =
        roms[0];


    var romName =
        selectedROM.path
            .split("/")
            .pop();


    cout(
        "Found ROM: " +
        romName,
        0
    );


    /*
    --------------------------------------------------------
    DOWNLOAD FROM THIS SAME REPOSITORY
    --------------------------------------------------------
    */

    var romURL =
        "https://raw.githubusercontent.com/" +
        "Kadaz/GameBoy-Online/master/" +
        selectedROM.path;


    cout(
        "Downloading " +
        romName +
        "...",
        0
    );


    var romResponse =
        await fetch(
            romURL,
            {
                cache: "no-store"
            }
        );


    if (!romResponse.ok) {

        throw new Error(
            "Could not download ROM: HTTP " +
            romResponse.status
        );

    }


    var romBuffer =
        await romResponse.arrayBuffer();


    if (
        !romBuffer ||
        romBuffer.byteLength === 0
    ) {

        throw new Error(
            "Downloaded ROM is empty."
        );

    }


    /*
    --------------------------------------------------------
    START ORIGINAL EMULATOR
    --------------------------------------------------------
    */

    var canvas =
        document.getElementById(
            "mainCanvas"
        );


    if (!canvas) {

        throw new Error(
            "mainCanvas was not found."
        );

    }


    cout(
        "Starting " +
        romName +
        "...",
        0
    );


    start(
        canvas,
        romBuffer
    );


    cout(
        "Running: " +
        romName,
        0
    );

}
catch (error) {

    console.error(
        "Automatic ROM loader error:",
        error
    );


    cout(
        "ROM loader error: " +
        error.message,
        2
    );

}
```

}

# /*

# AUTOMATIC START

*/

window.addEventListener(
"load",
function() {

```
    setTimeout(
        function() {

            loadLocalRepositoryROM();

        },
        1500
    );

},
false
```

);
