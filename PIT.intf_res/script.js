function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemImage = document.getElementById('item-image').value;
    const itemPrice = document.getElementById('item-price').value;

    if (itemName && itemImage && itemPrice) {
        const menuItems = document.getElementById('menu-items');

        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';

        const img = document.createElement('img');
        img.src = itemImage;
        img.alt = itemName;

        const name = document.createElement('h3');
        name.textContent = itemName;

        const price = document.createElement('p');
        price.textContent = `R$ ${parseFloat(itemPrice).toFixed(2)}`;

        menuItem.appendChild(img);
        menuItem.appendChild(name);
        menuItem.appendChild(price);

        menuItems.appendChild(menuItem);

        document.getElementById('item-name').value = '';
        document.getElementById('item-image').value = '';
        document.getElementById('item-price').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}
