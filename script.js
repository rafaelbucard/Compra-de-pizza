
let cart = [];
let modalKey = 0;
let modalQt = 1;

const doc = function(el){
    return document.querySelector(el);
    // função de atalho para document.querySelector
} 
const docAll = function(el){
    return document.querySelectorAll(el);
    // função de atalho para document.querySelectorAll
} 

//Listando Pizzas
pizzaJson.map((item, index)=>{

    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    // Seleção do html display none para uma areá de pizzas 

    pizzaItem.setAttribute('data-key', index); // Criando atributo para identificar pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        //Pegando key da pizza
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        doc('.pizzaBig img').src = pizzaJson[key].img;
        doc('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        doc('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        doc('.pizzaInfo--size.selected').classList.remove('selected');
        docAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        doc('.pizzaInfo--qt').innerHTML = modalQt;

        doc('.pizzaWindowArea').style.opacity = 0;
        doc('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            doc('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    });

    doc('.pizza-area').append(pizzaItem);
});

// Eventos de add carrinho e fechar  Modal 
function closeModal(){
    doc('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        doc('.pizzaWindowArea').style.display= 'none';
    }, 500);
}
docAll('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

doc('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt>1){
        modalQt--;
        doc('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

doc('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    doc('.pizzaInfo--qt').innerHTML = modalQt;
    
});

// selecionando Tamanho 
docAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
   size.addEventListener('click',(e)=>{
    doc('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   })
});

//Add ao carrinho
doc('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt( doc('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identfier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identfier == identfier);

    if(key > -1){
        cart[key].qt += modalQt;
    } else {

    cart.push({
        identfier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    })
}
  updateCart();  
  closeModal();
}); 

doc('.menu-openner').addEventListener('click',()=>{
    if (cart.length > 0 ) {
        doc('aside').style.left = '0';
    }
});
doc('.menu-closer').addEventListener('click',()=>{
    
    doc('aside').style.left = '100vw';
    
});


// Informarçoes de Pizzas no Carrinho
function updateCart() {
    doc('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        doc('aside').classList.add('show');
        doc('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaItem = pizzaJson.find(function(item){
                return item.id == cart[i].id;
            }); 
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = doc('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch( cart[i].size){
              case 0:
                  pizzaSizeName = 'P';
                  break;
              case 1:
                  pizzaSizeName = 'M';
                  break;
              case 2:
                  pizzaSizeName = 'G';    
                  break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt >1) {
                    cart[i].qt--;
                    
                } else {
                    cart.splice(i,1);
                }
                updateCart();
            })
            ;cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });


            doc('.cart').append(cartItem);
            
        } 

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        doc('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        doc('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        doc('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        


    } else {
        doc('aside').classList.remove('show'); 
        doc('aside').style.left = '100vw'; 
    }
}