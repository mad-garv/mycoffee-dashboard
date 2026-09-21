var wallGrid = document.getElementById("wall-grid");
var wallImageInput = document.getElementById("wall-image-input");
var addWallImagesButton = document.getElementById("add-wall-images");
var wallStatus = document.getElementById("wall-status");

function createWallImage(image) {
    var wallItem = document.createElement("article");
    wallItem.className = "wall-image";

    var photo = document.createElement("img");
    photo.src = image.image;
    photo.alt = "Coffee wall image";
    photo.loading = "lazy";

    wallItem.appendChild(photo);
    wallGrid.appendChild(wallItem);
}

async function loadWall() {
    try {
        var images = await listWallImages();

        wallGrid.innerHTML = "";

        for (var i = 0; i < images.length; i++) {
            createWallImage(images[i]);
        }
    } catch (error) {
        if (wallStatus) {
            wallStatus.textContent = "Could not load the coffee wall.";
        }

        console.error(error);
    }
}

async function updateWallControls() {
    if (!addWallImagesButton) {
        return;
    }

    var result = await supabaseClient.auth.getUser();
    var user = result.data.user;

    if (!user) {
        addWallImagesButton.style.display = "none";
    }
}

if (wallImageInput) {
    wallImageInput.addEventListener("change", async function () {
        var files = Array.from(wallImageInput.files);

        if (files.length === 0) {
            return;
        }

        try {
            addWallImagesButton.classList.add("uploading");
            addWallImagesButton.textContent = "…";
            wallStatus.textContent = "Uploading " + files.length + " photo(s)…";

            await uploadWallImages(files);

            wallImageInput.value = "";
            wallStatus.textContent = "";
            await loadWall();
        } catch (error) {
            wallStatus.textContent = "Could not upload: " + error.message;
        } finally {
            addWallImagesButton.classList.remove("uploading");
            addWallImagesButton.textContent = "+";
        }
    });
}

updateWallControls();
loadWall();