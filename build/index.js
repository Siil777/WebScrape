async function fetchD() {
    try{
        const response = await fetch('http://localhost:666/get');
        const data = await response.json();

        console.log(data);

    }catch(e){
        console.error(e);
    }
}
fetchD();