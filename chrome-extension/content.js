// server url 
BASE_URL = "https://myproject-415.wl.r.appspot.com"
// if server is running locally, use the url below instead.
// BASE_URL = "http://127.0.0.1:8080"

async function addSentimentOfTweets(){
    let tweets_dict = {}
    const tweets = document.querySelectorAll(`[data-testid="tweetText"]`);
    let body = []
    for (let tweet of tweets){
        const tweetText = tweet.innerText 
        const obj = {[tweetText]: tweet}
        Object.assign(tweets_dict,obj)
        if (tweetText == ""){
            continue
        }
        else{
            body.push({tweet_text: tweetText})
        }
    }
    console.log(tweets_dict)
    fetch(`${BASE_URL}/api/language-detection`,{
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        body = []
        for (let res of data){
            if (res['is_english'] == true){
                body.push({tweet_text: res['tweet_text']})
            }
        }
        fetch(`${BASE_URL}/api/sentiment-score`,{
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            for (let res of data){
                detected_mood = res['detected_mood']
                let emoji = "<span>&#128528;</span>"
                if (detected_mood == 'POSITIVE'){
                    emoji = "<span>&#128522;</span>"
                }
                else if (detected_mood == 'Negative'){
                    emoji = "<span>&#9785;</span>"
                }
                const tweet  = tweets_dict[res['tweet_text']]
                if (tweet.id = ""){
                    if (tweet.parentNode.parentNode.parentNode.getElementsByTagName("time").length != 0){
                        let rootNode = tweet.parentNode.parentNode.getElementsByTagName("time")[0].parentNode.parentNode.parentNode;
                        const childNodes = rootNode.childNodes;
                        if (childNodes.length == 2){
                            const dot = childNodes[0].cloneNode(true);
                            const detectedMood = childNodes[0].cloneNode(true);
                            detectedMood.innerHTML = "Detected Mood: "+emoji;
                            rootNode.appendChild(dot);
                            rootNode.appendChild(detectedMood);
                        }
                    }
                }
                else{
                    if (tweet.parentNode.parentNode.parentNode.getElementsByTagName("time").length != 0){
                        let rootNode = tweet.parentNode.parentNode.parentNode.getElementsByTagName("time")[0].parentNode.parentNode.parentNode;
                        const childNodes = rootNode.childNodes;
                        if (childNodes.length == 3){
                            const dot = childNodes[1].cloneNode(true);
                            const detectedMood = childNodes[1].cloneNode(true);
                            detectedMood.innerHTML = "Detected Mood: "+emoji;
                            rootNode.appendChild(dot);
                            rootNode.appendChild(detectedMood);
                        }
                    }
                }
            }
        }) 
    })
}


addSentimentOfTweets();
