
var hydrantIcon = L.icon({
    iconUrl: 'hydrant-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

var tankIcon = L.icon({
    iconUrl: 'tank-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

var purifierIcon = L.icon({
    iconUrl: 'purifier-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

var valveIcon = L.icon({
    iconUrl: 'valve-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});


var map = L.map('map').setView([12.988283, 79.972456], 15);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


var drawControl = new L.Control.Draw({
    edit: false,
    draw: {
        polygon: false,
        polyline: {
            shapeOptions: {
                color: 'blue',
            },
            allowIntersection: true,
            showLength: true,
            metric: true,
        },
        rectangle: false,
        circle: false,
        circlemarker: false,
    },
});
map.addControl(drawControl);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var hydrantLayer = new L.LayerGroup();
var tankLayer = new L.LayerGroup();
var purifierLayer = new L.LayerGroup();
var valveLayer = new L.LayerGroup();
var pipeLayer = new L.LayerGroup();

map.addLayer(hydrantLayer);
map.addLayer(tankLayer);
map.addLayer(purifierLayer);
map.addLayer(valveLayer);
map.addLayer(pipeLayer);

var currentComponent = null;
var addedComponentIds = {}; 

var pipeCoordinates = [];

map.on('draw:created', function (e) {
    var layer = e.layer;

    if (layer instanceof L.Polyline) {
        var latLngs = layer.getLatLngs();

        if (latLngs.length === 2) {
            var startCoordinates = latLngs[0];
            var endCoordinates = latLngs[1];

            console.log('Start Coordinates:', startCoordinates);
            console.log('End Coordinates:', endCoordinates);

            pipeCoordinates.push({ start: startCoordinates, end: endCoordinates });

            drawnItems.addLayer(layer);
            savePipeToDatabase(pipeCoordinates);
        } else {
            console.error('Pipe must consist of exactly two points.');
        }
    }
});


map.on('click', function (e) {
    if (currentComponent) {
        
        var componentId = document.getElementById('componentId').value;

       
        if (!componentId.trim()) {
            alert('Component ID is required. Please enter a valid ID.');
            return; 
        }

      
        if (addedComponentIds[componentId]) {
            alert('Component with the same ID already exists. Not adding a duplicate.');
            return; 
        }

        
        var componentMarker;
        switch (currentComponent) {
            case 'hydrant':
                componentMarker = L.marker(e.latlng, { icon: hydrantIcon });
                hydrantLayer.addLayer(componentMarker);
                break;
            case 'tank':
                componentMarker = L.marker(e.latlng, { icon: tankIcon });
                tankLayer.addLayer(componentMarker);
                break;
            case 'purifier':
                componentMarker = L.marker(e.latlng, { icon: purifierIcon });
                purifierLayer.addLayer(componentMarker);
                break;
            case 'valve':
                componentMarker = L.marker(e.latlng, { icon: valveIcon });
                valveLayer.addLayer(componentMarker);
                break;
            default:
                break;
        }

        
        if (componentMarker) {
            addedComponentIds[componentId] = true;

            
            console.log(`${currentComponent} Coordinates:`, e.latlng);
            console.log('Component ID:', componentId);

            
            saveComponentToDatabase(currentComponent, e.latlng, componentId);
        }
    }
});


function setCurrentComponent(componentType) {
    currentComponent = componentType;
}


document.getElementById('addComponentForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

   
    var selectedComponent = document.getElementById('type').value;

    
    if (selectedComponent === 'pipe') {
        
        currentComponent = 'pipe';
        map.addControl(drawControl);
       
    } else {
        
        setCurrentComponent(selectedComponent);
        var componentId = document.getElementById('componentId').value;
        console.log('Selected Component:', selectedComponent);
        console.log('Component ID:', componentId);
    }

   
});






// Function to save water component coordinates and ID to the database (You should implement this part)
function saveComponentToDatabase(componentType, coordinates, componentId) {
    // Implement the database saving logic here
    // Example:
    // var component = new ComponentModel({ type: componentType, coordinates: coordinates, id: componentId });
    // component.save(); // Save the component data to your database
}

// Function to save pipe coordinates to the database (You should implement this part)
function savePipeToDatabase(coordinates) {
    // Implement the database saving logic here
    // Example:
    // var pipe = new PipeModel({ coordinates: coordinates });
    // pipe.save(); // Save the pipe data to your database
}
 //Define the grievance icon
var grievanceIcon = L.icon({
    iconUrl: 'grivence.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

// Define grievance data with coordinates and complaint ID
var grievanceData = [
    { lat: 12.987, lng: 79.972, complaintId: '123' },
    { lat: 12.988589, lng: 79.97136, complaintId: '23'},
    {lat: 12.98833, lng: 79.97267, complaintId:'56'},
    {lat: 12.98845, lng: 79.9724, complaintId:'121'}    // Add more data as needed
];

// Add grievance markers to the map with popups
grievanceData.forEach(function (data) {
    var marker = L.marker([data.lat, data.lng], { icon: grievanceIcon }).addTo(map);

    // Create a popup with coordinates and complaint ID
    var popupContent = `
        <strong>Location:</strong> ${data.lat}, ${data.lng}<br>
        <strong>Complaint ID:</strong> ${data.complaintId}
    `;

    // Add the popup to the marker
    marker.bindPopup(popupContent);

    // Define popup behavior
    marker.on('mouseover', function () {
        this.openPopup();
    });

    marker.on('mouseout', function () {
        this.closePopup();
    });
});




// Define tank data with coordinates, tank ID, and capacity
var tankData = [
    {lat: 12.988172378935182, lng: 79.971065998142, tankId: '3', capacity: '20,000 L' },
    {lat: 12.98847429838, lng: 79.97438429838, tankId: '5', capacity: '15,000 L' },
    // Add more data as needed
];

// Add tank markers to the map with popups
tankData.forEach(function (data) {
    var marker = L.marker([data.lat, data.lng], { icon: tankIcon }).addTo(map);

    // Create a popup with tank information
    var popupContent = `
        <strong>Type:</strong> Tank<br>
        <strong>Tank ID:</strong> ${data.tankId}<br>
        <strong>Capacity:</strong> ${data.capacity}
    `;

    // Add the popup to the marker
    marker.bindPopup(popupContent);

    // Define popup behavior
    marker.on('mouseover', function () {
        this.openPopup();
    });

    marker.on('mouseout', function () {
        this.closePopup();
    });
});

// Define pipe data with coordinates, pipe ID, diameter, and length
var pipeData = [
    {lat1: 12.988172378935182, lng1: 79.971065998142, lat2: 12.9881013087559, lng2: 79.97199726130931, pipeId: 'P001', diameter: '800mm', length: '102 meters' },
    { lat1: 12.9881013087559, lng1: 79.97199726130931, lat2: 12.988807831091236, lng2: 79.97209167493565, pipeId: 'P002', diameter: '800mm', length: '185 meters' },
    { lat1: 12.988807831091236, lng1: 79.97209167493565, lat2: 12.988791108628165, lng2: 79.97379541429838, pipeId: 'P003', diameter: '800mm', length: '370 meters' },
    { lat1: 12.988791108628165, lng1: 79.97379541429838, lat2: 12.98847429838, lng2: 79.9743429838, pipeId: 'P004', diameter: '800mm', length: '435 meters' },
    // Add more pipe data as needed
];

// Create yellow polylines for the pipes and add popups with information
pipeData.forEach(function (data) {
    var pipeCoordinates = [
        [data.lat1, data.lng1],
        [data.lat2, data.lng2]
    ];

    var pipe = L.polyline(pipeCoordinates, { color: 'orange' }).addTo(map);

    // Create a popup with pipe information
    var popupContent = `
        <strong>Pipe ID:</strong> ${data.pipeId}<br>
        <strong>Diameter:</strong> ${data.diameter}<br>
        <strong>Length:</strong> ${data.length}
    `;

    // Add the popup to the pipe
    pipe.bindPopup(popupContent);

    // Define popup behavior
    pipe.on('mouseover', function () {
        this.openPopup();
    });

    pipe.on('mouseout', function () {
        this.closePopup();
    });
});

// Fit the map to the bounds of the pipes
map.fitBounds(pipeData.map(function (data) {
    return [[data.lat1, data.lng1], [data.lat2, data.lng2]];
}));

// Define additional pipe data for red pipes
var additionalRedPipeData = [
    {
        lat1: 12.98821104570188, lng1: 79.97464728348861,
        lat2: 12.986425560039274, lng2: 79.97217857840954,
        diameter: '200mm',
        length: '75 meters'
    },
    {
        lat1: 12.987074180762704, lng1: 79.97306907212989,
       lat2: 12.989480991366603, lng2: 79.97068083332125,
        diameter: '200mm',
        length: '150 meters'
    },
    {
        lat1: 12.986425560039274, lng1: 79.97217857840954,
       lat2: 12.98676337335111, lng2: 79.96924960616526,
        diameter: '200mm',
        length: '50 meters'
    }
];

// Create red polylines for the additional red pipes and add popups with information
additionalRedPipeData.forEach(function (data) {
    var pipeCoordinates = [
        [data.lat1, data.lng1],
        [data.lat2, data.lng2]
    ];

    var redPipe = L.polyline(pipeCoordinates, { color: 'red' }).addTo(map);

    // Create a popup with red pipe information
    var popupContent = `
        <strong>Diameter:</strong> ${data.diameter}<br>
        <strong>Length:</strong> ${data.length}
    `;

    // Add the popup to the red pipe
    redPipe.bindPopup(popupContent);

    // Define popup behavior
    redPipe.on('mouseover', function () {
        this.openPopup();
    });

    redPipe.on('mouseout', function () {
        this.closePopup();
    });
});



// Define valve data with coordinates, valve ID, and other information
var valveData = [
    {
        lat: 12.987042402519501,
        lng: 79.97308462858201,
        valveId: '7',
        type: 'Valve',
        status: 'Open',
    },
    // Add more data as needed
];

// Add valve markers to the map with popups
valveData.forEach(function (data) {
    var marker = L.marker([data.lat, data.lng], { icon: valveIcon }).addTo(map);

    // Create a popup with valve information
    var popupContent = `
        <strong>Type:</strong> ${data.type}<br>
        <strong>Valve ID:</strong> ${data.valveId}<br>
        <strong>Status:</strong> ${data.status}
    `;

    // Add the popup to the marker
    marker.bindPopup(popupContent);

    // Define popup behavior
    marker.on('mouseover', function () {
        this.openPopup();
    });

    marker.on('mouseout', function () {
        this.closePopup();
    });
});

