// based on the OSM & OL example code provided by https://mediarealm.com.au/

var map;
var mapLat = -33.829357;
var mapLng = 150.961761;
var mapDefaultZoom = 5;

// the main method of the program
function init_program() {
    initialize_map(51.0834196, 10.4234469);
}

function setDotToAddress(street, nr, city, color) {
    const url = "http://nominatim.openstreetmap.org/search?q="+ nr +"+"+ street +"+"+ city +"&format=json&polygon=1&addressdetails=1";
    const Http = new XMLHttpRequest();

    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        // only do something if the response is not empty
        if (Http.responseText) {
            console.log("Nominatim API response: "+ Http.responseText);
            var parsedData = JSON.parse(Http.responseText);

            var obj;
            var hasBuilding = false;
            for (var i = 0; i < parsedData.length; i++) {
                obj = parsedData[i];
                if ((obj.class == "building" || obj.class == "amenity") && (obj.address.city === city || obj.address.town === city || obj.address.village === city)) {
                    hasBuilding = true;
                    break;
                }
            }

            if (hasBuilding) {
                add_map_point(obj.lat, obj.lon, color);
            } else {
                for (var i = 0; i < parsedData.length; i++) {
                    obj = parsedData[i];
                    if (obj.class == "highway" && obj.address.city && (obj.address.city === city || obj.address.town === city)) {
                        add_map_point(obj.lat, obj.lon, color);
                    }
                }
            }
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

function add_map_point(lat, lng, color) {
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
                src: "dots/"+ color +".png", // https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg
                scale: 0.03,
            })
        })
    });

    map.addLayer(vectorLayer); 
}
