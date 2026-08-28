"use strict";

(function () {

    var REPOSITORY =
        "Kadaz/GameBoy-Online";

    var BRANCH =
        "master";

    var ROM_FOLDER =
        "roms/";

    async function loadPS5ROM() {

        try {

            if (typeof cout === "function") {
                cout("PS5: Searching for ROMs...", 0);
            }

            var api =
                "https://api.github.com/repos/" +
                REPOSITORY +
                "/git/trees/" +
                BRANCH +
                "?recursive=1";

            var response =
                await fetch(
                    api,
                    {
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "GitHub API HTTP " +
                    response.status
                );
            }

            var data =
                await response.json();

            if (!data.tree) {
                throw new Error(
                    "Could not read repository."
                );
            }

            var roms =
                data.tree.filter(
                    function (item) {

                        return (
                            item.type === "blob" &&
                            item.path.indexOf(ROM_FOLDER) === 0 &&
                            /\.(gb|gbc)$/i.test(item.path)
                        );

                    }
                );

            if (roms.length === 0) {
                throw new Error(
                    "No GB/GBC ROMs found in roms/."
                );
            }

            roms.sort(
                function (a, b) {
                    return a.path.localeCompare(b.path);
                }
            );

            var rom =
                roms[0];

            var romName =
                rom.path.substring(
                    rom.path.lastIndexOf("/") + 1
                );

            if (typeof cout === "function") {
                cout(
                    "Found ROM: " + romName,
                    0
                );
            }

            var romURL =
                "https://raw.githubusercontent.com/" +
                REPOSITORY +
                "/" +
                BRANCH +
                "/" +
                rom.path
                    .split("/")
                    .map(
                        function (part) {
                            return encodeURIComponent(part);
                        }
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
                    "ROM HTTP " +
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
                    "ROM is empty."
                );
            }

            var canvas =
                document.getElementById(
                    "mainCanvas"
                );

            if (!canvas) {
                throw new Error(
                    "mainCanvas not found."
                );
            }

            if (typeof start !== "function") {
                throw new Error(
                    "GameBoy emulator is not ready."
                );
            }

            if (typeof cout === "function") {
                cout(
                    "Starting " + romName + "...",
                    0
                );
            }

            start(
                canvas,
                romBuffer
            );

            if (typeof cout === "function") {
                cout(
                    "Running: " + romName,
                    0
                );
            }

        }
        catch (error) {

            console.error(
                "PS5 ROM loader:",
                error
            );

            if (typeof cout === "function") {
                cout(
                    "PS5 ROM loader error: " +
                    error.message,
                    2
                );
            }

        }

    }

    window.addEventListener(
        "load",
        function () {

            setTimeout(
                function () {
                    loadPS5ROM();
                },
                1500
            );

        }
    );

})();