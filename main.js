"use strict";
const slider1 = document.getElementById("slider-1");
const sliderOutput1 = document.getElementById("slider-output-1");
const slider2 = document.getElementById("slider-2");
const sliderOutput2 = document.getElementById("slider-output-2");
const yearInput = document.getElementById("yearInput")

// window.onload = init;
// function init() {

  const map = new ol.Map({
    view: new ol.View({
      projection: "EPSG:4326",
      center: [17.5, 41.9],
      zoom: 5,
      maxZoom: 9,
      minZoom: 1,
      extent: [-180, -90, 180, 90],
    }),
    layers: [
      /*
			baseLayerGroup,
			overLayerGroup,
			drawLayer
			*/
    ],
    target: "map",
    controls: ol.control.defaults({ attribution: false, zoom: false }),
  });

  // map.on("click", function () {
  //   console.log(map.getSize());
  // });
  
  // fixing map width //
  function checkExtent() {
    function mapExtent() {
      let mapWidth = map.getSize()[0];
      if (mapWidth >= 1026) {
        return [-180, -90, 180, 90]
      } else if (mapWidth >= 515 && mapWidth < 1026) {
        return [-180, -90, 180, 90]
      }
    }
    // console.log(map.getView().calculateExtent(map.getSize()));
    if (
      map.getView().calculateExtent(map.getSize())[0] <= -250 ||
      map.getView().calculateExtent(map.getSize())[2] >= 250
    ) {
      map.getView().fit(mapExtent(), { duration: 1000, padding:[0,0,0,0] });
  }}
  setInterval(checkExtent, 3000);
  checkExtent();
  //

  // Basemaps Layers //

  const googleSatellite = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      attributions: "Map data ©2020 Google",
    }),
    visible: false,
    title: "googleSatellite",
  });
  const esriWorldImagery = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attributions:
        'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer">ArcGIS</a>',
    }),
    visible: false,
    title: "esriWorldImagery",
  });
  const esriWorldTerrainBase = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        "https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
      attributions:
        'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer">ArcGIS</a>',
    }),
    visible: false,
    title: "esriWorldTerrainBase",
    maxZoom: 9,
  });

  // Overlay Map Layers //
  const esriWorldHillshadeLight = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
      attributions:
        'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer">ArcGIS</a>',
    }),
    visible: false,
    title: "esriWorldHillshadeLight",
    maxZoom: 13,
  });
  const esriWorldHillshadeDark = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}",
      attributions:
        'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer">ArcGIS</a>',
    }),
    visible: false,
    title: "esriWorldHillshadeDark",
  });
  const esriWorldOceanBase = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        "https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
      attributions:
        'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer">ArcGIS</a>',
    }),
    visible: true,
    title: "esriWorldOceanBase",
  });

  // Layer Group

  const overLayerGroup = new ol.layer.Group({
    layers: [googleSatellite, esriWorldImagery, esriWorldTerrainBase],
    zIndex: 200,
    opacity: 0.75,
    extent: [-180, -90, 180, 90],
  });
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      esriWorldHillshadeLight,
      esriWorldHillshadeDark,
      esriWorldOceanBase,
    ],
    zIndex: 100,
    opacity: 1,
    extent: [-180, -90, 180, 90],
  });
  map.addLayer(baseLayerGroup);
  map.addLayer(overLayerGroup);

  // overLayerGroup.setOpacity(overOpacity)
  // baseLayerGroup.setOpacity(baseOpacity)

  $("#slider-1").slider({
    min: 0,
    max: 100,
    value: 75,
    slide: function (event, e) {
      overLayerGroup.setOpacity(e.value / 100);
      sliderOutput1.innerHTML = e.value / 100;
    },
  });
  $("#slider-2").slider({
    min: 0,
    max: 100,
    value: 100,
    slide: function (event, e) {
      baseLayerGroup.setOpacity(e.value / 100);
      sliderOutput2.innerHTML = e.value / 100;
    },
  });

  // Layer switcher for Overlays
  const overLayerElements = document.querySelectorAll(
    ".sidebar-1 > .content-1 > .layer-list > input[type=radio]"
  );
  for (let overLayerElement of overLayerElements) {
    overLayerElement.addEventListener("change", function () {
      let overLayerElementValue = this.value;
      overLayerGroup.getLayers().forEach(function (element, index, array) {
        let overLayerTitle = element.get("title");
        element.setVisible(overLayerTitle === overLayerElementValue);
      });
    });
  }

  // Layer Switcher for Basemaps
  const baseLayerElements = document.querySelectorAll(
    ".sidebar-2 > .content-2 > .layer-list > input[type=radio]"
  );
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get("title");
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });
  }

  //// Map Interactions ////

  // Drag and drop //

  var dragSource = new ol.source.Vector();
  var dragLayer = new ol.layer.Vector({
    source: dragSource,
  });
  map.addLayer(dragLayer);
  var dragnDrop = new ol.interaction.DragAndDrop({
    formatConstructors: [ol.format.GeoJSON],
    source: dragSource,
  });
  dragnDrop.on("addfeatures", function (evt) {
    console.log("new feature added");
  });
  // const addDrag = function(){map.addInteraction(dragnDrop)}
  // const removeDrag = function(){map.removeInteraction(dragnDrop)}
  // Drag Box //

  // var dragBox = new ol.interaction.DragBox({})
  // map.getView().fit(dragBox.getGeometry().getExtent() , map.getsize())
  // map.addInteraction(dragBox)

  // Draw Interaction //
  var drawSource = new ol.source.Vector();
  var drawLayer = new ol.layer.Vector({
    source: drawSource,
  });
  map.addLayer(drawLayer);

  var draw1 = new ol.interaction.Modify({
    source: drawSource,
  });
  var draw2 = new ol.interaction.Draw({
    source: drawSource,
    type: "Point",
  });
  var draw3 = new ol.interaction.Draw({
    source: drawSource,
    type: "LineString",
  });
  var draw4 = new ol.interaction.Draw({
    source: drawSource,
    type: "Circle",
  });
  var draw5 = new ol.interaction.Draw({
    source: drawSource,
    type: "Polygon",
  });
  var draw6 = new ol.interaction.Draw({
    source: drawSource,
    type: "MultiPoint",
  });
  var draw7 = new ol.interaction.Draw({
    source: drawSource,
    type: "MultiLineString",
  });
  var draw8 = new ol.interaction.Draw({
    source: drawSource,
    type: "MultiPolygon",
  });
  var draw9 = new ol.interaction.Draw({
    source: drawSource,
    type: "GeometryCollection",
  });


