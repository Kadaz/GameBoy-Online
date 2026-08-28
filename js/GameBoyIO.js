"use strict";

/*
PS5 GameBoy-Online wrapper.

```
The original GameBoy-Online IO code is loaded from
the official upstream project.

After it loads, this file automatically searches:

    Kadaz/GameBoy-Online/roms/

for .gb and .gbc ROMs.
```

*/

(function () {

```
var upstream =
    "https://cdn.jsdelivr.net/gh/taisel/GameBoy-Online@master/js/GameBoyIO.js";

var script =
    document.createElement("script");

script.type = "text/javascript";

script.onload = function () {

    window.loadLocalRepositoryROM =
        loadLocalRepositoryROM;

    setTimeout(
        loadLocalRepositoryROM,
        500
    );

};

script.onerror = function () {

    console.error(
        "Could not load GameBoy-Online emulator IO."
    );

    if (typeof cout === "function") {

        cout(
            "Could not load emulator IO.",
            2
        );

    }

};

script.src = upstream;

document.head.appendChild(script);


async function loadLocalRepositoryROM() {

    try {

        if (typeof start !== "function") {

            throw new Error(
                "GameBoy emulator core is not ready."
            );

        }

        if (typeof cout === "function") {

            cout(
                "Searching GameBoy-Online ROMs...",
                0
            );

        }


        var apiURL =
            "https://api.github.com/repos/" +
            "Kadaz/GameBoy-Online/git/trees/master?recursive=1";


        var response =
            await fetch(
                apiURL,
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
                "Invalid GitHub repository tree."
            );

        }


        var romFiles =
            data.tree.filter(
                function (item) {

                    return (
                        item.type === "blob" &&
                        /^roms\/.*\.(gb|gbc)$/i.test(
                            item.path
                        )
                    );

                }
            );


        if (!romFiles.length) {

            throw new Error(
                "No .gb or .gbc ROMs found in roms/."
            );

        }


        romFiles.sort(
            function (a, b) {

                return a.path.localeCompare(
                    b.path
                );

            }
        );


        var romFile =
            romFiles[0];


        var romName =
            romFile.path
                .split("/")
                .pop();


        if (typeof cout === "function") {

            cout(
                "Found ROM: " +
                romName,
                0
            );

        }


        var romURL =
            "https://cdn.jsdelivr.net/gh/" +
            "Kadaz/GameBoy-Online@master/" +
            romFile.path
                .split("/")
                .map(
                    encodeURIComponent
                )
                .join("/");


        if (typeof cout === "function") {

            cout(
                "Downloading ROM...",
                0
            );

        }


        var romResponse =
            await fetch(
                romURL,
                {
                    cache: "no-store"
                }
            );


        if (!romResponse.ok) {

            throw new Error(
                "ROM download failed: HTTP " +
                romResponse.status
            );

        }


        var romBuffer =
            await romResponse.arrayBuffer();


        if (
            !romBuffer ||
            !romBuffer.byteLength
        ) {

            throw new Error(
                "ROM file is empty."
            );

        }


        var canvas =
            document.getElementById(
                "mainCanvas"
            );


        if (!canvas) {

            throw new Error(
                "mainCanvas was not found."
            );

        }


        if (typeof cout === "function") {

            cout(
                "Starting " +
                romName +
                "...",
                0
            );

        }


        start(
            canvas,
            romBuffer
        );


        if (typeof cout === "function") {

            cout(
                "Running: " +
                romName,
                0
            );

        }

    }
    catch (error) {

        console.error(
            "Automatic ROM loader error:",
            error
        );


        if (typeof cout === "function") {

            cout(
                "ROM loading failed: " +
                error.message,
                2
            );

        }

    }

}
```

})();
