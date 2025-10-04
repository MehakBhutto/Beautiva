let url = "https://makeup-api.herokuapp.com/api/v1/products.json";
let star = '<i class="fa-solid fa-star"></i>';
let emptyStar = '<i class="fa-regular fa-star"></i>';
let mainContent = document.querySelector("main");
let cartProduct = 0;
let cartObj = [];
let totalAmount = document.querySelector("#subtotal_price");

async function getData(url) {
    try {
        let res = await axios.get(url);
        return res.data;
    } catch (e) {
        console.log("Error -", e);
    }
}

async function getProduct(url) {
    mainContent.innerText = "";
    let data = await getData(url);
    console.log(data);
    for (let i = 1; i < data.length; i++) {

        let prodt = document.createElement("div");
        let prodtImg = document.createElement("img");
        let prodtDes = document.createElement("div");
        let h3 = document.createElement("h4");
        let p = document.createElement("p");
        let rating = document.createElement("p");
        let tagbox = document.createElement("div");

        prodt.classList.add("product");
        prodtImg.classList.add("pro_sec1");
        prodtDes.classList.add("pro_sec2");
        tagbox.classList.add("tagbox");

        prodt.appendChild(prodtImg);
        prodt.appendChild(prodtDes);

        prodtDes.appendChild(h3);
        prodtDes.appendChild(rating);
        prodtDes.appendChild(tagbox);
        prodtDes.appendChild(p);

        mainContent.appendChild(prodt);

        let imageURL = data[i].api_featured_image;
        if (imageURL.startsWith("//")) {
            imageURL = "https:" + imageURL;
        }

        prodtImg.src = imageURL
        h3.innerHTML = data[i].name + "<br>";

        let rate = getRating(rating, i);

        getTags(data, tagbox, i);

        price = parseFloat(data[i].price);

        p.innerText += "Price." + (price + 200);
        p.style.fontSize = "17px";

        let index = data[i];

        prodt.addEventListener("click", () => {
            localStorage.removeItem("selectedProduct");
            localStorage.setItem("selectedProduct", JSON.stringify(index));
            localStorage.setItem("rating", rate);
            window.location.href = "product.html";
            console.log("button enter");
        });

    }
}



function getTags(data, box, itr) {
    tagNo = data[itr].tag_list.length;
    for (let j = 0; j < tagNo; j++) {
        if (j >= 2) {

        } else {
            let tags = document.createElement("div");
            tags.classList.add("tags");
            tags.innerText = data[itr].tag_list[j];
            box.appendChild(tags);
        }
    }
}

function getRating(obj, i) {
    obj.style.color = "orange";
    obj.style.fontSize = "18px";
        obj.innerHTML = star + star + star + star + star + "   <b>(0)</b>";
    return obj.innerHTML;
}

let searchBtn = document.querySelector("#search-area button");
searchBtn.addEventListener("click", () => {
    let input = document.querySelector("#search-area input");
    let searchTerm = input.value.trim();
    if (searchTerm) {
        localStorage.setItem("searchTerm", searchTerm);
        window.location.href = "search.html";
    }
})


let nameLogo = document.querySelector("#nav-box h3");
nameLogo.addEventListener("click", () => {
    window.location.href = "home.html";
})


window.onload = function () {
    console.log("Page loaded!");

    let searchItem = localStorage.getItem("searchTerm");
    let target = localStorage.getItem("type");
    console.log(target);
    search_field();
    setCart();
    getCart();

    if (window.location.href.includes("home.html")) {
        getProduct(url);
    } else if (window.location.href.includes("search.html")) {
        getProduct(url + "?product_type=" + searchItem);
        localStorage.removeItem("searchTerm");
    } else if (window.location.href.includes("product.html")) {
        let product = JSON.parse(localStorage.getItem("selectedProduct"));
        let rate = localStorage.getItem("rating");
        getItem(product, rate);
    } else if (window.location.href.includes("checkout.html")) {
        if (target == "checkout_btn") {
            let products = JSON.parse(localStorage.getItem("item")) || [];
            console.log("Cart checkout:", products);
            totalProducts(products);
        }
        else if (target == "buy_now item_btn") {
            let product = JSON.parse(localStorage.getItem("product"));
            if (product) {
                console.log("Buy now checkout:", product);
                totalProducts([product]);   // wrap single product in array
            }
        }
    }
};

let checkoutBtn = document.querySelector("#checkout_btn");
let totalPrice = document.querySelector("#subtotal_price");
checkoutBtn.addEventListener("click",(event)=>{
    if(totalPrice.innerText > 0){
        localStorage.setItem("type", event.target.id);
        window.location.href = "checkout.html";
    }
});

