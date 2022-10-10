//! бэк
const API = "http://localhost:8000/test";

// ! вытягиваем теги в переменные
let inpName = document.querySelector("#inpName");
let inpImg = document.querySelector("#inpImg");
let inpDesc = document.querySelector("#inpDescription");
let inpPrice = document.querySelector("#inpPrice");
let btnCreate = document.querySelector("#btnCreate");
let sectionBox = document.querySelector(".section__box");

//? эти для редактирования
let inpReadName = document.querySelector("#inpReadName");
let inpReadImg = document.querySelector("#inpReadImg");
let inpReadDesc = document.querySelector("#inpReadDescr");
let inpReadPrice = document.querySelector("#inpReadPrice");
let btnReadSave = document.querySelector("#btnReadSave");
let btnReadClose = document.querySelector("#btnReadClose");
let mainModal = document.querySelector(".main_modal");

//? это для поиска
let inpSearch = document.querySelector("#inpSearch");
//? тут можно создать пустую перменную в которую ниже на событие input будет сразу записываться значение value из инпута inpSearch
let searchValue = "";

//? это для скрытия админ панелей
let adminBox = document.getElementsByClassName("admin__box");
let adminBtn = document.querySelector("#adminBtn");
let createBox = document.querySelector(".create__box");

//? это для отображения продукта в окне
let btnProduct = document.querySelector(".btnProduct");
let mainModalProduct = document.querySelector(".main_product_modal");
let modalProduct = document.querySelector(".product_modal");
//? выше в переменную сохраняем значение из проверочного алёрта. после вызова кнопкой - функции она проверяет условия совпадает ли пинкод и на основании этого открывает админ панели
let pinCode = "";

//?кнопки для пагинации и значение страницы 1
let currentPage = 1;
let btnPrev = document.querySelector("#btnPrev");
let btnNext = document.querySelector("#btnNext");

// //! создаём форму проверки админа

// function adminPanel() {
//   if (pinCode !== "svyat") {
//     setTimeout(() => {
//       for (let i of adminBox) {
//         i.style.display = "none";
//       }
//       createBox.style.display = "none";
//     }, 60);
//   } else {
//     setTimeout(() => {
//       for (let i of adminBox) {
//         i.style.display = "block";
//       }
//       createBox.style.display = "block";
//     }, 60);
//   }
// }

function adminPanel() {
  if (pinCode !== "svyat") {
    //? тут я через getelements вытаскиваю массив с двумя элементами который перебираю
    for (let i of adminBox) {
      i.style.display = "none";
      createBox.style.display = "none";
    }
  } else {
    for (let i of adminBox) {
      i.style.display = "block";
      createBox.style.display = "block";
    }
  }
}

adminBtn.addEventListener("click", () => {
  pinCode = prompt("Введите пароль");
  adminPanel();
});

// ! создаём функцию создания продукта
function createProduct(createObj) {
  //? подключаемся к бэку и прописываем вторым аргументом в объекте metod, headers и body(а в нём объект что передаём)
  fetch(API, {
    method: "POST",
    headers: {
      //? стандартная кодировка
      "content-type": "application/json; charset=utf-8",
    },
    //? в body передаём объект со значениями из инпутов
    body: JSON.stringify(createObj),
    //? тут будет закускаться функция отображения
  }).then(() => readProduct());
}

