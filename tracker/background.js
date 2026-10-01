const allowedSites = ["vigilant-spoon-wvv745474x57cg95r.github.dev", "cs50", "ombplus", "ocw.mit.edu", "vorkurs.mathematik.tu-darmstadt"]; 
console.table(allowedSites); 

//chrome filters 
filter =  {"active": true, "currentWindow": true}; 

//Every 1min
const timer = chrome.alarms.create("timer", {"periodInMinutes": 1});
console.log(`tiemr set on: ${timer}\n`);


//check operation on alarm
chrome.alarms.onAlarm.addListener(async function(alarms){
    
    const apidict = await chrome.storage.local.get("api-key");
    const apiKey = apidict["api-key"];
    console.log(`in the Listener! found ${alarms.name}\n`)
    
    //check the current tabs
    chrome.tabs.query(filter, function(tabs){
            console.log("site is: ", tabs[0]); 
            const currenttab = tabs[0];
            if(!currenttab) return;  
            if(currenttab.url.includes("youtube.com") && currenttab.title?.toLowerCase().includes("cs50")) currenttab.url = "cs50";

            for (const site of allowedSites)
                {
                    if (currenttab.url.includes(site))
                    {
                        
                        console.log(`current tab check: ${currenttab["url"]}\n site is: ${site} `);
                        fetch(
                            "https://mostafa-0332d148cf7e.herokuapp.com/api/save",{
                                "method": "POST", 
                                "headers": {
                                    "Content-Type": "application/json",
                                    "API-KEY": apiKey,  
                                },
                                "body": JSON.stringify(currenttab)
                            }
                            ); 
                        return true; 
                    }
                } 
    });
});







