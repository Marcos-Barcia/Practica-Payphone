// CONFIGURA TUS DATOS PAYPHONE AQUI:
const token = process.env.PAYPHONE_TOKEN;
const storeId = process.env.PAYPHONE_STORE_ID;

const productos = [
  { nombre: "Laptop Gamer", precio: 999.99, img: "https://via.placeholder.com/200x150?text=Laptop" },
  { nombre: "Mouse Inalámbrico", precio: 29.50, img: "https://via.placeholder.com/200x150?text=Mouse" },
  { nombre: "Teclado Mecánico", precio: 89.00, img: "https://via.placeholder.com/200x150?text=Teclado" },
  { nombre: "Audífonos Bluetooth", precio: 59.99, img: "https://via.placeholder.com/200x150?text=Audifonos" },
  { nombre: "Monitor 24\" FHD", precio: 149.99, img: "https://via.placeholder.com/200x150?text=Monitor" },
  { nombre: "Webcam HD", precio: 39.50, img: "https://via.placeholder.com/200x150?text=Webcam" }
];

let carrito = [];
let total = 0;

const grid = document.getElementById("product-grid");
const listaCarrito = document.getElementById("lista-carrito");
const totalSpan = document.getElementById("total");

function renderProductos() {
  productos.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h2>${p.nombre}</h2>
      <p class="price">$${p.precio.toFixed(2)}</p>
    `;
    card.onclick = () => agregarACarrito(p);
    grid.appendChild(card);
  });
}

function agregarACarrito(producto) {
  carrito.push(producto);
  total += producto.precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  carrito.forEach(p => {
    const item = document.createElement("li");
    item.textContent = `${p.nombre} - $${p.precio.toFixed(2)}`;
    listaCarrito.appendChild(item);
  });
  totalSpan.textContent = total.toFixed(2);
}

async function pagar() {
  if (total === 0) {
    alert("Agrega productos al carrito antes de pagar.");
    return;
  }

  const montoCentavos = Math.round(total * 100);

  const data = {
    amount: montoCentavos,
    amountWithoutTax: montoCentavos,
    amountWithTax: 0,
    tax: 0,
    reference: "Compra Master Technology Store",
    currency: "USD",
    clientTransactionId: "trx-" + Date.now(),
    storeId: storeId,
    responseUrl: "http://127.0.0.1"
  };

  try {
    const res = await fetch("https://pay.payphonetodoesposible.com/api/button/Prepare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const resultado = await res.json();

    if (resultado.payWithPayPhone) {
      window.location.href = resultado.payWithPayPhone;
    } else {
      alert("No se recibió el enlace de pago. Verifica tu token o storeId.");
      console.log("Respuesta:", resultado);
    }

  } catch (error) {
    console.error("Error al conectar con PayPhone:", error);
    alert("Ocurrió un error al conectar con PayPhone.");
  }
}

renderProductos();
