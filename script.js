/* =========================================================
   IFRAAH TABASSUM PORTFOLIO
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  const scrollTopBtn = document.getElementById("scrollTop");
  const currentYear = document.getElementById("currentYear");

  const qrContainer = document.getElementById("qrcode");
  const downloadQrBtn = document.getElementById("downloadQr");

  const sections = document.querySelectorAll("section[id]");


  /* =======================================================
     PORTFOLIO URL
     ======================================================= */

  const portfolioUrl = "https://it0506.github.io/";


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     EXTERNAL LINK SECURITY
     ======================================================= */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {
      link.setAttribute("rel", "noopener noreferrer");
    });


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  const toggleMenu = (forceState) => {

    if (!navbar || !menuBtn) {
      return;
    }

    const currentlyOpen =
      navbar.classList.contains("active");

    const shouldOpen =
      forceState !== undefined
        ? forceState
        : !currentlyOpen;

    navbar.classList.toggle(
      "active",
      shouldOpen
    );

    document.body.classList.toggle(
      "menu-open",
      shouldOpen
    );

    menuBtn.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    const icon =
      menuBtn.querySelector("i");

    if (icon) {

      icon.classList.toggle(
        "fa-bars",
        !shouldOpen
      );

      icon.classList.toggle(
        "fa-xmark",
        shouldOpen
      );

    }
  };


  if (menuBtn && navbar) {

    menuBtn.addEventListener(
      "click",
      () => toggleMenu()
    );

    navLinks.forEach((link) => {

      link.addEventListener(
        "click",
        () => toggleMenu(false)
      );

    });
  }


  /* =======================================================
     HEADER + SCROLL EFFECTS
     ======================================================= */

  const handleScroll = () => {

    const scrollPosition = window.scrollY;


    /* Header glass effect */

    if (header) {

      header.classList.toggle(
        "scrolled",
        scrollPosition > 40
      );

    }


    /* Scroll-to-top button */

    if (scrollTopBtn) {

      scrollTopBtn.classList.toggle(
        "visible",
        scrollPosition > 400
      );

    }


    /* Active navigation */

    let currentSection = "";

    sections.forEach((section) => {

      const sectionTop =
        section.offsetTop - 180;

      const sectionBottom =
        sectionTop + section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionBottom
      ) {

        currentSection =
          section.getAttribute("id");

      }

    });


    navLinks.forEach((link) => {

      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentSection}`
      );

    });

  };


  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  handleScroll();


  /* =======================================================
     SCROLL TO TOP
     ======================================================= */

  if (scrollTopBtn) {

    scrollTopBtn.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        navbar &&
        navbar.classList.contains("active")
      ) {

        toggleMenu(false);

      }

    }
  );


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");


  if (
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "reveal-visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -40px 0px"
        }
      );


    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "reveal-visible"
        );

      }
    );

  }


  /* =======================================================
     QR CODE
     
     IMPORTANT:
     
     This script generates ONLY ONE QR code.
     
     Required HTML:
     
       <div id="qrcode"></div>
     
     Do NOT create another QR container.
     ======================================================= */

  let qrGenerated = false;


  const generateQRCode = () => {

    if (!qrContainer) {
      return;
    }


    /* Prevent duplicate generation */

    if (qrGenerated) {
      return;
    }


    /* Remove anything already inside the container */

    qrContainer.innerHTML = "";


    /* Check QRCode library */

    if (typeof QRCode === "undefined") {

      console.error(
        "QRCode library was not loaded."
      );

      qrContainer.innerHTML = `
        <div class="qr-error">
          QR code could not be loaded.
        </div>
      `;

      return;
    }


    /* Generate exactly ONE QR code */

    try {

      new QRCode(
        qrContainer,
        {
          text: portfolioUrl,

          width: 180,
          height: 180,

          colorDark: "#07111c",
          colorLight: "#ffffff",

          correctLevel:
            QRCode.CorrectLevel.H
        }
      );


      qrGenerated = true;

    } catch (error) {

      console.error(
        "QR code generation failed:",
        error
      );

      qrContainer.innerHTML = `
        <div class="qr-error">
          Unable to generate QR code.
        </div>
      `;

    }

  };


  /* =======================================================
     WAIT FOR QR LIBRARY
     ======================================================= */

  const waitForQRCodeLibrary = (
    attempts = 0
  ) => {

    if (
      typeof QRCode !== "undefined"
    ) {

      generateQRCode();

      return;
    }


    if (attempts >= 50) {

      console.error(
        "QRCode library failed to load."
      );

      return;
    }


    setTimeout(
      () => {
        waitForQRCodeLibrary(
          attempts + 1
        );
      },
      100
    );

  };


  if (qrContainer) {
    waitForQRCodeLibrary();
  }


  /* =======================================================
     DOWNLOAD QR CODE
     ======================================================= */

  if (downloadQrBtn) {

    downloadQrBtn.addEventListener(
      "click",
      async () => {

        if (!qrContainer) {
          return;
        }


        const canvas =
          qrContainer.querySelector(
            "canvas"
          );

        const image =
          qrContainer.querySelector(
            "img"
          );


        /* Canvas QR */

        if (canvas) {

          try {

            const dataUrl =
              canvas.toDataURL(
                "image/png"
              );

            const downloadLink =
              document.createElement("a");

            downloadLink.href =
              dataUrl;

            downloadLink.download =
              "Ifraah_Tabassum_Portfolio_QR.png";

            document.body.appendChild(
              downloadLink
            );

            downloadLink.click();

            document.body.removeChild(
              downloadLink
            );

            return;

          } catch (error) {

            console.error(
              "Unable to download QR canvas:",
              error
            );

          }

        }


        /* Image QR fallback */

        if (image && image.src) {

          try {

            const response =
              await fetch(image.src);

            const blob =
              await response.blob();

            const blobUrl =
              URL.createObjectURL(blob);

            const downloadLink =
              document.createElement("a");

            downloadLink.href =
              blobUrl;

            downloadLink.download =
              "Ifraah_Tabassum_Portfolio_QR.png";

            document.body.appendChild(
              downloadLink
            );

            downloadLink.click();

            document.body.removeChild(
              downloadLink
            );

            URL.revokeObjectURL(
              blobUrl
            );

            return;

          } catch (error) {

            console.error(
              "Unable to download QR image:",
              error
            );

          }

        }


        alert(
          "QR code is still loading. Please try again."
        );

      }
    );

  }


  /* =======================================================
     PREVENT EMPTY HASH LINKS
     ======================================================= */

  document
    .querySelectorAll('a[href="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
        }
      );

    });


  /* =======================================================
     IMAGE ERROR HANDLING
     ======================================================= */

  document
    .querySelectorAll("img")
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.classList.add(
            "image-error"
          );

        }
      );

    });


  /* =======================================================
     CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
     ======================================================= */

  document.addEventListener(
    "click",
    (event) => {

      if (
        !navbar ||
        !menuBtn ||
        !navbar.classList.contains("active")
      ) {
        return;
      }


      const clickedInsideNavbar =
        navbar.contains(event.target);

      const clickedMenuButton =
        menuBtn.contains(event.target);


      if (
        !clickedInsideNavbar &&
        !clickedMenuButton
      ) {

        toggleMenu(false);

      }

    }
  );


  /* =======================================================
     KEYBOARD ACCESSIBILITY
     ======================================================= */

  if (menuBtn) {

    menuBtn.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          toggleMenu();

        }

      }
    );

  }


  /* =======================================================
     REDUCE MOTION ACCESSIBILITY
     ======================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {

    document.documentElement.classList.add(
      "reduce-motion"
    );

  }


  /* =======================================================
     PAGE READY
     ======================================================= */

  document.body.classList.add(
    "page-loaded"
  );

});
