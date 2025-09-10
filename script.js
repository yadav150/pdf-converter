document.getElementById("convertBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfFile");
  const file = fileInput.files[0];
  const resultDiv = document.getElementById("result");

  if (!file) {
    resultDiv.textContent = "Please upload a PDF first.";
    return;
  }

  resultDiv.innerHTML = "Processing PDF...";

  const reader = new FileReader();
  reader.onload = async function (e) {
    const pdfData = new Uint8Array(e.target.result);

    try {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      resultDiv.innerHTML = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Convert to JPEG
        const imgURL = canvas.toDataURL("image/jpeg", 1.0);

        // Show preview
        const img = document.createElement("img");
        img.src = imgURL;
        img.style.maxWidth = "100%";
        img.style.marginBottom = "10px";
        resultDiv.appendChild(img);

        // Download link
        const link = document.createElement("a");
        link.href = imgURL;
        link.download = `page_${pageNum}.jpeg`;
        link.textContent = `Download Page ${pageNum}`;
        link.className = "download-link";
        resultDiv.appendChild(link);
      }
    } catch (err) {
      resultDiv.textContent = "Error processing PDF: " + err.message;
    }
  };

  reader.readAsArrayBuffer(file);
});
