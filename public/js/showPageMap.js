mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/boxunli/cko4n5b7z1dus17n1ax1v53iw', // style URL
    center: arcade.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
        
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(arcade.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4 class="mt-3"> ${arcade.title}</h4><p>${arcade.location}</p>`
        )
    )
    .addTo(map)