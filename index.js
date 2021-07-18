// based on the OSM & OL example code provided by https://mediarealm.com.au/

var map;
var mapLat = -33.829357;
var mapLng = 150.961761;
var mapDefaultZoom = 20;

// the main method of the program
function init_program() {
    get_location_from_address("detmolder straße", "1", "bielefeld");
    get_location_from_address("detmolder straße", "2", "bielefeld");
    get_location_from_address("detmolder straße", "3", "bielefeld");

    initialize_map(-33.8688, 151.2093);
}

function get_location_from_address(street, nr, city) {
    var data = doRequest(street, nr, city);
}

function doRequest(street, nr, city) {
    const url = "http://nominatim.openstreetmap.org/search?q="+ nr +"+"+ street +"+"+ city +"&format=json&polygon=1&addressdetails=1";
    const Http = new XMLHttpRequest();

    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        // only do something if the response is not empty
        if (Http.responseText) {
            console.log(Http.responseText);
            var parsedData = JSON.parse(Http.responseText);
            const lat = parsedData[0].lat;
            const lng = parsedData[0].lon;
            add_map_point(lat, lng);
        }
    }
}

function initialize_map(mapLat, mapLng) {
    map = new ol.Map({
    target: "map",
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                  url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([mapLng, mapLat]),
        zoom: mapDefaultZoom
    })
  });
}

function add_map_point(lat, lng) {
    var vectorLayer = new ol.layer.Vector({
        source:new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
            })]
        }),

        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
            })
        })
    });

    map.addLayer(vectorLayer); 
}
