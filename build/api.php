<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-type: application/json');
function CrawlSomeGood($url){
    $ch = curl_init();

    //set url and options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    //SET USER AGENT TO MIMIC A BROWSER
    curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36(KHTML like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    $html = curl_exec($ch);

    //echo $html;
    if(curl_errno($ch)){
        echo json_encode(['error'=>'Curl error:'.curl_error($ch)]);
        curl_close($ch);
        return;
    }

    curl_close($ch);

    if($html===null){
        return false;
    }

    $dom = new DomDocument();
    @$dom -> loadHTML($html);


    $products = [];
    $categories= [];
    $categoryBookCount = [];
    
    $xpath = new DOMXPath($dom);
    $elements = $xpath->query('//ol/li');
    //dot specify we try find element within whole document
    foreach($elements as $element){
        $productName = $xpath -> query('.//h3/a',$element)->item(0)->nodeValue;
        $productPrice = $xpath -> query('.//p[@class="price_color"]', $element)->item(0)->nodeValue;
        $discountPrice = $xpath -> query('.//p[@class="sale_price"]', $element);
        $discountPriceValue = $discountPrice->length>0 ? $discountPrice ->item(0)->nodeValue : null;
        $bookImage = $xpath -> query('.//div[@class="image_container"]/a/img', $element)->item(0)->getAttribute('src');

        $products[]=[
            'name'=>trim($productName),
            'price'=>trim($productPrice),
            'discount_price'=> $discountPriceValue ? trim($discountPriceValue) : null,
            'image' => trim($bookImage)
        ];
    }
        $elelementsTwo = $xpath->query('//ul[@class="nav nav-list"]');
        foreach($elelementsTwo as $elelementTwo){
            $categoryElements = $xpath->query('.//ul/li/a', $elelementTwo);

            foreach($categoryElements as $categoryElement){
                $categoryName = trim($categoryElement->textContent);
                $categoryLink = trim($categoryElement->getAttribute('href'));
                if(strpos($categoryLink, 'http')!==0){
                    $baseUrl = 'http://books.toscrape.com/';
                    $categoryLink = $baseUrl . ltrim($categoryLink, '/');
                }
                $bookCount = countBooksInCategory($categoryLink);
                $categories[]=[
                    'category'=>$categoryName,
                    'link'=>$categoryLink,
                    'book_count'=> $bookCount
                ];
            }
        }
    return [
        'products'=>$products,
        'categories'=>$categories
    ];

}
function countBooksInCategory($categoryUrl) {
    $cachedCategories = getCache($categoryUrl);
    if ($cachedCategories !== false) {
        return $cachedCategories;
    }


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $categoryUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KHTML like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    $html = curl_exec($ch);
    if (curl_errno($ch)) {
        error_log('cURL Error: ' . curl_error($ch)); 
        curl_close($ch);
        return 0; 
    }
    curl_close($ch);

    if ($html === null) {
        return 0; 
    }


    $dom = new DomDocument();
    @$dom->loadHTML($html);
    $xpath = new DOMXPath($dom);
    $bookElements = $xpath->query('//ol/li');
    $bookCount = $bookElements->length;

    setCache($categoryUrl, $bookCount);
    return $bookCount;
}

function getCache($categoryUrl) {
    $cacheFile = 'cache/' . md5($categoryUrl) . '.json';
    //check time last time was proccesed.
    if (file_exists($cacheFile)) {
        $cacheTime = filemtime($cacheFile);
        if (time() - $cacheTime < 3600) { 
            $cacheData = file_get_contents($cacheFile);
            return json_decode($cacheData, true)['book_count']; 
        }
    }
    return false;
}

// Set cache for book count
function setCache($categoryUrl, $bookCount) {
    $cacheFile = 'cache/' . md5($categoryUrl) . '.json';
    $dataToCache = [
        'book_count' => $bookCount,
        'timestamp' => time()
    ];
    file_put_contents($cacheFile, json_encode($dataToCache)); 
}

if($_SERVER["REQUEST_METHOD"]==='GET'){
    $urls = file('urls.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $results = [];

    foreach($urls as $url){
        $results[$url]=CrawlSomeGood(trim($url));
    }
    echo json_encode($results);
}else{
    http_response_code(405);
    echo json_encode(['error'=>'method not allowed']);
}