// File Download //


  function downloadasTextFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

  const format = new ol.format.GeoJSON({featureProjection: 'EPSG:3857'});
  const download = document.getElementById('saveDraw');
  drawSource.on('change', function() {
    const features = drawSource.getFeatures();
    const json = format.writeFeatures(features);
    $('#json-val').val(json)
    console.log(json)
  });

  $("#saveDraw").on("click", function(){
    const text = $("#json-val").val();
    const filename = "features.geojson";
    // console.log(text)
    downloadasTextFile(filename, text);
});

// saveDraw downloads all drawings //









  const clearDraw = function () {
    drawSource.clear();
  };
// clearDraw clears all drawings //
  const clearGeo = function () {
    dragSource.clear();
  };
// clearGeo clears geoJSON shapes //
  const clearDrawBtn = document.getElementById("clearDraw");
  const clearGeoJSONBtn = document.getElementById("geoClear");
  clearDrawBtn.onclick = clearDraw;
  clearGeoJSONBtn.onclick = clearGeo;

  $(document).on("click", ".button-2", function (e) {
    $(".button-2").toggleClass("clicked");
    e.preventDefault();
    if ($(".button-2").hasClass("clicked")) {
      $("input[name=drawLayerRadioButton]").attr("disabled", true);
      map.addInteraction(dragnDrop);
      // console.log("clicked" + " " + map.getInteractions().array_.length)
    } else if (!$(".button-2").hasClass("clicked")) {
      $("input[name=drawLayerRadioButton]").attr("disabled", false);
      map.removeInteraction(dragnDrop);
      // console.log("not clicked" + " " + map.getInteractions().array_.length)
    }
  });
  // console.log(map.getInteractions().array_.length)

  draw1.on("drawend", function (evt) {
    // console.log((evt.feature.getGeometry().flatCoordinates))
  });
  draw2.on("drawend", function (evt) {
    // console.log(evt.feature.getGeometry().flatCoordinates)
  });

  const drawInput = document.querySelectorAll(
    ".sidebar-3 > .content-3 > .layer-list > input[type=radio]"
  );
  const drawInputArray = Array.from(drawInput);
  var filtered = drawInputArray.filter(function (value, index, arr) {
    return index != 0;
  });
  // give certain elements a class that will be disabled for a function
  for (var i = 0; i < filtered.length; i++) {
    filtered[i].classList.add("Disable-3");
  }
  document.getElementsByClassName("button-2")[0].classList.add("Disable-3");
  // console.log($(".Disable-3"))
  //

  // console.log(intNum)
  // console.log(map.getInteractions().a.length - 1)

  for (let i = 0; i < drawInput.length; i++) {
    drawInput[i].addEventListener("change", function () {
      if (drawInput[i].value == 0) {
        map.removeInteraction(
          map.getInteractions().a[map.getInteractions().a.length - 1]
        );
        $(".Disable-3").attr("disabled", false);
      } else if (drawInput[i].value == 1) {
        map.addInteraction(draw1);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 2) {
        map.addInteraction(draw2);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 3) {
        map.addInteraction(draw3);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 4) {
        map.addInteraction(draw4);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 5) {
        map.addInteraction(draw5);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 6) {
        map.addInteraction(draw6);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 7) {
        map.addInteraction(draw7);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 8) {
        map.addInteraction(draw8);
        $(".Disable-3").attr("disabled", true);
      } else if (drawInput[i].value == 9) {
        map.addInteraction(draw9);
        $(".Disable-3").attr("disabled", true);
      }
    });
  }






  // History Maps //

    
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'images/battleicon2.png',
      opacity: 1,
      scale: .25,
    }),
  });
  $.ajax({
    method:'GET',
    url: 'https://gist.githubusercontent.com/agiano/a5884511d0bce4e3aec0476b6b815ad4/raw/6d88b4f21a9f721a6b768ace8b71891068633543/wddb_battles.geojson',
    dataType: 'json',
  }).done(function(data){
    // console.log(data);
  const geoJsonObject = data

// Select data by Year    

  const vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(geoJsonObject),
  })
  const vectorData = new ol.layer.Vector({
    source: vectorSource,
    extent: [-180, -90, 180, 90],
    style: iconStyle,
  })

