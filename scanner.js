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

        if (scanCount % 5 === 0 && scanCount <= 25) {
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

    document.querySelectorAll('.ts-brand-header').forEach(header => {
        header.addEventListener('click', function() {
            const dayClass = header.getAttribute('data-day');
            const wrapper = document.querySelector(`.ts-brand-scroll-wrapper[data-day="${dayClass}"]`);
            const chevron = header.querySelector('.ts-chevron');
            const buttonContainer = document.querySelector(`.${dayClass}-scroll-buttons`);

            wrapper.classList.toggle('open');
            buttonContainer.classList.toggle('open');

            if (wrapper.classList.contains('open')) {
                chevron.style.transform = 'rotate(90deg)';
            } else {
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    });

    const buttonContainers = document.querySelectorAll('.tuesday-scroll-buttons, .wednesday-scroll-buttons, .thursday-scroll-buttons');

    buttonContainers.forEach(container => {
        const scrollContainer = container.previousElementSibling.querySelector('.ts-brand-scroll');
        const leftArrow = container.querySelector('.scroll-arrow.left');
        const rightArrow = container.querySelector('.scroll-arrow.right');
        const scrollStep = 200;

        leftArrow.addEventListener('click', () => {
            const maxLeft = scrollContainer.scrollLeft;
            scrollContainer.scrollBy({ left: -Math.min(scrollStep, maxLeft), behavior: 'smooth' });
            checkButtons();
        });

        rightArrow.addEventListener('click', () => {
            const totalWidth = scrollContainer.scrollWidth;
            const containerWidth = scrollContainer.clientWidth;
            const maxRight = totalWidth - (scrollContainer.scrollLeft + containerWidth);
            scrollContainer.scrollBy({ left: Math.min(scrollStep, maxRight), behavior: 'smooth' });
            checkButtons();
        });

        function checkButtons() {
            if (scrollContainer.scrollLeft === 0) {
                leftArrow.disabled = true;
            } else {
                leftArrow.disabled = false;
            }

            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
                rightArrow.disabled = true;
            } else {
                rightArrow.disabled = false;
            }
        }

        checkButtons();
    });
});

</script>
