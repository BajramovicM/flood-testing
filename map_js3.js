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

    // helper function to create a symbol
    function createSymbol(color) {
      return {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: color,
        outline: {
          width: 0.5,
          color: [255, 255, 255, 0.4]
        },
        style: "solid"
      };
    }

    /*****************************************************************
     * Create renderers for each block groups sublayer
     *****************************************************************/
    var rndrFloodHazardZones = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        defaultSymbol: null,
        defaultLabel: null,
        field: "FLD_ZONE",
        field2: "ZONE_SUBTY",
        field3: null,
        uniqueValueInfos: [{
          value: "AE", // code for interstates/freeways
          label: "1% Annual Chance Flood Hazard",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "solid",
            color: [0, 230, 255, 255],
            outline: { // autocasts as new SimpleLineSymbol()
              style: "solid",
              color: [0, 0, 0, 0],
              width: "1"
            }
          }
        }, {
          value: "AE;1 PCT CONTAINED IN STRUCTURE, COMMUNITY ENCROACHMENT", // code for interstates/freeways
          label: "Regulatory Floodway",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "backward-diagonal",
            color: [255, 0, 0, 255]
          }
        }, {
          value: "AE;AREA OF SPECIAL CONSIDERATION", // code for interstates/freeways
          label: "Special Floodway",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "solid",
            color: [255, 0, 0, 255]
          }
        }, {
          value: "D", // code for interstates/freeways
          label: "Area of Undetermined Flood Hazard",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "solid",
            color: [242, 230, 115, 255],
            outline: { // autocasts as new SimpleLineSymbol()
              style: "solid",
              color: [0, 0, 0, 0],
              width: "1"
            }
          }
        }, {
          value: "X;0.2 PCT ANNUAL CHANCE FLOOD HAZARD IN COASTAL ZONE", // code for interstates/freeways
          label: "0.2% Annual Chance Flood Hazard",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "solid",
            color: [255, 128, 0, 255],
            outline: { // autocasts as new SimpleLineSymbol()
              style: "solid",
              color: [0, 0, 0, 0],
              width: "1"
            }
          }
        }, {
          value: "X;1 PCT FUTURE CONDITIONS", // code for interstates/freeways
          label: "Future Conditions 1% Annual Chance Flood Hazard",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "solid",
            color: [0, 0, 0, 255]
          }
        }, {
          value: "X;AREA WITH REDUCED FLOOD RISK DUE TO LEVEE", // code for interstates/freeways
          label: "Area with Reduced Risk Due to Levee",
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            style: "backward-diagonal",
            color: [0, 0, 0, 255]
          }
        }, ]
      }

    var renderLORMs = {
      type: 'uniqueValue',
      field1: 'STATUS',
      field2: null,
      field3: null,
      defaultSymbol: null,
      defaultLabel: null,
      uniqueValueInfos: [
        {
          symbol: {
            type: 'esriSFS',
            style: 'esriSFSSolid',
            color: [
              0,
              0,
              0,
              0
            ],
            outline: {
              type: 'esriSLS',
              style: 'esriSLSSolid',
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
    }
    /*****************************************************************
     * Create a MapImageLayer instance with three sublayers pointing
     * to a single map service layer. Each layer uses the same data
     * but dynamically renders the data differently for each layer.
     *****************************************************************/

    var layer = new FeatureLayer({
      url: "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer",
      title: "Fema hazards",
      sublayers: [{
        id: 1,
        title: "LOMAs",
        renderer: renderLORMs,
        visible: true,
        labelingInfo: [
          {
            labelPlacement: 'esriServerPolygonPlacementAlwaysHorizontal',
            where: null,
            labelExpression: '"LOMR " CONCAT [CASE_NO] CONCAT  NEWLINE  CONCAT "eff. " CONCAT [EFF_DATE]',
            useCodedValues: true,
            symbol: {
              type: 'esriTS',
              color: [
                0,
                92,
                230,
                255
              ],
              backgroundColor: null,
              borderLineColor: null,
              borderLineSize: null,
              verticalAlignment: 'bottom',
              horizontalAlignment: 'center',
              rightToLeft: false,
              angle: 0,
              xoffset: 0,
              yoffset: 0,
              kerning: true,
              haloColor: [
                254,
                254,
                254,
                255
              ],
              haloSize: 1,
              font: {
                family: 'Arial',
                size: 9,
                style: 'normal',
                weight: 'bold',
                decoration: 'none'
              }
            },
            minScale: 0,
            maxScale: 0
          }
        ],
        // points to the block groups layer
        source: {
          mapLayerId: 1
        }
      }]      
    });

    /*****************************************************************
     * Add the layer to a map
     *****************************************************************/

    var map = new Map({
      basemap: "hybrid",
      layers: [layer]
    });

    layerA = layer;

    var view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 4,
      center: [-122.436, 37.764]
    });

    var legend = new Legend({
      view: view
    });

    view.ui.add(legend, "bottom-left");
    view.ui.add("info-div", "top-right");
var print = new Print({
        view: view,
        printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
        
      });
      //view.ui.add(print, "top-right");
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