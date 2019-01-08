require([
    "esri/Map",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend",
    "esri/widgets/Print",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
  ], function(
    Map, MapImageLayer, Legend, Print, MapView, FeatureLayer
  ) {

    /*****************************************************************
     * Create a MapImageLayer instance with three sublayers pointing
     * to a single map service layer. Each layer uses the same data
     * but dynamically renders the data differently for each layer.
     *****************************************************************/

    var avbl = new FeatureLayer({
        url: "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/0"
    })

var lomasRndr = {
    type: 'unique-value',
    field1: 'STATUS',
    field2: null,
    field3: null,
    defaultSymbol: null,
    defaultLabel: null,
    uniqueValueInfos: [
      {
        symbol: {
          type: 'simple-fill',
          style: 'solid',
          color: [
            0,
            0,
            0,
            0
          ],
          outline: {
            type: 'simple-line',
            style: 'solid',
            color: [
              0,
              92,
              230,
              255
            ],
            width: 2
          }
        },
        value: 'Effective',
        label: 'Effective',
        description: ''
      }
    ],
    fieldDelimiter: ','
  };

    var lomas = new FeatureLayer({
        url: "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/1",
        renderer: lomasRndr
    })
    /*****************************************************************
     * Add the layer to a map
     *****************************************************************/

    var map = new Map({
      basemap: "hybrid",
      layers: [lomas]
    });

    layerA = lomas;

    var view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 4,
      center: [-122.436, 37.764]
    });

    var legend = new Legend({
      view: view,
      layerInfos: [{layer:lomas}]
    });

    view.ui.add(legend, "bottom-left");
    view.ui.add("info-div", "top-right");
    
    // var print = new Print({
    //     view: view,
    //     printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
        
    //   });
    //   view.ui.add(print, "top-right");
    
          view.when(function() {
      // set sublayer visibility depending on the selected layer
      document.getElementById("layer-select").addEventListener(
        "change",
        function(event) {
          var newValue = parseInt(event.target.value);
          layer.sublayers.forEach(function(sublayer) {
            sublayer.visible = (newValue === sublayer.id);
          });
        });
    });

  });