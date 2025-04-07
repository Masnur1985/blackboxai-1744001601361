// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const transaksiForm = document.getElementById('transaksiForm');
    const tabunganForm = document.getElementById('tabunganForm');
    const hasilSimulasi = document.getElementById('hasilSimulasi');
    const hasilTabungan = document.getElementById('hasilTabungan');
    const productGrid = document.getElementById('productGrid');
    const playerMoneyDisplay = document.getElementById('playerMoney');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const gameMessage = document.getElementById('gameMessage');

    // Game state
    let playerMoney = 20000;
    let cartTotal = 0;
    let cart = [];

    // Products data (items yang familiar dengan anak SD di Pinrang)
    const products = [
        { id: 1, name: 'Bakso', price: 5000, image: '🍜' },
        { id: 2, name: 'Es Cendol', price: 3000, image: '🥤' },
        { id: 3, name: 'Pisang Goreng', price: 1000, image: '🍌' },
        { id: 4, name: 'Nasi Kuning', price: 7000, image: '🍚' },
        { id: 5, name: 'Mie Goreng', price: 6000, image: '🍜' },
        { id: 6, name: 'Es Teh', price: 2000, image: '🧋' },
        { id: 7, name: 'Gorengan', price: 1000, image: '🥟' },
        { id: 8, name: 'Nasi Goreng', price: 8000, image: '🍚' }
    ];

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
        
        const saldoAwal = parseFloat(document.getElementById('saldoAwal').value);
        const jumlahBeli = parseFloat(document.getElementById('jumlahBeli').value);
        
        if (isNaN(saldoAwal) || isNaN(jumlahBeli)) {
            showResult('error', 'Mohon isi semua field dengan angka yang valid', hasilSimulasi);
            return;
        }

        if (saldoAwal < 0 || jumlahBeli < 0) {
            showResult('error', 'Nilai tidak boleh negatif', hasilSimulasi);
            return;
        }

        if (jumlahBeli > saldoAwal) {
            showResult('error', 'Maaf, uang kamu tidak cukup untuk membeli jajanan ini', hasilSimulasi);
            return;
        }

        const sisaSaldo = saldoAwal - jumlahBeli;
        
        const message = `
            <div class="space-y-2">
                <p><strong>Uang Jajan:</strong> ${formatRupiah(saldoAwal)}</p>
                <p><strong>Harga Jajanan:</strong> ${formatRupiah(jumlahBeli)}</p>
                <p class="text-lg font-bold mt-4">Sisa Uang: ${formatRupiah(sisaSaldo)}</p>
            </div>
        `;
        
        showResult('success', message, hasilSimulasi);

        if (sisaSaldo < saldoAwal * 0.2) {
            setTimeout(() => {
                showTip('Tip: Ingat untuk selalu menyisakan uang untuk ditabung ya! 💰', hasilSimulasi);
            }, 1000);
        }
    });

    // Handle savings goal calculation
    tabunganForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const targetTabungan = parseFloat(document.getElementById('targetTabungan').value);
        const tabunganHarian = parseFloat(document.getElementById('tabunganHarian').value);
        
        if (isNaN(targetTabungan) || isNaN(tabunganHarian)) {
            showResult('error', 'Mohon isi semua field dengan angka yang valid', hasilTabungan);
            return;
        }

        if (targetTabungan < 0 || tabunganHarian < 0) {
            showResult('error', 'Nilai tidak boleh negatif', hasilTabungan);
            return;
        }

        if (tabunganHarian === 0) {
            showResult('error', 'Tabungan harian harus lebih dari 0', hasilTabungan);
            return;
        }

        const hariMenabung = Math.ceil(targetTabungan / tabunganHarian);
        
        const message = `
            <div class="space-y-2">
                <p><strong>Target Tabungan:</strong> ${formatRupiah(targetTabungan)}</p>
                <p><strong>Menabung per Hari:</strong> ${formatRupiah(tabunganHarian)}</p>
                <p class="text-lg font-bold mt-4">Kamu perlu menabung selama ${hariMenabung} hari untuk mencapai target! 🎯</p>
            </div>
        `;
        
        showResult('success', message, hasilTabungan);

        if (hariMenabung > 30) {
            setTimeout(() => {
                showTip('Tip: Coba tingkatkan tabungan harianmu untuk mencapai target lebih cepat! 💪', hasilTabungan);
            }, 1000);
        }
    });

    // Initialize shopping game
    function initializeGame() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:shadow-lg transition duration-300';
            productCard.innerHTML = `
                <div class="text-4xl mb-2">${product.image}</div>
                <h4 class="font-bold">${product.name}</h4>
                <p class="text-green-600">${formatRupiah(product.price)}</p>
                <button class="mt-2 px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 text-sm buy-btn" 
                        data-id="${product.id}" data-price="${product.price}">
                    Beli
                </button>
            `;
            productGrid.appendChild(productCard);
        });

        updateGameDisplay();
    }

    // Handle buying products
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            const price = parseInt(e.target.dataset.price);
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);

            if (playerMoney >= price) {
                playerMoney -= price;
                cartTotal += price;
                cart.push(product);
                updateGameDisplay();
                showGameMessage('success', `Berhasil membeli ${product.name}! 🎉`);
            } else {
                showGameMessage('error', 'Maaf, uang kamu tidak cukup 😢');
            }
        }
    });

    // Handle checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showGameMessage('error', 'Keranjang belanjamu masih kosong!');
            return;
        }

        const message = `
            <div class="space-y-2">
                <p class="font-bold">Pembelian Berhasil! 🎉</p>
                <p>Kamu membeli:</p>
                <ul class="list-disc list-inside">
                    ${cart.map(item => `<li>${item.name} (${formatRupiah(item.price)})</li>`).join('')}
                </ul>
                <p class="font-bold mt-2">Total: ${formatRupiah(cartTotal)}</p>
                <p class="font-bold">Sisa uang: ${formatRupiah(playerMoney)}</p>
            </div>
        `;

        showGameMessage('success', message);
        cart = [];
        cartTotal = 0;
        updateGameDisplay();
    });

    // Update game display
    function updateGameDisplay() {
        playerMoneyDisplay.textContent = formatRupiah(playerMoney);
        cartTotalDisplay.textContent = formatRupiah(cartTotal);
    }

    // Show result message
    function showResult(type, message, element) {
        element.className = type === 'success' ? 'success-message fade-in' : 'error-message fade-in';
        element.innerHTML = message;
        element.classList.remove('hidden');
    }

    // Show game message
    function showGameMessage(type, message) {
        gameMessage.className = `${type === 'success' ? 'success-message' : 'error-message'} fade-in`;
        gameMessage.innerHTML = message;
        gameMessage.classList.remove('hidden');
    }

    // Show tip message
    function showTip(message, element) {
        const tipElement = document.createElement('div');
        tipElement.className = 'mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg fade-in';
        tipElement.innerHTML = message;
        element.appendChild(tipElement);
    }

    // Initialize with home section and game
    switchSection('home');
    initializeGame();

    // Add smooth scroll
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

    // Add input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
    });
});