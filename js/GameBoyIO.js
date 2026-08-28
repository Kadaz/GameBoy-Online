# /*

# RETRO-MEDIA AUTOMATIC ROM LOADER

Loads the first GB/GBC ROM from:

Kadaz/Retro-Media/roms/

# No PC file picker is used.

*/

async function loadRetroMediaROM() {

```
try {

	cout(
		"Searching Retro-Media for GB/GBC ROMs...",
		0
	);


	var apiURL =
		"https://api.github.com/repos/" +
		"Kadaz/Retro-Media/git/trees/main?recursive=1";


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


	/*
	--------------------------------------------------------
	FIND GB / GBC ROMS
	--------------------------------------------------------
	*/

	var romFiles =
		data.tree.filter(
			function(item) {

				return (
					item.type === "blob" &&
					/^roms\/.*\.(gb|gbc)$/i
						.test(item.path)
				);

			}
		);


	if (!romFiles.length) {

		throw new Error(
			"No .gb or .gbc ROMs found in Retro-Media."
		);

	}


	/*
	--------------------------------------------------------
	SORT
	--------------------------------------------------------

	Prefer GBC first.
	*/

	romFiles.sort(
		function(a, b) {

			var aGBC =
				/\.gbc$/i.test(a.path);

			var bGBC =
				/\.gbc$/i.test(b.path);

			return bGBC - aGBC;

		}
	);


	var romFile =
		romFiles[0];


	var romName =
		romFile.path
			.split("/")
			.pop();


	cout(
		"Found ROM: " +
		romName,
		0
	);


	/*
	--------------------------------------------------------
	BUILD RAW GITHUB URL
	--------------------------------------------------------
	*/

	var romURL =
		"https://raw.githubusercontent.com/" +
		"Kadaz/Retro-Media/main/" +
		romFile.path
			.split("/")
			.map(
				encodeURIComponent
			)
			.join("/");


	cout(
		"Downloading ROM...",
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
			"ROM download failed: HTTP " +
			romResponse.status
		);

	}


	var romBuffer =
		await romResponse.arrayBuffer();


	if (!romBuffer.byteLength) {

		throw new Error(
			"ROM file is empty."
		);

	}


	cout(
		"ROM downloaded successfully.",
		0
	);


	/*
	--------------------------------------------------------
	START EXISTING GAMEBOY CORE
	--------------------------------------------------------
	*/

	var canvas =
		document.getElementById(
			"mainCanvas"
		);


	if (!canvas) {

		canvas =
			document.getElementById(
				"screen"
			);

	}


	if (!canvas) {

		throw new Error(
			"Game Boy canvas was not found."
		);

	}


	/*
	--------------------------------------------------------
	START()
	--------------------------------------------------------

	Use the original GameBoy-Online start()
	function instead of creating another emulator.
	*/

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
		"Retro-Media ROM loader error:",
		error
	);


	cout(
		"ROM loading failed: " +
		error.message,
		2
	);

}
```

}
