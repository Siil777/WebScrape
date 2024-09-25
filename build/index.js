let listOfGood = [];

//Get json for UI
async function fetchD() {
    try{
        const response = await fetch(`http://localhost:777/get`);
        const data = await response.json();
        console.log(data);
        const firstElelement = Object.keys(data);
        listOfGood = data[firstElelement];


        let products = listOfGood.products;
        let categories = listOfGood.categories;

        console.log('Good', listOfGood);

        interFace();
        //avarage price of book on index page
        avaragePrice();
        //categories of book and number of elements in each category
        UiForCategories();
        popular();
        console.log(data);

    }catch(e){
        console.error(e);
    }
}
fetchD();
//index page
function interFace(books = listOfGood.products){
    const containerForInterface = document.getElementById('goods');
    containerForInterface.innerHTML = '';
    const wrapBooksForStricture = document.createElement('div');
    wrapBooksForStricture.classList.add('books-stricture');
    const topDiv = document.createElement('div');
    if(Array.isArray(books)){
        books.forEach((book)=>{
            const divNameOfBook = document.createElement('div');
            divNameOfBook.textContent = `Name: ${book.name}`;
            divNameOfBook.classList.add('custom-wrap');
    
            const bookPrice = document.createElement('div');
            bookPrice.textContent = `Price: ${book.price}`;
            divNameOfBook.classList.add('custom-wrap')
            wrapBooksForStricture.appendChild(divNameOfBook);
            wrapBooksForStricture.appendChild(bookPrice);
            topDiv.appendChild( wrapBooksForStricture);
        });
    }else{
        console.log('list of book is not array or undefined');
    }
    containerForInterface.appendChild(topDiv);
}
//Categories
function UiForCategories(categories=listOfGood.categories){
    const categoriesUi = document.getElementById('categories');
    const btnHideShow = document.getElementById('btnHideShow');
    categoriesUi.style.display = 'none';
    categoriesUi.innerHTML = '';
    //hide show btn
    btnHideShow.addEventListener('click', (event)=>{
        const pi = event.target;
        console.log('button clicked', pi);
            if(categoriesUi.style.display==='none' || categoriesUi.style.display===''){
                categoriesUi.style.display='block';
                categoriesUi.classList.remove('hide');
                categoriesUi.classList.add('show');
            }else{
                categoriesUi.style.display='none';
                categoriesUi.classList.remove('show');
                categoriesUi.classList.add('hide');
            }
    });

    const CatDiv = document.createElement('div');
    const wrapCountAndCtegory = document.createElement('div');
    if(Array.isArray(categories)){
        categories.forEach((category)=>{
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `Category name: ${category.category}`;
            const categoryBooksNum = document.createElement('div');
            categoryBooksNum.innerHTML = `Count of books in the ${category.category} category: ${category.book_count}`;
            wrapCountAndCtegory.appendChild(categoryDiv);
            wrapCountAndCtegory.appendChild(categoryBooksNum);
            CatDiv.appendChild(wrapCountAndCtegory);
        });
    }else{
        console.log('This is not fucking array');
    }
    categoriesUi.appendChild(CatDiv);
}
//function to find an item on index
async function findItem(query) {
    const container = document.getElementById('leida');

    try{
        const response = await fetch(`http://localhost:777/get?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        const ferstElement = Object.keys(data)[0];
        const getElement = listOfGood.products;


        const filterBooks = getElement.filter(book=>book.name.toLowerCase().includes(query.toLowerCase()))
        if(filterBooks.length > 0){
            container.innerHTML = '';
            filterBooks.forEach((book)=>{
                const div = document.createElement('div');
                div.textContent = `Name: ${book.name}: Price: ${book.price}`;
                container.appendChild(div);
            });
        }else{
            alert('item was not found');
        }
    }catch(e){
        console.error(e);
    }
}

document.getElementById('Tofind').addEventListener('click', async()=>{
    const query = document.getElementById('search').value;
    await findItem(query);
});

//func to find avarage price of book on index page
function avaragePrice(){
    const getElement = listOfGood.products;
    const containerForPrice = document.getElementById('chart');
    containerForPrice.textContent = 'avarage price for book on index page';
    if(Array.isArray(getElement)){
        const middle = document.createElement('div');
        const avaragePrice = getElement.reduce((sum,book)=>{
            const price = parseFloat(book.price.replace('£', ''))
            return sum + price;
        }, 0) / getElement.length;
        middle.classList.add('pie');
        middle.style = '--p:20';
        middle.innerHTML = `<div>${avaragePrice.toFixed(2)}£</div>`;
        containerForPrice.appendChild(middle);
        console.log('avarage price for book on index page is:', avaragePrice.toFixed(2));
    }else{
        console.log('this is not an array');
    }
}
//function the most popular categories of books
function popular(categories=listOfGood.categories){
    let maxBook = Math.max(...categories.map(category=>category.book_count));
    const mostPopularCategories = categories.filter(category=>category.book_count===maxBook);
   // let modalId = categories.map((category, index)=>`modal-${index+1}`);
    //console.log('for modals', modalId);
    categories.forEach((cat)=>{
        console.log(`img urls ${cat.image}`);
    });
    const containerForChartPopulatBooks = document.getElementById('char-categories');
    const modals = document.getElementById('Modals');
    //modals.innerHTML = '';
    containerForChartPopulatBooks.classList.add('year-stats');
    mostPopularCategories.forEach((category,index)=>{
        const modalId = `modal-${index+1}`;
        const MonthGroup = document.createElement('div');
        MonthGroup.classList.add('month-group');
        const bar = document.createElement('div');
        bar.classList.add('bar','h-100');
        bar.textContent = `${category.book_count}`;
        const p = document.createElement('p');
        p.classList.add('month');
        p.textContent = `${category.category}`;
        p.setAttribute('data-modal-id', modalId);
        p.addEventListener('click', ()=>{
            console.log('element has been clicked!', modalId);
            const divModal = document.createElement('div');
            divModal.classList.add('modal');
            const imgDiv = document.createElement('img');
            imgDiv.src = category.image.startsWith('http') ? category.image : `http://localhost:777${category.image}`;
            divModal.id = modalId;
            divModal.innerHTML = `
                <div>
                    <h2>${category.category}</h2>
                    <button class="close-modal">Close</button>
                </div>
            `;
            divModal.appendChild(imgDiv);
            modals.appendChild(divModal);
            const closeButton = divModal.querySelector('.close-modal');
            closeButton.addEventListener('click', () => {
                modals.removeChild(divModal);
            });
        });
        MonthGroup.appendChild(bar);
        MonthGroup.appendChild(p);
        containerForChartPopulatBooks.appendChild(MonthGroup);
        console.log(`The most popular categories ${category.category} with ${category.book_count}`);
    });
}