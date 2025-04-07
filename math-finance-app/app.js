// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const transaksiForm = document.getElementById('transaksiForm');
    const hasilSimulasi = document.getElementById('hasilSimulasi');

    // Navigation functionality
    function switchSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            switchSection(sectionId);
        });
    });

    // Format currency function
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(angka);
    }

    // Handle transaction simulation
    transaksiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get input values
        const saldoAwal = parseFloat(document.getElementById('saldoAwal').value);
        const jumlahBeli = parseFloat(document.getElementById('jumlahBeli').value);
        
        // Validate inputs
        if (isNaN(saldoAwal) || isNaN(jumlahBeli)) {
            showResult('error', 'Mohon isi semua field dengan angka yang valid');
            return;
        }

        if (saldoAwal < 0 || jumlahBeli < 0) {
            showResult('error', 'Nilai tidak boleh negatif');
            return;
        }

        // Calculate remaining balance
        if (jumlahBeli > saldoAwal) {
            showResult('error', 'Maaf, saldo kamu tidak cukup untuk melakukan pembelian ini');
            return;
        }

        const sisaSaldo = saldoAwal - jumlahBeli;
        
        // Show success message with calculation
        const message = `
            <div class="space-y-2">
                <p><strong>Saldo Awal:</strong> ${formatRupiah(saldoAwal)}</p>
                <p><strong>Jumlah Pembelian:</strong> ${formatRupiah(jumlahBeli)}</p>
                <p class="text-lg font-bold mt-4">Sisa Saldo: ${formatRupiah(sisaSaldo)}</p>
            </div>
        `;
        
        showResult('success', message);

        // Optional: Add a learning moment
        if (sisaSaldo < saldoAwal * 0.2) { // If less than 20% remaining
            setTimeout(() => {
                showTip('Tip: Ingat untuk selalu menyisakan uang untuk kebutuhan mendadak ya! 💡');
            }, 1000);
        }
    });

    // Show result message
    function showResult(type, message) {
        hasilSimulasi.className = type === 'success' ? 'success-message fade-in' : 'error-message fade-in';
        hasilSimulasi.innerHTML = message;
        hasilSimulasi.classList.remove('hidden');
    }

    // Show tip message
    function showTip(message) {
        const tipElement = document.createElement('div');
        tipElement.className = 'mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg fade-in';
        tipElement.innerHTML = message;
        hasilSimulasi.appendChild(tipElement);
    }

    // Initialize with home section
    switchSection('home');

    // Add smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add input validation for number fields
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
    });
});