// based on https://blog.mounirmesselmeni.de/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/

function readCsvFile(files) {
    if (window.FileReader && window.Blob) {
        var reader = new FileReader();
        reader.readAsText(files.files[0]);
        reader.onload = loadHandler;
        reader.onerror = errorHandler;
    } else {
        alert('FileReader is not supported in this browser!');
    }
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Can't read file!");
    }
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = [];
        for (var j = 0; j < data.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }

    lines.forEach(function(lines2) {
        setDotToAddress(lines2[0], lines2[1], lines2[2], lines2[3]);
    })
}
