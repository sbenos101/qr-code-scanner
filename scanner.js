<script src="https://cdn.jsdelivr.net/npm/html5-qrcode/minified/html5-qrcode.min.js"></script>

<script>
    
    document.addEventListener("DOMContentLoaded", function () {
        const qrReaderElement = document.getElementById("qr-reader");
        const scanCountElement = document.getElementById("scan-count");
        const modal = document.getElementById("trade-show-modal");
        const closeModalButton = document.querySelector(".ts-close");

        if (!qrReaderElement) {
            console.error("QR Reader element not found.");
            return;
        }

        let scanCount = JSON.parse(localStorage.getItem("scanCount")) || 0;
        const scannedSuppliers = JSON.parse(localStorage.getItem("scannedSuppliers")) || [];
        scanCountElement.innerText = scanCount;
        modal.style.display = "none";

        function updateTableAndStorage() {
            const table = document.getElementById("supplier-log").getElementsByTagName('tbody')[0];
            table.innerHTML = '';

            scannedSuppliers.forEach((entry) => {
                const newRow = table.insertRow();
                newRow.insertCell(0).innerText = entry.timestamp;
                newRow.insertCell(1).innerText = entry.supplier;
            });

            localStorage.setItem("scannedSuppliers", JSON.stringify(scannedSuppliers));
            localStorage.setItem("scanCount", scanCount);
        }

        function showModal() {
               modal.style.display = "flex";
        }

        function closeModal() {
            modal.style.display = "none";
        }

        function onScanSuccess(decodedText, decodedResult) {
        
            console.log("Scan successful. Current count:", scanCount);

            if (scannedSuppliers.some(entry => entry.supplier === decodedText)) {
                console.log(`Supplier '${decodedText}' has already been scanned.`);
                return;
            }

            scanCount++;
            scanCountElement.innerText = scanCount;
            scannedSuppliers.push({ timestamp: new Date().toLocaleString(), supplier: decodedText });
            updateTableAndStorage();

            if (scanCount === 5) {
                showModal();
            }
        }

        if (closeModalButton) {
            closeModalButton.addEventListener("click", closeModal);
        }

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        const qrCodeScanner = new Html5Qrcode("qr-reader");
        qrCodeScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 275 }, onScanSuccess)
            .catch(err => console.error("Error starting scanner:", err));

        updateTableAndStorage();
    });

</script>
