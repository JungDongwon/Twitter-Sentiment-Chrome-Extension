// server url 
BASE_URL = "https://myproject-415.wl.r.appspot.com"
// if server is running locally, use the url below instead.
// BASE_URL = "http://127.0.0.1:8080"

async function addSentimentOfTweets(){
    const tweets = document.querySelectorAll(`[data-testid="tweetText"]`);
    for (let tweet of tweets){
        const tweetText = tweet.innerText 
        if (tweetText == ""){
            continue
        }
        fetch(`${BASE_URL}/api/language-detection`,{
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tweet_text: tweetText})
        })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data['is_english'] == true){
                fetch(`${BASE_URL}/api/sentiment-score`,{
                    method: 'POST',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({tweet_text: tweetText})
                })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    detected_mood = data['detected_mood']
                    let emoji = "<span>&#128528;</span>"
                    if (detected_mood == 'POSITIVE'){
                        emoji = "<span>&#128522;</span>"
                    }
                    else if (detected_mood == 'Negative'){
                        emoji = "<span>&#9785;</span>"
                    }

                    if (tweet.id == ""){
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

                })
            }
        })

        
    }
}

addSentimentOfTweets();
