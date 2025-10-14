document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("mainContent");
  const sidebarNav = document.getElementById("sidebarNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const sidebar = document.querySelector(".sidebar");

  const loadContent = async (pageUrl) => {
    // Tampilkan spinner saat loading
    mainContent.innerHTML =
      '<div class="spinner-wrapper" style="text-align: center; padding: 4rem;"><div class="spinner" style="border: 4px solid rgba(0,0,0,0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: var(--primary-color); animation: spin 1s ease infinite;"></div></div>';
    try {
      const response = await fetch(pageUrl);
      if (!response.ok)
        throw new Error(`Halaman ${pageUrl} tidak ditemukan (404)`);
      const content = await response.text();
      mainContent.innerHTML = content;
      window.scrollTo(0, 0); // Scroll ke atas setiap ganti halaman
    } catch (error) {
      mainContent.innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
    }
  };

  const setActiveLink = (hash) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.hash === hash);
    });
  };

  const handleRouteChange = () => {
    let hash = window.location.hash || "#auth"; // Default ke #auth
    const activeLink = document.querySelector(`.nav-link[href="${hash}"]`);

    if (activeLink) {
      setActiveLink(hash);
      loadContent(activeLink.dataset.page);
    } else {
      // Jika hash tidak valid, fallback ke link pertama
      const defaultLink = navLinks[0];
      window.location.hash = defaultLink.hash; // Update URL hash
      setActiveLink(defaultLink.hash);
      loadContent(defaultLink.dataset.page);
    }
  };

  // Event listener untuk tombol menu mobile
  menuToggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
  });

  // Event listener untuk navigasi sidebar
  sidebarNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      // Tutup sidebar setelah link di-klik pada tampilan mobile
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("sidebar-open");
      }
    }
  });

  // Handle navigasi saat hash URL berubah
  window.addEventListener("hashchange", handleRouteChange);

  // Muat konten awal berdasarkan hash URL saat halaman pertama kali dibuka
  handleRouteChange();
});

// Style untuk spinner (bisa juga ditaruh di CSS)
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`;
document.head.appendChild(style);
