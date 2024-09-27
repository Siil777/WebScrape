let listOfGood = [];

//UI if index
async function fetchD() {
    const MaxRetries = 17;
    let retries = 0;

    while (retries < MaxRetries) {
        try {
            const response = await fetch(`http://localhost:777/get`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log(data);

            const firstElement = Object.keys(data); 
            listOfGood = data[firstElement];

            let products = listOfGood.products;
            let categories = listOfGood.categories;
            console.log('CATEGORIESW', categories);
            categories.forEach((cat)=>{
                console.log(`img urlsone: ${cat.image}`);
            }) 

            console.log('Good', listOfGood);

            interFace();
            avaragePrice();   // Function to calculate average price
            UiForCategories(); // Function to handle categories display
            popular();         // Function to display popular books

            console.log(data);
            return;

        } catch (e) {
            retries++;
            console.log(`Retrying fetch... (${retries})`);
            const fetching = document.getElementById('fetc-container');
            fetching.innerHTML = '';
            fetching.textContent = `Retrying fetch... (${retries})`;

            if (retries >= MaxRetries) {
                console.error('Max retries reached. Failed to fetch data.');
            }
            //increased time of promise because when we run the project the fisrt time it takes time before
            //backend script collect all data and cache it.
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

fetchD();
//List of books from index page
function interFace(books = listOfGood.products){
    const containerForInterface = document.getElementById('goods');
    containerForInterface.innerHTML = '';
    const wrapBooksForStricture = document.createElement('div');
    wrapBooksForStricture.classList.add('books-stricture-list-of-books-index');
    const topDiv = document.createElement('div');
    if(Array.isArray(books)){
        books.forEach((book)=>{
            const divNameOfBook = document.createElement('div');
            divNameOfBook.textContent = `Name: ${book.name}`;
            divNameOfBook.classList.add('custom-wrap-list-of-books-index');
    
            const bookPrice = document.createElement('div');
            bookPrice.textContent = `Price: ${book.price}`;
            divNameOfBook.classList.add('custom-wrap-list-of-books-index')
            wrapBooksForStricture.appendChild(divNameOfBook);
            wrapBooksForStricture.appendChild(bookPrice);
            topDiv.appendChild( wrapBooksForStricture);
        });
    }else{
        console.log('list of book is not array or undefined');
    }
    containerForInterface.appendChild(topDiv);
}
//Categories index page
function UiForCategories(categories=listOfGood.categories){
    const categoriesUi = document.getElementById('categories');
    categoriesUi.classList.add('custom-mt-categories');
    const btnHideShow = document.getElementById('btnHideShow');
    categoriesUi.style.display = 'none';
    categoriesUi.innerHTML = '';
    //hide show btn
    btnHideShow.addEventListener('click', (event)=>{
        const pi = event.target;
        console.log('button clicked', pi);
            if(categoriesUi.style.display==='none' || categoriesUi.style.display===''){
                categoriesUi.style.display='block';
                categoriesUi.classList.remove('hide-categories-index-page');
                categoriesUi.classList.add('show-categories-index-page');
            }else{
                categoriesUi.style.display='none';
                categoriesUi.classList.remove('show-categories-index-page');
                categoriesUi.classList.add('hide-categories-index-page');
            }
    });

    const CatDiv = document.createElement('div');
    const wrapCountAndCtegory = document.createElement('div');
    if(Array.isArray(categories)){
        categories.forEach((category)=>{
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `Category name: ${category.category}`;
            const bookCount = category.book_count.book_count;
            console.log('Book Count:', bookCount, 'Type:', typeof bookCount);
            const categoryBooksNum = document.createElement('div');
            categoryBooksNum.innerHTML = `Count of books in the ${category.category} category: ${bookCount}`;
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
                div.classList.add('custom-mt-categories');
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
    const query = document.getElementById('search-index-page').value;
    await findItem(query);
});

//Functionality of index
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
//Modals
//function the most popular categories of books
function popular(categories=listOfGood.categories){
    let maxBook = Math.max(...categories.map(category=>category.book_count.book_count));
    const mostPopularCategories = categories.filter(category=>category.book_count.book_count===maxBook);
   // let modalId = categories.map((category, index)=>`modal-${index+1}`);
    //console.log('for modals', modalId);
    categories.forEach((cat)=>{
        console.log(`BOOKS IN CATEGORY ${cat.books}`);
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
        bar.textContent = `${category.book_count.book_count}`;
        const p = document.createElement('p');
        p.classList.add('month');
        p.textContent = `${category.category}`;
        p.setAttribute('data-modal-id', modalId);
        p.addEventListener('click', ()=>{
            console.log('element has been clicked!', modalId);
            const excistingModal = document.getElementById(modalId);
            if(excistingModal){
                modals.removeChild(excistingModal);
            }
            const divModal = document.createElement('div');
            divModal.classList.add('modal');
/*             const imgDiv = document.createElement('img');
            console.log(`Type of image: ${typeof category.image}`, category.image);
            imgDiv.src = category.image.startsWith('http')
                ? category.image
                : `http://books.toscrape.com/${category.image}`;
                console.log('path to img', `${category.category}  ${imgDiv.src}`); */
                const BooksNames = category.books.map(book=>`<li>${book.title}</li>`).join('');
                divModal.id = modalId;
                divModal.innerHTML = `<div>
                <h2 class='custom-m-auto-modal'>${category.category}</h2>
                <div>
                <ul class='custom-font-modal'>${BooksNames}</ul>
                </div>
                <div class='custom-flex-modal'>
                    <button class='button-23'>Close</button>
                </div>
                </div>`;
            //divModal.appendChild(imgDiv);
            modals.appendChild(divModal);
            const closeButton = divModal.querySelector('.button-23');
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