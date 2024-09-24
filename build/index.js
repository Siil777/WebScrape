let listOfGood = [];


async function fetchD() {
    try{
        const response = await fetch('http://localhost:777/get');
        const data = await response.json();
        console.log(data);
        const firstElelement = Object.keys(data);
        listOfGood = data[firstElelement];

        console.log('Good', listOfGood);

        interFace();

        //console.log(data);

    }catch(e){
        console.error(e);
    }
}
fetchD();

function interFace(){
    const containerForInterface = document.getElementById('goods');
    containerForInterface.innerHTML = '';
 
    const topDiv = document.createElement('div');
    if(Array.isArray(listOfGood)){
        listOfGood.forEach((book)=>{
            const divNmaeOfBook = document.createElement('div');
            divNmaeOfBook.textContent = book.name;
            topDiv.appendChild(divNmaeOfBook);
        });
    }else{
        console.log('list of book is not array or undefined');
    }
    containerForInterface.appendChild(topDiv);
    console.log(containerForInterface);



    console.log('books', listOfGood);
}