//! создаем кнопку добавления продукта на бэк
btnCreate.addEventListener("click", () => {
  //? делаем проверку на заполнение
  if (
    !inpName.value.trim() ||
    !inpImg.value.trim() ||
    !inpDesc.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  //? создаём объект со значениями из инпутов
  let createObj = {
    name: inpName.value,
    img: inpImg.value,
    description: inpDesc.value,
    price: inpPrice.value,
  };
  //? передаём его в параметр функции создания
  createProduct(createObj);
  //? очишаем поля инпутов
  inpName.value = "";
  inpImg.value = "";
  inpDesc.value = "";
  inpPrice.value = "";
});

//! создаём функцию отображения
function readProduct() {
  //? ?q=${searchValue} - это по сути фильтр реализованный в нашем файле json
  //? &_page=${currentPage} - это счётчик страниц в нашем json
  //? &_limit=6& - это лимит элементов массива выводимых на одной странице
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=3&`)
    .then(elem => elem.json()) //? elem тут это "массив" объектов мы принимаем его и переводим из формата json в состояние массива
    .then(item => {
      //? тут мы перебираем массив и достаём объекты
      sectionBox.innerHTML = "";
      item.forEach(element => {
        //? element тут это объект мы берём из него значения обращаясь к ключам
        sectionBox.innerHTML += `<div class="section__box_card">
        <h2 class="card_name">${element.name}</h2>
        <img
          class="card_image"
          src=${element.img}
          alt=""
        />
        <h3 class="card_description">${element.description}</h3>
        <h3 class="card_price"> ${element.price} <span>сом</span></h3>
        <div class="admin__box">
        <img
          class="card_delete"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcDaI92_uY0WOzl2_FyaJRLsDfmT3L0xjAKg&usqp=CAU"
          alt=""
          id=${element.id}
          onclick=deleteProduct(${element.id})
        />
        <img
          class="card_edit"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1VTQ4GG085rGwAJJyLT4gQjdfKRr52a1yUg&usqp=CAU"
          alt=""
          onclick=editProduct(${element.id})
        />
      </div>
      <button class="btnProduct" onclick=product(${element.id})> подробнее </button>
        </div> `;
      });
      //? тут выше в запросе прописал что максимальное колличество элементов на странице 3 и тут вызывая функцию pageList мы считаем сколько всего у нас страниц исходя из того что элементов может быть только 3. и присваиваем это число переменной countPage
      pageList();
      //? тут после отображения страницы вызываем функцию отображения админ панели которая снова сравнивает сохранённый ранее пароль и либо открывает либо закрывает админку
      adminPanel();
    });
}
//? выше на картинку редактирования навесил событие которое запускается и передает в параметры id этого элемента
//? выше - на картинку delete навесил событие внутри тега, оно запускает функцию удаления ниже и в параметры передаётся id с бэка
readProduct();

//! создаём функцию удаления
//? делаем запрос к бэку и подставляем в конец номер id из параметров в которые он падает element.id картинки
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
    //? и сразу вызываем функцию отображения
  }).then(() => readProduct());
}

//! создаём функцию сохранения изменений
//? передаём ниже в кнопке сохранить ей в аргументы новый изменённый объект и ID этого элемента
function editReadProduct(editId, createReadObj) {
  //? подключаемся к бэку и прописываем вторым аргументом в объекте metod, headers и body(а в нём объект что передаём)
  fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    //? в body передаём объект со значениями из инпутов
    body: JSON.stringify(createReadObj),
    //? тут будет закускаться функция отображения
  }).then(() => readProduct());
}

//! создаём функцию редактирования
//? создаём переменную в глобальной области что бы присвоить ей дальше ID того элемента на который мы кликнули , дальше она понадобиться в функции сохранения резултата изменения
let editId = "";
function editProduct(id) {
  //? открываем окно редактирования
  mainModal.style.display = "block";
  //? делаем запрос как выше по id стягиваем данные и подставляем их в инпуты
  fetch(`${API}/${id}`)
    .then(element => element.json())
    .then(product => {
      inpReadName.value = product.name;
      inpReadImg.value = product.img;
      inpReadDesc.value = product.description;
      inpReadPrice.value = product.price;
      editId = product.id;
    });
}

//? на кнопке закрыть событие закрывает окно
btnReadClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

//? создаём кнопку сохранения изменений
btnReadSave.addEventListener("click", () => {
  //? делаем проверку на заполнение
  if (
    !inpReadName.value.trim() ||
    !inpReadImg.value.trim() ||
    !inpReadDesc.value.trim() ||
    !inpReadPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  //? создаём объект со значениями из инпутов
  let createReadObj = {
    name: inpReadName.value,
    img: inpReadImg.value,
    description: inpReadDesc.value,
    price: inpReadPrice.value,
  };
  //? передаём его в параметр функции создания
  editReadProduct(editId, createReadObj);
  //? закрываем модальное окно
  mainModal.style.display = "none";
});

//! инпут поиска
inpSearch.addEventListener("input", e => {
  //? тут после каждого изменения в инпуте записываем каждое изменение в пустую переменную (перезаписываем её) а она выше подставлена в поиске функции отображения
  searchValue = e.target.value;
  //? после каждого события зпускаем функцию отображения.
  readProduct();
});

//! дополнительное окно отображения продукта
function product(id) {
  mainModalProduct.style.display = "block";
  fetch(`${API}/${id}`)
    .then(element => element.json())
    .then(item => {
      mainModal.innerHTML = "";
      modalProduct.innerHTML = `<div class="product__box_card">
        <h2 class="product_name">${item.name}</h2>
        <img
          class="product_image"
          src=${item.img}
          alt=""
        />
        <h3 class="product_description">${item.description}</h3>
        <h3 id=${item.id}) class="product_price"> ${item.price} <span>сом</span></h3>
        <button class="main_modal_close" onclick="handleClick()"> закрыть </button>
        </div> `;
    });
}
//? тут ВЫШЕ на динамически созданную кнопку закрытия дополнительного окна навесили событие функцию которая переписывает стиль display

function handleClick() {
  //? закрываем доп окно
  mainModalProduct.style.display = "none";
}

// ! пагинация
//? эта переменная счётчик общего колличества страниц. выше в readproducts в запросе мы указали что максимальное колличество элементов на странице 3 штуки. и исходя из этого ниже в функции на основании результата перебора мы посчитаем общее колличество страниц

let countPage = 1;
function pageList() {
  fetch(`${API}?q=${searchValue}`)
    .then(element => element.json())
    //? тут достаём объекты и с помощью метода math считаем - по сути говорим что единица это три элемента округляя в большую сторону если их меньше. затем результат присваиваем переменной countPage
    .then(item => {
      countPage = Math.ceil(item.length / 3);
    });
}

//? навешиваем события
btnPrev.addEventListener("click", () => {
  //? тут сначала проверяем условия если номер текущей страницы 1 или меньше то останавливаем код если нет то уменьшаем на единицу
  if (currentPage <= 1) return;
  currentPage--;
  readProduct();
});

btnNext.addEventListener("click", () => {
  console.log("ee");
  //? тут проводим проверку что если номер страницы currentPage больше или равен общему числу страниц countPage то код останавливается если нет то к номеру страницы currentPage прибавляем один
  if (currentPage >= countPage) return;
  currentPage++;
  readProduct();
});
