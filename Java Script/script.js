document.addEventListener("DOMContentLoaded", function () {
  // Elements Selection
  const chooseImageBtn = document.querySelector(".choose_image button");
  const chooseInput = document.querySelector(".choose_image input");
  const imgsrc = document.querySelector(".view_image img");
  const filterButtons = document.querySelectorAll(".icons_room button");
  const slider = document.querySelector(".slider input");
  const filterName = document.querySelector(".filter_info .name");
  const sliderValue = document.querySelector(".filter_info .Value");
  const rotateButtons = document.querySelectorAll(".icons_room1 button");
  const resetButton = document.querySelector(".reset");
  const saveButton = document.querySelector(".save");

  // Initial Filter and Transform Values
  let brightness = 100,
    contrast = 100,
    saturate = 100,
    invert = 0,
    blur = 0;
  let rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

  // Open file dialog on button click
  chooseImageBtn.addEventListener("click", () => chooseInput.click());

  // Load selected image
  chooseInput.addEventListener("change", () => {
    const file = chooseInput.files[0];
    if (!file) return;
    imgsrc.src = URL.createObjectURL(file);
    imgsrc.addEventListener("load", () => {
      document.querySelector(".container").classList.remove("disabled");
      resetFilters(); // Reset filters on image load
    });
  });

  // Update filter based on selected filter button
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      button.classList.add("active");
      filterName.innerText = button.id;

      // Update slider values based on the selected filter
      switch (button.id) {
        case "brightness":
          slider.max = "200";
          slider.value = brightness;
          sliderValue.innerText = `${brightness}%`;
          break;
        case "contrast":
          slider.max = "200";
          slider.value = contrast;
          sliderValue.innerText = `${contrast}%`;
          break;
        case "saturate":
          slider.max = "200";
          slider.value = saturate;
          sliderValue.innerText = `${saturate}%`;
          break;
        case "invert":
          slider.max = "100";
          slider.value = invert;
          sliderValue.innerText = `${invert}%`;
          break;
        case "blur":
          slider.max = "10";
          slider.value = blur;
          sliderValue.innerText = `${blur}px`;
          break;
      }
    });
  });

  // Update filter value when slider changes
  slider.addEventListener("input", () => {
    sliderValue.innerText =
      slider.value + (filterName.innerText === "blur" ? "px" : "%");
    const activeFilter = document.querySelector(".icons_room .active").id;

    switch (activeFilter) {
      case "brightness":
        brightness = slider.value;
        break;
      case "contrast":
        contrast = slider.value;
        break;
      case "saturate":
        saturate = slider.value;
        break;
      case "invert":
        invert = slider.value;
        break;
      case "blur":
        blur = slider.value;
        break;
    }
    applyFilters();
  });

  // Apply rotation and flipping
  rotateButtons[0].addEventListener("click", () => (rotate -= 90)); // Rotate Left
  rotateButtons[1].addEventListener("click", () => (rotate += 90)); // Rotate Right
  rotateButtons[2].addEventListener("click", () => (flipHorizontal *= -1)); // Flip Horizontal
  rotateButtons[3].addEventListener("click", () => (flipVertical *= -1)); // Flip Vertical

  rotateButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilters());
  });

  // Reset filters to default
  resetButton.addEventListener("click", () => {
    resetFilters();
    applyFilters();
  });

  // Save the edited image
  saveButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgsrc.naturalWidth;
    canvas.height = imgsrc.naturalHeight;

    // Apply transformations and filters to canvas
    ctx.filter = `
            brightness(${brightness}%)
            contrast(${contrast}%)
            saturate(${saturate}%)
            invert(${invert}%)
            blur(${blur}px)
        `;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.drawImage(
      imgsrc,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    // Create a download link for the edited image
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // Apply all filters and transformations to the image
  function applyFilters() {
    imgsrc.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    imgsrc.style.filter = `
            brightness(${brightness}%)
            contrast(${contrast}%)
            saturate(${saturate}%)
            invert(${invert}%)
            blur(${blur}px)
        `;
  }

  // Reset filter values to default
  function resetFilters() {
    brightness = 100;
    contrast = 100;
    saturate = 100;
    invert = 0;
    blur = 0;
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    document.querySelector(".active").classList.remove("active");
    document.getElementById("brightness").classList.add("active");
    filterName.innerText = "brightness";
    slider.max = "200";
    slider.value = brightness;
    sliderValue.innerText = `${brightness}%`;
    applyFilters();
  }
});
