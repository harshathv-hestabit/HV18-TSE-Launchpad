function productPage() { window.location.href = "products.html"; }

async function getProducts() {
    const url = 'https://dummyjson.com/products';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

let allProducts = [];
let sortAsc = true;

async function listProducts() {
    if (!window.location.pathname.includes("products.html")) return;
    if (allProducts.length === 0) {
        const results = await getProducts();
        allProducts = results.products;
    }
    renderProducts(allProducts);
}

function renderProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    products.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-card";
        item.innerHTML = `
            <h3>${product.title}</h3>
            <img src="${product.thumbnail}" alt="${product.title}" />
            <p><b>Price:</b> $${product.price}</p>
        `;
        container.appendChild(item);
    });
}

document.getElementById("searchInput")?.addEventListener("input", function () {
    const q = this.value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(q)
    );

    renderProducts(filtered);
});

document.getElementById("sortBtn")?.addEventListener("click", function () {
    sortAsc = !sortAsc;
    const sorted = [...allProducts].sort((a, b) =>
        sortAsc ? a.price - b.price : b.price - a.price
    );
    renderProducts(sorted);
});

listProducts();
