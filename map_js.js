require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Print",
    "esri/widgets/LayerList",
    "esri/tasks/support/PrintTemplate",
    "esri/request"
  ], function(Map, MapView, TileLayer, FeatureLayer, Legend, Print, LayerList, PrintTemplate, esriRequest) {

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



    exportMap = function(){
        var print = new Print({
          view: view,
          printServiceUrl: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
          
        });
        view.ui.add(print, "top-right");
    }
    var createFeatureLayer = function(url, outFields) {
        return new FeatureLayer({
          url: url,
          outFields: outFields,
          });
      }
      var createhazaLayer = function(url, outFields) {
      return new FeatureLayer({
        url: url,
        outFields: outFields,
        renderer: rndrFloodHazardZones
        });
    }

    var createLegend = function(view) {
        var legend = new Legend({
          view: view,
          layerInfos: layerInfo
        });
        return legend;
    }

    var transportLayer = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"
      });

    const FLOOD_BASE_URL = "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"

    var floodLayer = createFeatureLayer(FLOOD_BASE_URL, ["*"]);
    var floodSublayerLOMRs = createFeatureLayer(FLOOD_BASE_URL + "/1", ["*"]);
    var floodSublayerFIRM = createFeatureLayer(FLOOD_BASE_URL + "/3", ["*"]);
    var floodSublayerBaseIndex = createFeatureLayer(FLOOD_BASE_URL + "/4", ["*"]);
    var floodSublayerElevations = createFeatureLayer(FLOOD_BASE_URL + "/16", ["*"]);
    var floodSublayerBoundaries = createFeatureLayer(FLOOD_BASE_URL + "/27", ["*"]);
    var floodSublayerLOMAs = createFeatureLayer(FLOOD_BASE_URL + "/2", ["*"]);
     var floodSublayerZones = createFeatureLayer(FLOOD_BASE_URL + "/28", "*");

    var subLayers = [
       // {
    // isActive: false,
    // displayName: "dsfsdfs",
    // name: floodLayer
    // },
//     {
//     isActive: false,
//     displayName: "LOMRs",
//     name: floodSublayerLOMRs
//     },
//         // This one works
//     {
//         isActive: false,
//         displayName: "FIRM Panels",
//         name: floodSublayerFIRM
//     },
//     //this one not showing
//     {
//         isActive: false,
//         displayName: "Base Index",
//         name: floodSublayerBaseIndex
//     },
//     //cant find it
//     {
//         isActive: false,
//         displayName: "Base Flood Elevations",
//         name: floodSublayerElevations
//     },
//     //This one is showing but legend not visible
//     {
//         isActive: false,
//         displayName: "Flood Hazard Boundaries",
//         name: floodSublayerBoundaries
//     },
//    // This one is not showing
//     {
//         isActive: false,
//         displayName: "Bla bla 1",
//         name: floodSublayerLOMAs
//     },
//     //Printing but not showing legend
    {
        isActive: false,
        displayName: "Bla bla bla 2",
        name: floodSublayerZones
    }
];

    //var layerInfo = [floodLayer, floodSublayerFIRM, floodSublayerBoundaries, floodSublayerZones];

    var layerInfo = [];

    subLayers.forEach(function (itm) {
        //itm.isActive = false;
        layerInfo.push({layer: itm.name});
    });

// console.log(layerInfo)

    

    var map = new Map({
      basemap: "hybrid",
      //layers: layerInfo
    });
    map.add(transportLayer);
    layerInfo.forEach(function (itm) {
        //itm.isActive = false;
        map.add(itm.layer);
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 4,
      center: [15, 65] // longitude, latitude
    });

    var legend = createLegend(view);

    // // console.log(legend);

    view.ui.add(legend, "bottom-left");

    //console.log(map)

    view.watch("scale", function(newScale){  
        console.log("scale: ", newScale);  
        });  


        // const layerList = new LayerList({
        //     view: view,
        //     listItemCreatedFunction: function(event) {
        //       const item = event.item;
        //       if (item.layer.type != "group") { // don't show legend twice
        //         item.panel = {
        //           content: "legend",
        //           open: true
        //         };
        //       }
        //       console.log(event.item)              
        //     }
        //   });
        //   view.ui.add(layerList, "top-right");
  });