function totalProducts(cartObj){
    if (cartObj.length > -1) {
        let product_area = document.querySelector("#chkout-products");
        product_area.innerHTML = "";
        let subtotal = 0;
        for (let item of cartObj) {
            subtotal += item.price * item.quantity;
            oneProduct(item, product_area);
        }
        let Price = document.querySelector("#price-total");
        let totalPrice = document.querySelector("#price-box p");
        Price.innerText = "Rs " + subtotal.toFixed(2);
        totalPrice.innerText = "PKR " + (subtotal + 150).toFixed(2);
    }
}
function oneProduct(item, product_area){
    let product = document.createElement("div");
    let image = document.createElement("img");
    let p = document.createElement("p");
    let span = document.createElement("span");

    product.classList.add("chkout-product");
    product_area.appendChild(product);

    product.appendChild(image);
    product.appendChild(p);
    product.appendChild(span);

    let imageURL = item.api_featured_image;
    // if (imageURL.startsWith("//")) {
        imageURL = "https:" + imageURL;
    // }
    image.src = imageURL;
    p.innerHTML = `${item.name} - ${item.id} <br>Qty: ${item.quantity}`;
    span.innerText = "Rs. "+item.price*item.quantity;
}

function getCart() {
    cartProduct = 0;
    cartObj = JSON.parse(localStorage.getItem("item")) || [];
    console.log("cartObj: ", cartObj);

    if (cartObj.length > 0) {
        let subtotal = 0;
        for (let item of cartObj) {
            displayCartItem(item);
            subtotal += item.price * item.quantity;
            cartProduct++;
        }
        totalAmount.innerText = subtotal.toFixed(2);
    }
}


function getItem(product, rate) {
    console.log("button enter!");
    let itemPic = document.querySelector("#item_pic");
    let itemRate = document.querySelector("#rate");
    let itemName = document.querySelector("#item_name");
    let itemPrice = document.querySelector(".itemPrice");
    let desc = document.querySelector("p.desc");
    let reviewRate = document.querySelector("#review_rate");
    let reviewBtn = document.querySelector("#review_btn");
    let rating = document.querySelector("#review_area2 > p");
    let cart_Btn = document.querySelector("#add_cart");

    itemRate.style.textAlign = "left";

    let imageURL = product.api_featured_image;
    if (imageURL.startsWith("//")) {
       imageURL = "https:" + imageURL;
    }

    itemPic.src = imageURL;
    itemRate.innerHTML = rate;
    itemName.innerText = product.name;
    itemPrice.innerText = "Rs. " + (200 + parseFloat(product.price)).toFixed(2);
    desc.innerHTML = product.description;
    reviewRate.innerHTML = rate + ` out of 5 ` + `<br> Based on ${review} reviews`;
    reviewRate.innerHTML += ` <font color = "green"><i class="fa-solid fa-circle-check"></i></font>`;

    rating.innerHTML = emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;
    rating.addEventListener("hover", () => {
        rating.innerHTML = star + star + star + star + star
    });
    
    getQuantity();
    cart_Btn.addEventListener("click", () => {
        addCart(product);
    })
    console.log("button end!");
    getReview(reviewBtn, reviewRate);

    
let buyNow = document.querySelector(".buy_now");
buyNow.addEventListener("click",(event)=>{
    let screen =document.querySelector("#count_Screen")

    console.log(screen.innerText)
    checkoutProduct = {
        id : product.id,
        name : product.name,
        quantity : parseInt(screen.innerText),
        api_featured_image : product.api_featured_image,
        price: (200 + parseFloat(product.price)).toFixed(2)
    };
    
    localStorage.setItem("product", JSON.stringify(checkoutProduct));
    localStorage.setItem("type", event.target.className);
    window.location.href = "checkout.html";
})

}