// Check if checkboxes are checked //
$('#battles-cbox').on('click', function (){
  if ($('#battles-cbox').prop('checked') === true){
    console.log('battles are checked')
    map.addLayer(vectorData)
  } else if ($('#battles-cbox').prop('checked') === false){
    console.log('battles are not checked')
    map.removeLayer(vectorData)
  }
})
  
  // map.addLayer(vectorData)

  map.getView().on("change:resolution", function(e){
    let curZoom = map.getView().getZoom()
    if (curZoom >= 7){vectorData.C.M.a = curZoom/20}
    else if (curZoom <7 && curZoom > 4){vectorData.C.M.a = curZoom/35}
    else if (curZoom <=4 && curZoom >= 0){vectorData.C.M.a = curZoom/50}
    // console.log(curZoom)
    // console.log(vectorData.C.M.a)
  })
  }); // end of ajax data
  
  

  


  // $(yearInput).on("change", function(){
  //   if (yearInput.value = 300){
      
  //   }
  // })







// }  end of window.load //












// Toggle Show/Hide Tabs //

document.getElementsByClassName(
  "title-1"
)[0].onclick = function displayToggle1() {
  var x = document.getElementsByClassName("content-1")[0];
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};
document.getElementsByClassName(
  "title-2"
)[0].onclick = function displayToggle2() {
  var x = document.getElementsByClassName("content-2")[0];
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};
document.getElementsByClassName(
  "title-3"
)[0].onclick = function displayToggle3() {
  var x = document.getElementsByClassName("content-3")[0];
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};
document.getElementsByClassName(
  "title-4"
)[0].onclick = function displayToggle3() {
  var x = document.getElementsByClassName("content-4")[0];
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};

$(".menu-container-1").click(function(){
  $(".grid-1").toggleClass("hidden")
  $(".grid-1").toggleClass("block")
  $(".menu-container-2").toggleClass("hidden")
  $(".menu-container-2").toggleClass("block")
})
$(".menu-container-2").click(function(){
  $(".grid-1").toggleClass("hidden")
  $(".grid-1").toggleClass("block")
  $(".menu-container-2").toggleClass("hidden")
  $(".menu-container-2").toggleClass("block")
})

$("#showDraw").click(function () {
  $("#json-val").toggleClass("hidden");
  if ($("#json-val").hasClass("hidden") === true){
    $("#showDraw").html("Show Drawing Text")
    // console.log("show")
  }
  $("#json-val").toggleClass("block");
  if ($("#json-val").hasClass("block") === true){
    $("#showDraw").html("Hide Drawing Text")
    // console.log("hide")
  }
});
//

// Show Coordinates on info tab
