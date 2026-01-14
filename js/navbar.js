document.addEventListener('DOMContentLoaded', () => {
    const navbarHTML = `
    <nav class="bg-almost-black text-white py-4 px-6 sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-2xl font-bold hero-title">
                <a href="index.html"><img src="assets/logos/SingleXwhite.png" alt="Xatta Logo" style="width:50px; height:auto;"></a>
            </div>
            <div class="hidden md:flex space-x-8">
                <a href="index.html#home" class="nav-link hover:text-white transition duration-300">Home</a>
                <a href="index.html#school" class="nav-link hover:text-white transition duration-300">School</a>
                <a href="index.html#shop" class="nav-link hover:text-white transition duration-300">Shop</a>
                <a href="artists.html" class="nav-link hover:text-white transition duration-300">Artists</a>
            </div>
            <div class="md:hidden">
                <button id="mobile-menu-button" class="text-white focus:outline-none">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-almost-black absolute w-full left-0 px-6 pb-4 shadow-lg border-b border-gray-800">
            <div class="flex flex-col space-y-3 mt-2">
                <a href="index.html#home" class="nav-link hover:text-white transition duration-300">Home</a>
                <a href="index.html#school" class="nav-link hover:text-white transition duration-300">School</a>
                <a href="index.html#shop" class="nav-link hover:text-white transition duration-300">Shop</a>
                <a href="artists.html" class="nav-link hover:text-white transition duration-300">Artists</a>
            </div>
        </div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Mobile menu toggle logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
