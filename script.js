const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
const menuSection = document.querySelector("#menu");
const menuTitleSection = document.querySelector("#menu-title-section");
const searchBar = document.querySelector(".search-bar"); // Make sure this selector matches your search bar's class or ID
const menuButtonsContainer = document.querySelector(".menu-buttons");
const menuItemsContainer = document.querySelector(".menu-items");
const mobileMenuControls = document.querySelector(".mobile-menu-controls");
const dropdownContent = document.querySelector(".dropdown-content");

function isMobileView() {
  return window.innerWidth <= 768;
}

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__content .header__btn", {
  ...scrollRevealOption,
  delay: 50,
});

ScrollReveal().reveal(".explore__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".explore__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".explore__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".explore__content .explore__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

const swiper = new Swiper(".swiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
  },
});

// location cards onClick redirect to online order
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".single-card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const url = this.getAttribute("data-url");
      fbq("track", "Lead");
      window.open(url, "_blank");
    });

    const links = card.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    });
  });
});

// Generate menu buttons dynamically (for desktop)
categories.forEach((category, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = index === 0 ? "menu-button active-button" : "menu-button";
  button.id = category.foods_displayed_in_menu[0].category_names[0];
  button.textContent = category.foods_displayed_in_menu[0].category_names[0];
  menuButtonsContainer.appendChild(button);

  // Add category to mobile dropdown
  const dropdownItem = document.createElement("a");
  dropdownItem.href = "#";
  dropdownItem.textContent =
    category.foods_displayed_in_menu[0].category_names[0];
  dropdownContent.appendChild(dropdownItem);
});

// Generate menu items dynamically
categories.forEach((category) => {
  category.foods_displayed_in_menu.forEach((food) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.dataset.category = food.category_names[0];

    const details = document.createElement("div");
    details.className = "item-details";

    const name = document.createElement("h3");
    name.className = "item-name";
    name.textContent = food.title;

    const price = document.createElement("h4");
    price.className = "item-price";
    price.textContent = `$${food.price}`;

    const desc = document.createElement("p");
    desc.className = "item-desc";
    const span = document.createElement("span");
    span.textContent = food.category_names[0];
    desc.appendChild(span);
    if (food.description) {
      desc.innerHTML += ` - ${food.description}`;
    }

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(desc);
    item.appendChild(details);
    menuItemsContainer.appendChild(item);
  });
});

const buttons = document.querySelectorAll(".menu-button");
const items = document.querySelectorAll(".menu-item");
const dropdownItems = document.querySelectorAll(".dropdown-content a");
const dropdownBtn = document.querySelector(".dropbtn");

dropdownBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  const dropdownContent = document.querySelector(".dropdown-content");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".dropdown-content a").forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault();

    const selectedCategory = this.textContent;
    const categoryId = `category-${selectedCategory
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    clearSearch();
    document.querySelector(".dropdown-content").style.display = "none";
    document.querySelector(".dropbtn").textContent = selectedCategory;

    setTimeout(() => {
      const categoryElement = document.getElementById(categoryId);
      if (categoryElement) {
        const mobileMenuControlsHeight = document.querySelector(
          ".mobile-menu-controls"
        ).offsetHeight;
        const navBarHeight = 85;
        const scrollToPosition =
          categoryElement.offsetTop -
          mobileMenuControlsHeight -
          navBarHeight -
          20;

        window.scrollTo({
          top: scrollToPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  });
});

let selectedButton = buttons[0].id;
let menuItemsRendered = false;

function showItems() {
  if (menuItemsRendered && isMobileView()) return;

  let currentCategory = null;
  menuItemsContainer.innerHTML = "";

  items.forEach((item) => {
    const cat = item.dataset.category;
    const itemClone = item.cloneNode(true);

    if (isMobileView()) {
      itemClone.style.display = "grid";
    } else {
      itemClone.style.display = cat === selectedButton ? "grid" : "none";
    }

    if (isMobileView() && cat !== currentCategory) {
      const categoryHeader = document.createElement("h2");
      categoryHeader.className = "category-header";
      categoryHeader.textContent = cat;
      categoryHeader.id = `category-${cat.replace(/\s+/g, "-").toLowerCase()}`;
      menuItemsContainer.appendChild(categoryHeader);
      currentCategory = cat;
    }

    menuItemsContainer.appendChild(itemClone);
  });

  menuItemsRendered = true;
  setupCategoryObserver();
}

function updateDesktopView() {
  if (isMobileView()) return;

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    const cat = item.dataset.category;
    item.style.display = cat === selectedButton ? "grid" : "none";
  });
}

function setupCategoryObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryName = entry.target.textContent;
          updateSelectedCategory(categoryName);
        }
      });
    },
    {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    }
  );

  const categoryHeaders = document.querySelectorAll(".category-header");
  categoryHeaders.forEach((header) => observer.observe(header));
}

function clearButtons() {
  buttons.forEach((btn) => btn.classList.remove("active-button"));
}

function updateSelectedCategory(category) {
  dropdownBtn.textContent = category;
  clearButtons();
  const button = document.getElementById(category);
  if (button) {
    button.classList.add("active-button");
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let lastScrollTop = 0;
const scrollThreshold = 50;
const navBarHeight = 85;
let isFixed = false;
const menuEndOffset = 150;

function isMenuSectionInView() {
  const rect = menuSection.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight && rect.bottom >= 0;
}

function updateMenuVisibility() {
  const isMenuVisible = isMenuSectionInView();

  if (isMobileView()) {
    menuButtonsContainer.style.display = "none";
    mobileMenuControls.style.display = isMenuVisible ? "flex" : "none";
    searchBar.style.display = isMenuVisible ? "flex" : "none";
  } else {
    menuButtonsContainer.style.display = isMenuVisible ? "flex" : "none";
    mobileMenuControls.style.display = "none";
    searchBar.style.display = isMenuVisible ? "flex" : "none";
    if (isMenuVisible) {
      updateDesktopView();
    }
  }
}

window.addEventListener(
  "scroll",
  debounce(() => {
    const scrollTop = window.scrollY;

    if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
      updateMenuVisibility();

      if (!isMobileView()) {
        const menuTop = menuSection.offsetTop;
        const menuBottom = menuSection.offsetTop + menuSection.offsetHeight;

        if (
          scrollTop > menuButtons.offsetTop - navBarHeight &&
          scrollTop < menuBottom - navBarHeight - menuEndOffset
        ) {
          if (!isFixed) {
            menuButtons.classList.add("fixed-nav");
            isFixed = true;
          }
        } else {
          if (isFixed) {
            menuButtons.classList.remove("fixed-nav");
            isFixed = false;
          }
        }

        if (scrollTop < menuTop - navBarHeight) {
          menuButtons.classList.remove("fixed-nav");
          isFixed = false;
        }
      }

      lastScrollTop = scrollTop;
    }
  }, 50)
);

window.addEventListener("load", () => {
  showItems();
  updateMenuVisibility();
});

window.addEventListener("resize", () => {
  updateMenuVisibility();
  showItems();
});

const searchInput = document.getElementById("menu-search");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const menuItems = document.querySelectorAll(".menu-item");
  const categoryHeaders = document.querySelectorAll(".category-header");
  let visibleItemsInCategory = {};

  menuItems.forEach((item) => {
    const itemName = item.querySelector(".item-name").textContent.toLowerCase();
    const itemDesc = item.querySelector(".item-desc").textContent.toLowerCase();
    const itemCategory = item.querySelector("p span").textContent;
    const matches =
      itemName.includes(searchTerm) || itemDesc.includes(searchTerm);

    if (isMobileView()) {
      item.style.display = matches ? "grid" : "none";
      if (matches) {
        visibleItemsInCategory[itemCategory] =
          (visibleItemsInCategory[itemCategory] || 0) + 1;
      }
    } else {
      if (itemCategory === selectedButton) {
        item.style.display = matches ? "grid" : "none";
      }
    }
  });

  if (isMobileView()) {
    categoryHeaders.forEach((header) => {
      const category = header.textContent;
      header.style.display = visibleItemsInCategory[category]
        ? "block"
        : "none";
    });
  }

  updateSelectedCategory(searchTerm ? "Search Results" : selectedButton);
});

function clearSearch() {
  const searchInput = document.getElementById("menu-search");
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input"));
}

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    clearButtons();
    selectedButton = btn.id;
    btn.classList.add("active-button");
    updateDesktopView();
    scrollToMenuSection();
    updateSelectedCategory(selectedButton);
  });
});

function scrollToMenuSection() {
  window.scrollTo({
    top: menuTitleSection.offsetTop - navBarHeight,
    behavior: "smooth",
  });
}

function updateDropdownScrollIndicator() {
  const dropdownContent = document.querySelector(".dropdown-content");

  if (dropdownContent.scrollHeight > dropdownContent.clientHeight) {
    if (!dropdownContent.querySelector(".scroll-indicator")) {
      dropdownContent.appendChild(scrollIndicator);
    }
  } else {
    const existingIndicator =
      dropdownContent.querySelector(".scroll-indicator");
    if (existingIndicator) {
      existingIndicator.remove();
    }
  }
}

updateMenuVisibility();
updateDropdownScrollIndicator();
window.addEventListener("resize", updateDropdownScrollIndicator);
