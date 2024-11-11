const zoomButton = document.getElementById("zoom");
const input = document.getElementById("inputFile");
const openFile = document.getElementById("openPDF");
const currentPage = document.getElementById("current_page");
const viewer = document.querySelector(".pdf-viewer");
let currentPDF = {};

function resetCurrentPDF() {
  currentPDF = {
    file: null,
    countOfPages: 0,
    currentPage: 0,
    zoom: 1.5,
  };
}

openFile.addEventListener("click", () => {
  input.click();
});

input.addEventListener("change", (e) => {
  const inputFile = e.target.files[0];
  if (inputFile.type === "application/pdf") {
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);
    reader.onload = () => {
      loadPDF(reader.result);
      zoomButton.disabled = false;
    };
  } else {
    alert("Please select a PDF file");
  }
});

function loadPDF(data) {
  resetCurrentPDF();
  const pdfFile = pdfjsLib.getDocument(data);
  pdfFile.promise.then((doc) => {
    currentPDF.file = doc;
    currentPDF.countOfPages = doc.numPages;
    viewer.classList.remove("hidden");
    document.querySelector("main h3").classList.add("hidden");
    renderCurrentPage();
  });
}

function renderCurrentPage() {
  currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
    const context = viewer.getContext("2d");
    const viewport = page.getViewport({ scale: currentPDF.zoom });

    viewer.height = viewport.height;
    viewer.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext);
  });

  currentPage.innerHTML = `${currentPDF.currentPage + 1} of ${
    currentPDF.countOfPages
  }`;
}
