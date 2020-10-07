const xmlTextarea = document.getElementById("xml")
const namesTextarea = document.getElementById("names")
const extractBtn = document.getElementById("extract-btn")

let linksArray = []

extractBtn.onclick = () => {
    linksArray = []
    let xml = xmlTextarea.value
    xml = xml.trim()

    xml = xml.replace(/\/>/g, "/>\n")
    if (!xml.trim()) {
        alert("Please Enter or Copy text into Textbox")
        return
    }

    var myRegexp = /<outline text="[^">\/]+" title="[^">\/]+" type="rss" xmlUrl="([^">]+)" \/>/g
    var match = myRegexp.exec(xml)

    var c = 0
    while (match != null) {
        c++
        linksArray.push(match[1])
        match = myRegexp.exec(xml)
    }

    linksArray = linksArray.map((link) => {
        if (link.includes("=")) return link.split("=")[1]
    })
    linksArray = linksArray.slice(0, linksArray.length - 1)

    namesTextarea.value = "Loading...."

    fetch("https://yt-subscriber-extractor.firebaseio.com/channels.json", {
        method: "post",
        body: JSON.stringify({ names: linksArray }),
    })
        .then((res) => res.json())
        .then((data) => {
            let url =
                "https://yt-subscriber-extractor.firebaseio.com/channels/" +
                data.name +
                "/names.json"

            let scriptStr = `function main() {

                channels.forEach((channelName, index) => {
        
                    if(ind_sub == index && !window.location.href.includes(\`/channel/\${channelName}\`))
                    window.location.href = \`https://www.youtube.com/channel/\${channelName}\`

                    if(ind_sub == index && window.location.href.includes(\`/channel/\${channelName}\`)){
                        subscribe(channelName,index)
                        }      
                })
                
                 if (ind_sub == channels.length) {
                    localStorage.removeItem('ind_sub')
                    localStorage.removeItem('channels')
                 
                    
                    fetch("${url}",{
                      method:'delete'
                    }).then(res=>res.json())
                    .then(data=>{
                      console.log('Deleted Channel List from Server')
                      return
                    })
                    return
                    
                }
                }
                
                
                
                function subscribe(channelName,index){
                    if(document.querySelector("#contents"))
                    document.querySelector("#contents").style.display  = "none"
                            var subBtn = document.querySelector(
                                "paper-button.ytd-subscribe-button-renderer"
                            )
                           
                          
                                if (subBtn && subBtn.attributes[7].nodeValue.includes('Subscribe')) {
                                  console.log(subBtn.attributes[7].nodeValue)
                                  subBtn.click()
                                }
                                  
                       ind_sub++
                        localStorage.setItem("ind_sub",ind_sub)
                         
                }       
                       
                        var channels = []
                        
                
                if (!localStorage.getItem("ind_sub")) {
                    localStorage.setItem("ind_sub", 0)
                }
                
              
                var ind_sub = JSON.parse(localStorage.getItem("ind_sub"))
                
                        if(!JSON.parse(localStorage.getItem("channels"))){
                        fetch("${url}")
                        .then(res=>res.json())
                        .then(data=>{
                          if(data){
                          console.log("Downloaded Channel list from server")
                            channels = data
                            localStorage.setItem('channels',JSON.stringify(data))}
                            else{
                              console.log('Please Generate Script again')
                              return
                            }
                main()
                            
                        })}
                  else{
                    channels=JSON.parse(localStorage.getItem("channels"))
                    main()
                  }`

            namesTextarea.value = scriptStr
        })
}
