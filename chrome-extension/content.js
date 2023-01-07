async function getTweets(){
    const tweets = document.querySelectorAll(`[data-testid="tweetText"]`);
    for (let tweet of tweets){
        const tweetText = tweet.innerText 
        if (tweetText == ""){
            continue
        }
        fetch('http://127.0.0.1:8080/api/language-detection',{
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tweet_text: tweetText})
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            if (data['is_english'] == true){
                fetch('http://127.0.0.1:8080/api/sentiment-score',{
                    method: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({tweet_text: tweetText})
                })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    data['detected_mood']
                })
            }
        })

        if (tweet.id == ""){
            let rootNode = tweet.parentNode.parentNode.getElementsByTagName("time")[0].parentNode.parentNode.parentNode;
            const childNodes = rootNode.childNodes;
            if (childNodes.length == 2){
                const dot = childNodes[0].cloneNode(true);
                const detectedMood = childNodes[0].cloneNode(true);
                detectedMood.innerText = "Detected Mood:";
                rootNode.appendChild(dot);
                rootNode.appendChild(detectedMood);
            }
        }
        else{
            let rootNode = tweet.parentNode.parentNode.parentNode.getElementsByTagName("time")[0].parentNode.parentNode.parentNode;
            const childNodes = rootNode.childNodes;
            if (childNodes.length == 3){
                const dot = childNodes[1].cloneNode(true);
                const detectedMood = childNodes[1].cloneNode(true);
                detectedMood.innerText = "Detected Mood:";
                rootNode.appendChild(dot);
                rootNode.appendChild(detectedMood);
            }
            
        }
    }
}

getTweets();
