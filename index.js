const asin = (a) => {return Math.asin(a)};
const acos = (a) => {return Math.acos(a)};
const sin = (a) => {return Math.sin(a * Math.PI / 180)};
const cos = (a) => {return Math.cos(a * Math.PI / 180)};


//app.get("/get-altaz-from-radec-deg/:ra/:dec/:lat/:lon/:time", (req, res) => {
function getAltazFromRadecDeg(ra, dec, lat, lon, time){
    var answer = convert(ra, dec, lat, lon, time);
    return answer;
};

//app.get("/get-altaz-from-radec-dms/:ra/:dec/:lat/:lon/:time", (req, res) => {
function getAltazFromRadecDms(ra, dec, lat, lon, time){
    var answer = convert(ra, dec, lat, lon, time);
    answer['alt'] = degreesToDms(answer['alt']);
    answer['az'] = degreesToDms(answer['az']);
    return answer;
};

function convert(ra, dec, lat, lon, time){
    time = new Date(time)
    const J2000Date = new Date('January 1, 2000 12:00:00').getTime();
    const diff = time.getTime() - J2000Date;
    const d = diff / (1000 * 60 * 60 * 24);
    var hours = time.getUTCHours();
    var minutes = time.getUTCMinutes();
    var seconds = time.getUTCSeconds();
    var ms = time.getUTCSeconds();
    var utc = (hours * (1000 * 60 * 60) + minutes * (1000 * 60) + seconds * 1000 + ms) / (1000 * 60 * 60 * 24) * 360;//(now.getTime() - beginning.getTime()) / (1000 * 60 * 60 * 24) * 360;
    var lst = 100.46 + (0.985647 * d) + lon + utc;
    if(lst > 360){
        while(lst > 360){
            lst -= 360;
        }
    } else if(lst < 0){
        while(lst < 0){
            lst += 360;
        }
    }
    var ha = lst - ra
    if (ha < 0) {ha += 360}
    var alt = asin(sin(dec)*sin(lat)+cos(dec)*cos(lat)*cos(ha)) * (180 / Math.PI);
    var a = acos((sin(dec) - sin(alt) * sin(lat)) / (cos(alt) * cos(lat))) * (180 / Math.PI)
    var az = 0;
    if(sin(ha) < 0){
        az = a;
    } else {
        az = 360 - a;
    }
    return { 
        "alt": alt,
        "az": az
    }
}

function degreesToDms(val) {
    var deg = Math.floor(val);
    var leftover = val - deg;
    var minutes = Math.floor(leftover * 60);
    leftover = leftover - (minutes / 60);
    var seconds = Math.floor(leftover * 3600 * 100) / 100;
    return [deg, minutes, seconds]
}