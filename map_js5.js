    require([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/MapImageLayer",
      "esri/widgets/Legend",
      "esri/Basemap",
      "esri/views/MapView",
      "esri/widgets/Print",
      "esri/layers/TileLayer",
      "esri/core/watchUtils",
      "dojo/domReady!",
      
    ], function(
      Map, SceneView, MapImageLayer, Legend, Basemap, MapView, Print,TileLayer, watchUtils
    ) {
       
      var transportLayer = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"
      });

      var floodLayer = new MapImageLayer({
        url: "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer",
        
      });

    var requiredSublayers = [0,1,2,3,4,16,27,28]
    var sublayersRemoved = false;
    function removeSublayers(){
        for (i = floodLayer.sublayers.length - 1; i >= 0; --i) {
            if (!requiredSublayers.includes(floodLayer.sublayers.items[i].id)) {
                floodLayer.sublayers.items.splice(i, 1);
            }
          }
          sublayersRemoved = true;
    }

    layerA = floodLayer;

      

      /*****************************************************************
       * Add the layer to a map
       *****************************************************************/
    var map = new Map({
        basemap: "hybrid",
        layers: [floodLayer]
    });

      map.add(transportLayer);
     
    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 5,
        center: [-98, 39]
    });

    var legend = new Legend({
        view: view,
        layerInfos: [{layer: floodLayer}]
    });
    view.ui.add(legend, "bottom-left");
    view.ui.add("info-div", "top-right");

    exportMap = function(){
        var print = new Print({
          view: view,
          printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
          
        });
        view.ui.add(print, "top-right");
    }
        
view.whenLayerView(floodLayer).then(layerView => 
    watchUtils.whenFalse(layerView, "updating", () => {
        console.log("no way this works")
        if(floodLayer.loaded && !sublayersRemoved){
            removeSublayers();
        }
    }))
      view.when(function() {
        // set sublayer visibility depending on the selected layer
        $("input[type='checkbox']").on(
          "change",
          function(event) {
             var newValue = parseInt(event.target.value);
            floodLayer.sublayers.forEach(function(sublayer) {
                if(sublayer.id === newValue)
              sublayer.visible = $(event.target).is(":checked");
            });
          });
      });
    });