function displayCartItem(product) {
    let cartPrdt = document.createElement("div");
    let itemPic = document.createElement("img");
    let itemDes = document.createElement("div");
    let itemName = document.createElement("h6");
    let itemQtity = document.createElement("p");
    let itemSide = document.createElement("div");
    let cancelIcon = document.createElement("i");
    let money = document.createElement("p");
    let cartArea = document.querySelector("#area-1");
    let cashier = document.querySelector("#cashier");
    let message = document.querySelector("#cart_empty");

    cartPrdt.classList.add("cart_product");
    itemPic.classList.add("item_image");
    itemDes.classList.add("item_des");
    itemName.classList.add("it_name");
    itemQtity.classList.add("it_quantity");
    itemSide.classList.add("it_side");
    money.classList.add("theme_money");

    // UI rendering
    cashier.style.display = "flex";
    message.style.display = "none";

    itemDes.appendChild(itemName);
    itemDes.appendChild(itemQtity);
    cartPrdt.appendChild(itemPic);
    cartPrdt.appendChild(itemDes);
    itemSide.appendChild(cancelIcon);
    itemSide.appendChild(money);
    cartPrdt.appendChild(itemSide);
    cartArea.appendChild(cartPrdt);

    let imageURL = product.api_featured_image;
        if (imageURL.startsWith("//")) {
            imageURL = "https:" + imageURL;
        }

    // Set values
    itemPic.src = imageURL;
    itemName.innerText = product.name;
    itemQtity.innerText = product.quantity;
    let total = (product.price * product.quantity).toFixed(2);
    money.innerHTML = total;
    cancelIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

    // Cancel button logic
    cancelIcon.addEventListener("click", () => {
        cartArea.removeChild(cartPrdt);
        let tA = parseFloat(totalAmount.innerText) || 0;
        totalAmount.innerText = (tA - parseFloat(total)).toFixed(2);

        cartProduct--;
        let index = cartObj.findIndex(item => item.id === product.id);
        if (index !== -1) {
            cartObj.splice(index, 1);
            localStorage.setItem("item", JSON.stringify(cartObj));
        }

        if (cartProduct === 0) {
            cashier.style.display = "none";
            message.style.display = "flex";
        }
        console.log(cartObj);
    });

    cartPrdt.addEventListener("click",() => {
        let res = getData(url);

        let selectedProduct = res.find(itr => itr.name === itemName.innerText);
        console.log(selectedProduct);
        if (selectedProduct) {
            localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
            window.location.href = "product.html";
        }

    })
}

function addCart(product) {
    let quantity = parseInt(localStorage.getItem("count")) || 1;

    // Prevent duplicates
    let exists = cartObj.find(item => item.id === product.id);
    if (!exists) {
        let newItem = {
            id: product.id,
            name: product.name,
            api_featured_image: product.api_featured_image,
            price: parseFloat(product.price) + 200 || 0,
            quantity: quantity,
        };

        cartObj.push(newItem);
        console.log(newItem);
        localStorage.setItem("item", JSON.stringify(cartObj));
        displayCartItem(newItem);

        let tA = parseFloat(totalAmount.innerText) || 0;
        totalAmount.innerText = (tA + newItem.price * newItem.quantity).toFixed(2);

        cartProduct++;
    }
}

function getQuantity() {
    let countBtn = document.querySelectorAll(".count");
    let countScrn = document.querySelector("#count_Screen");
    localStorage.setItem("count", countScrn.innerText);

    countBtn[1].addEventListener("click", () => {
        let currentVal = parseInt(countScrn.innerText) || 0;
        countScrn.innerText = currentVal + 1;
        localStorage.setItem("count", countScrn.innerText);
        console.log(countScrn.innerText)
    })
    countBtn[0].addEventListener("click", () => {
        let currentVal = parseInt(countScrn.innerText);
        if (countScrn.innerText > 1) {
            countScrn.innerText = currentVal - 1;
            localStorage.setItem("count", countScrn.innerText);
        }
    })
}

function getReview(reviewBtn, reviewRate) {
    let isOpen = false;
    reviewBtn.addEventListener("click", () => {
        let comArea = document.querySelector("#com_area");
        let reviewArea = document.querySelector("#review_area2");
        let reviewBtn = document.querySelector("#review_btn");

        if (!isOpen) {
            comArea.style.height = "600px";
            reviewArea.style.display = "flex";
            reviewBtn.innerText = "Cancel the review";
            isOpen = true;
            let reviewSubmit = document.querySelector("#revw_submit");
            reviewSubmit.addEventListener("click", () => {
                setReview(reviewRate);
            })
        } else {
            comArea.style.height = "127px";
            reviewArea.style.display = "none";
            reviewBtn.innerText = "Write a review";
            isOpen = false;
        }
    })
}

function setReview(reviewRate) {

    let rTitle = document.querySelector("#review_title");
    let rComment = document.querySelector("#comments");
    let rArea = document.querySelector("#review_area3");
    let person = `<i class="fa-regular fa-circle-user"></i>`;

    let rBox = document.createElement("div");
    let rh4 = document.createElement("p");
    let rdes = document.createElement("p");

    if (rTitle.value.trim() && rComment.value.trim() != "") {
        rBox.classList.add("cust_reviews");
        rBox.appendChild(rh4);
        rBox.appendChild(rdes);
        rArea.appendChild(rBox);

        rh4.style.textAlign = "left";
        rdes.style.textAlign = "left";
        rh4.style.marginBottom = "20px" 


        rh4.innerHTML = `${person}   ${rTitle.value}`;
        rdes.innerText = rComment.value;
        rComment.value = "";
        rTitle.value = "";
        reviewRate.innerHTML = rate + ` out of 5 ` + `<br> Based on ${++review} reviews`;
        reviewRate.innerHTML += ` <font color = "green"><i class="fa-solid fa-circle-check"></i></font>`;
    }
}
let review = 0;

