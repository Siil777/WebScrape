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
    $xpath = new DOMXPath($dom);
    $elements = $xpath->query('//ol/li');
    //dot specify we try find element within whole document
    foreach($elements as $element){
        $productName = $xpath -> query('.//h3/a',$element)->item(0)->nodeValue;
        $productPrice = $xpath -> query('.//p[@class="price_color"]', $element)->item(0)->nodeValue;
        $discountPrice = $xpath -> query('.//p[@class="sale_price"]', $element);
        $discountPriceValue = $discountPrice->length>0 ? $discountPrice ->item(0)->nodeValue : null;
        $category = $xpath -> query('//div[@class="side_cotegories"]');
        $categoryValue = $category->length>0 ? $category->item(0)->nodeValue : null;

        $products[]=[
            'name'=>trim($productName),
            'price'=>trim($productPrice),
            'discount_price'=> $discountPriceValue ? trim($discountPriceValue) : null,
            'category'=> $categoryValue ? trim($categoryValue) : null
        ];
    }
    return $products;
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
