
/* =====================================
   EGYPT DEALS - SHARED PRODUCTS DATABASE
===================================== */

const ED_PRODUCTS = [

  {
    id: "hesiming-001",
    category: "electronics",

    title: "مجموعة محولات USB متعددة الاستخدامات من HESIMING، مع كابل Type-C ومحولات Lightning وMicro USB وحامل هاتف",

    images: [
      "./hesiming-1.jpg",
      "./hesiming-2.jpg",
      "./hesiming-3.jpg",
      "./hesiming-4.jpg"
    ],

    price: "55 جنيه",
oldPrice: "101.97 جنيه",
discount: "خصم 46%",
    rating: "3.8/5",
    reviews: "1,519 تقييم",

    amazonUrl: "https://link.amazon/B0crAj3sO",

    featured: true
  }

];


/* =====================================
   1. NORMALIZE ARABIC TEXT
===================================== */

function edNormalize(text) {

  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ");

}


/* =====================================
   2. ESCAPE HTML
===================================== */

function edEscape(text) {

  return String(text ?? "").replace(/[&<>"']/g, char => ({

    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"

  })[char]);

}


/* =====================================
   3. PRODUCT CARD
===================================== */

function edProductCard(product) {

  const images = Array.isArray(product.images)
    ? product.images
    : [];

  const firstImage = images[0] || "";

  const thumbnails = images.length > 1

    ? `
      <div class="product-thumbnails">

        ${images.map((image, index) => `

          <button
            class="product-thumbnail ${index === 0 ? "active" : ""}"
            type="button"
            data-product-image="${edEscape(image)}"
            aria-label="عرض الصورة ${index + 1}">

            <img
              src="${edEscape(image)}"
              alt=""
              loading="lazy">

          </button>

        `).join("")}

      </div>
    `

    : "";

  const safeAmazonUrl =
    typeof product.amazonUrl === "string" &&
    /^https:\/\/(www\.)?(amazon\.[a-z.]+|amzn\.to|link\.amazon)\//i.test(product.amazonUrl)
      ? product.amazonUrl
      : "#";

  return `

    <article class="product-card">

      <div class="product-gallery">

        <img
          class="main-product-image"
          src="${edEscape(firstImage)}"
          alt="${edEscape(product.title)}"
          loading="lazy"
          onerror="this.style.display='none';">

        ${thumbnails}

      </div>

      <div class="product-info">

        <h3 class="product-title">

          ${edEscape(product.title)}

        </h3>

        ${product.rating ? `

          <div class="product-rating">

            ★★★★☆ ${edEscape(product.rating)}

            ${product.reviews ? `

              <span style="color:#b9c1ce">

                | ${edEscape(product.reviews)}

              </span>

            ` : ""}

          </div>

        ` : ""}

        <div class="product-price">

          <span class="current-price">

            ${edEscape(product.price)}

          </span>

          ${product.oldPrice ? `

            <span class="old-price">

              ${edEscape(product.oldPrice)}

            </span>

          ` : ""}

          ${product.discount ? `

            <span class="discount-badge">

              ${edEscape(product.discount)}

            </span>

          ` : ""}

        </div>

        <a
          class="buy-btn"
          href="${edEscape(safeAmazonUrl)}"
          target="_blank"
          rel="nofollow sponsored noopener">

          شاهد المنتج على أمازون 🛒

        </a>

        <p class="product-note">

          قد تختلف الأسعار والتوافر على أمازون.
          بعض روابط الموقع روابط تسويق بالعمولة.

        </p>

      </div>

    </article>

  `;

}


/* =====================================
   4. RENDER PRODUCTS
===================================== */

function edRenderProducts() {

  const productList = document.getElementById("productList");

  if (!productList) return;

  const page = document.body.dataset.page || "home";

  const params = new URLSearchParams(window.location.search);

  const categoryId = params.get("category") || "all";

  const searchQuery = edNormalize(params.get("q") || "");

  let products = [...ED_PRODUCTS];


  /* HOME PAGE */

  if (page === "home") {

    products = products.filter(product => product.featured === true);

  }


  /* CATEGORY PAGE */

  else {

    if (categoryId !== "all") {

      products = products.filter(product =>

        product.category === categoryId

      );

    }


    /* SEARCH */

    if (searchQuery) {

      products = products.filter(product =>

        edNormalize(product.title).includes(searchQuery)

      );

    }

  }


  /* EMPTY PRODUCTS */

  if (products.length === 0) {

    productList.innerHTML = `

      <div class="empty-state">

        <div class="icon">🛍️</div>

        <h2>لا توجد منتجات حاليًا</h2>

        <p>

          لم نعثر على منتجات مطابقة.
          تابعنا لاكتشاف العروض الجديدة قريبًا.

        </p>

      </div>

    `;

    return;

  }


  /* DISPLAY PRODUCTS */

  productList.innerHTML = products.map(edProductCard).join("");

}


/* =====================================
   5. PRODUCT IMAGE GALLERY
===================================== */

document.addEventListener("click", function(event) {

  const button = event.target.closest("[data-product-image]");

  if (!button) return;

  const card = button.closest(".product-card");

  if (!card) return;

  const mainImage = card.querySelector(".main-product-image");

  if (!mainImage) return;

  mainImage.src = button.dataset.productImage;

  card.querySelectorAll(".product-thumbnail").forEach(item => {

    item.classList.remove("active");

  });

  button.classList.add("active");

});


/* =====================================
   6. INITIALIZE
===================================== */

edRenderProducts();