function setCart() {
    let cart = document.querySelector("#cart-btn");
    let cancel = document.querySelector("#close-btn");
    let sidebar = document.querySelector("#cart-area");

    cart.addEventListener("click", () => {
        cancel.style.display = "inline";
        sidebar.style.right = "0px";
    });

    cancel.addEventListener("click", () => {
        sidebar.style.right = "-540px";
        cancel.style.display = "none";
    });
}

function emptyCart() {
    let cart = document.querySelectorAll(".cart_product");
    let cartTotal = document.querySelector("#subtotal_price");
    let message = document.querySelector("#cart_empty");

    for (product of cart) {
        product.remove();
    }
    cartTotal.innerText = "";
    cartTotal.style.display = "none";
    message.style.display = "flex";

}
function search_field() {
  const seBtn = document.querySelector('.search');
  const seField = document.querySelector('#search-area');

  seBtn.addEventListener("click", () => {
    seField.classList.toggle('active');
  });
}

let navBtn = document.querySelector(".navbar-toggler");
let collapse = document.querySelector(".navbar-collapse");

navBtn.addEventListener("click",()=>{
    collapse.classList.toggle("show");
})


let navLink = document.querySelectorAll(".nav-link");
 
for(link of navLink){
    if (window.location.href.includes(link.getAttribute("href"))){
       link.classList.add("active");
    }else{
        link.classList.remove("active")
    }
}

try{
document.getElementById("orderForm").addEventListener("submit", function(e) {
    // Check form validity
    if (this.checkValidity()) {
        e.preventDefault(); // stop form from actually submitting
        emptyCart()
        alert("🎉 Your order has been placed successfully!");
    } else {
        // Let browser show the built-in validation messages
    }
});
}catch(e){
    console.log(e);
}









// let url3 = "http://universities.hipolabs.com/search?name=";
// let ul = document.querySelector("ul");
// let btns = document.querySelector(".btn");
// let search = document.querySelector("input");
// // let search = "Nepal";

// async function getName(search) {
//     try{
//         let uni = await axios.get(url3+search);
//         return uni.data;
//     }catch(e){
//         console.log("error - ",e);
//     }
// }

// btns.addEventListener("click",async ()=>{
//     ul.innerText = "";
//     let ans = await getName(search.value);
//     for(list of ans){
//         console.log(list);
//         let li = document.createElement("li");
//         ul.appendChild(li);
//         li.innerText = list.name;
//     }
// });

// let url = "https://catfact.ninja/fact";
// let btn = document.querySelectorAll(".btn_style");
// let para = document.querySelector(".p");
// let img = document.querySelector("img");

// btn[0].addEventListener("click", async ()=>{
//   let fact = await getFacts(url);
//   para.innerText = fact;
// })

// async function getFacts(url){
//     try{
//        let res =  await axios.get(url);
//        return res.data.fact;
//     }catch(e){
//         console.log("error - ",e);
//         return "No result found"
//     }
// }
// async function getMessage(url){
//     try{
//        let res =  await axios.get(url);
//        return res.data.message;
//     }catch(e){
//         console.log("error - ",e);
//         return "No result found"
//     }
// }

// let url2 = "https://dog.ceo/api/breeds/image/random";

// btn[1].addEventListener("click", async ()=>{
//   let message = await getMessage(url2);
//   img.src = message;
// })





// async function getFacts(){
//     try{
//         let response =  await fetch(url);
//         let data = await response.json();
//         console.log(data.fact);
//     }catch(e){
//         console.log("error - ",e);
//     }
// }








// let h1= document.querySelector(".h1");
// function changeColor(color,delay){
//     return new Promise((resolve,reject)=>{
//        setTimeout(()=>{
//         h1.style.color = color;
//         console.log(`Color changes to ${color}!`);
//         resolve("successfully changed color");
//        },delay);
//     });
// }

// async function demo(){
//     await changeColor("red",1000);
//     await changeColor("yellow",1000);
//     changeColor("pink",1000);
// }


// function saveToDB(data){
//     return new Promise((resolve,reject) =>{
//         let internetSpeed = Math.floor(Math.random()*10)+1;
//         if(internetSpeed>4){
//             resolve("success data was saved");
//         }else{
//             reject("reject: weak connection");
//         }
//     });
// }

// saveToDB("ApnaCollege")
// .then((result)=>{
//     console.log("Data1 Saved");
//     console.log(result);
//     return saveToDB("Mehak");
// })
// .then((result)=>{
//     console.log("Data2 Saved");
//     console.log(result);
//     return saveToDB("Mehak12");
// })
// .then((result)=>{
//     console.log("Data3 Saved");
//     console.log(result);
// })
// .catch((error)=>{
//     console.log("promise was rejected");
//     console.log(error);
// });