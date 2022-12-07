const Items = document.getElementById('Items');
const ProductosCarrito = document.getElementById('ProductosCarrito');
const Footer = document.getElementById('Footer');
const TemplateCard = document.getElementById('Template-Card').content;
const TemplateCarrito = document.getElementById('Template-Carrito').content;
const TemplateFooter = document.getElementById('Template-Footer').content;
const Fragment = document.createDocumentFragment();

let Carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    ObtenerDatos();

    if (localStorage.getItem('Carrito')) {
        Carrito = JSON.parse(localStorage.getItem('Carrito'));

        PintarCarrito();
    }
});

Items.addEventListener('click', e => {
    AddCarrito(e);
});

ProductosCarrito.addEventListener('click', e => {
    console.log(e);
    btnAcciones(e);
});

const btnAcciones = e => {
    if (e.target.classList.contains('btn-info')) {
        const Producto = Carrito[e.target.dataset.id];
        Producto.Cantidad++;

        Carrito[e.target.dataset.id] = {...Producto };

        PintarCarrito();
        //console.log(Producto);
    }

    if (e.target.classList.contains('btn-danger')) {
        const Producto = Carrito[e.target.dataset.id];
        Producto.Cantidad--;

        if (Producto.Cantidad === 0) {
            delete Carrito[e.target.dataset.id];
        } else {
            Carrito[e.target.dataset.id] = {...Producto };
        }

        PintarCarrito();
        //console.log(Producto);
    }

    localStorage.setItem('Carrito', JSON.stringify(Carrito));

    e.stopPropagation();
};

const AddCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        SetCarrito(e.target.parentElement);
    }

    e.stopPropagation();
};

const SetCarrito = Objeto => {
    //console.log(Objeto);
    const Producto = {
        Title: Objeto.querySelector('h5').textContent,
        Precio: Objeto.querySelector('p').textContent,
        ID: Objeto.querySelector('button').dataset.id,
        Cantidad: 1
    };

    console.log(Producto);

    if (Carrito.hasOwnProperty(Producto.ID)) {
        Producto.Cantidad = Carrito[Producto.ID].Cantidad + 1;
    }

    Carrito[Producto.ID] = {...Producto };

    localStorage.setItem('Carrito', JSON.stringify(Carrito));

    PintarCarrito(); // Funcion para pintar los productos en el carrito
};

const PintarCarrito = () => {
    ProductosCarrito.innerHTML = '';

    console.log('Entra!');

    Object.values(Carrito).forEach(Producto => {
        TemplateCarrito.querySelector('th').textContent = Producto.ID;
        TemplateCarrito.querySelectorAll('td')[0].textContent = Producto.Title;
        TemplateCarrito.querySelectorAll('td')[1].textContent = Producto.Cantidad;
        TemplateCarrito.querySelectorAll('td')[2].textContent = Producto.Precio;
        TemplateCarrito.querySelector('span').textContent = Producto.Precio * Producto.Cantidad;

        TemplateCarrito.querySelector('.btn-info').dataset.id = Producto.ID;
        TemplateCarrito.querySelector('.btn-danger').dataset.id = Producto.ID;

        const Clone = TemplateCarrito.cloneNode(true);
        Fragment.appendChild(Clone);
    });

    ProductosCarrito.appendChild(Fragment);

    PintarFooter();
};

const PintarFooter = () => {
    Footer.innerHTML = '';

    if (Object.keys(Carrito).length === 0) {
        Footer.innerHTML =
            `
            <th scope="row" colspan="6" class="text-center">
                Carrito Vacio -- Compra Ya!!!
            </th>
        `;

        return;
    }

    nCantidad = Object.values(Carrito).reduce((ACC, { Cantidad }) => ACC + Cantidad, 0);
    nPrecio = Object.values(Carrito).reduce((ACC, { Cantidad, Precio }) => ACC + Cantidad * Precio, 0);

    TemplateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    TemplateFooter.querySelector('span').textContent = nPrecio;

    const Clone = TemplateFooter.cloneNode(true);
    Fragment.appendChild(Clone);
    Footer.appendChild(Fragment);

    const Boton = document.querySelector('#Vaciar-Carrito');

    Boton.addEventListener('click', () => {
        Carrito = {};

        localStorage.setItem('Carrito', JSON.stringify(Carrito));

        PintarCarrito();
    });
};

const ObtenerDatos = async() => {
    try {
        const Res = await fetch('https://jsonplaceholder.typicode.com/users');
        const Data = await Res.json();
        console.log(Data)
            //PintarCards(Data);
    } catch (error) {
        console.log(error);
    }
};

const PintarCards = Data => {
    Data.forEach(Producto => {
        TemplateCard.querySelector('h5').textContent = Producto.Title;
        TemplateCard.querySelector('p').textContent = Producto.Precio;
        TemplateCard.querySelector('img').setAttribute("src", Producto.URL);
        TemplateCard.querySelector('.btn-dark').dataset.id = Producto.ID;

        const Clone = TemplateCard.cloneNode(true);

        Fragment.appendChild(Clone);
    });

    Items.appendChild(Fragment);
};