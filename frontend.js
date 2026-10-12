const TOTAL_TIME = 30;
let timeLeft = TOTAL_TIME; 

function fetchCategory(search, targetClass) {
    return fetch(`https://mostafa-0332d148cf7e.herokuapp.com/api/get?name=${search}`)
        .then(function(answer) { 
            return answer.json(); 
        })
        .then(function(data) {
            if (targetClass) {
                const el = document.querySelector(`.${targetClass}`); 
                if (el) el.textContent = data.minutes;
            }
            return data;
        })
        .catch(function(err) {
            console.error(`Error loading ${search}:`, err);
            return null;
        });
}

function update() {
    Promise.all([
        fetchCategory("cs50", "cs50"),
        fetchCategory("math", "math"),
        fetchCategory("java", "java"),
        fetchCategory("", null)
    ]).then(function([cs50, math, java, general]) {
        const latest = general || cs50 || math || java;
        if (!latest) return;

        const elst = document.getElementById("active-area");
        const stit = document.querySelector(".status-title");

        const isOnline = Boolean(latest.is_online);
        if (stit) stit.classList.toggle("is-live", isOnline);

        if (elst) {
            const rawName = (latest.name || "").toLowerCase();
            if (!isOnline || latest.name === "INAKTIV" || latest.name === "IDLE" || latest.name === "Uni" || latest.name === "University") {
                elst.textContent = "idle";
            } else if (rawName.includes("funktionale") || rawName.includes("java") || rawName.includes("mooc") || rawName.includes("fop")) {
                elst.textContent = "java";
            } else if (rawName.includes("cs50") || rawName.includes("vigilant-spoon")) {
                elst.textContent = "cs50";
            } else if (rawName.includes("math") || rawName.includes("omb") || rawName.includes("vorkurs") || rawName.includes("ocw")) {
                elst.textContent = "math";
            } else {
                elst.textContent = latest.name;
            }
        }
    });
}

function tick() {
    timeLeft = timeLeft - 1; 
    const timerel = document.getElementById("sync-timer"); 
    if (timerel) timerel.textContent = timeLeft;
    const fillel = document.querySelector(".sync-fill");
    if (fillel) {
        const percent = (timeLeft / TOTAL_TIME) * 100; 
        fillel.style.width = percent + "%";
    }
    if (timeLeft <= 0) {
        update();
        timeLeft = TOTAL_TIME; 
    }
}

update(); 
setInterval(tick, 1000);