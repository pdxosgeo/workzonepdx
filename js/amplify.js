(function () {
  var SPREADSHEET_KEY = '1OGC0ecdyz4L2vTbt9USMarL0jHiBJvAYyVno6mnCe9s';
  var tpl = $('.social-tpl').clone();
  var clearTpl = $('.clearfix-tpl').clone();

  function loadWidgets(data, tabletop) {
    loadSocialGrid(data);
    loadMap(data);
  }

  function loadSocialGrid (posts) {
    var elements = posts;
    $('.social-tpl').remove();
    $('.clearfix-tpl').remove();
    $('.wtf-loading').remove();

    for (var i = 0; i < elements.length; i++) {
      addOembed(elements[i]);
      if ((i+1) % 3 == 0) {
        addClearfix();
      }
    }
  }

  function addOembed (str) {
    if (str.oembed !== "") {
      try {
        var oembed = JSON.parse(str.oembed);
        tpl.clone().html(oembed.html).appendTo('.social-grid');
      } catch (e) {
        throw Error(e);
      }
    }
  }

  function addClearfix () {
    clearTpl.clone().appendTo('.social-grid');
  }

  function loadMap (posts) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidHdlbGNoIiwiYSI6Il9pX3dtb3cifQ.YcYnsO0X2p3x0HpHPFfleg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/twelch/cilopb569001wa7ltp230rzkf',
      center: [-122.667040, 45.513421],
      zoom: 10.5,
    });

    map.on('style.load', function(){
      //Create collection of post points
      var postPoints = [];
      posts.forEach(function(post) {
        if (post.longitude && post.latitude) {
          var postPoint = turf.point([
            parseFloat(post.longitude), 
            parseFloat(post.latitude)
          ], {
            oembed: JSON.parse(post.oembed)
          });
          postPoints.push(postPoint);
        }        
      });
      var postColl = turf.featurecollection(postPoints);

      postSource = new mapboxgl.GeoJSONSource({
        type: 'geojson',
        data: postColl,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 30,
        maxzoom: 20
      });
      map.addSource("posts", postSource);

      // Use the posts source to create five layers:
      // One for non-clustered markers, three for each cluster category,
      // and one for cluster labels.
      map.addLayer({
        "id": "non-cluster-markers",
        "type": "symbol",
        "source": "posts",
        "layout": {
          "icon-size": {
            "base": 1,
            "stops": [
              [0,0],
              [9,0.25],
              [10,1],
              [22,1]
            ]
          },
          "icon-image": "cone",
          "icon-allow-overlap": true,
          "icon-padding": 0
        },
        "paint": {},
        "interactive": true
      });

      // When a click event occurs near a closure, open popup
      var popup = new mapboxgl.Popup();
      map.on('click', function (e) {
        map.featuresAt(e.point, {
          radius: 10,
          includeGeometry: true,
          layer: ['non-cluster-markers']
        }, function (err, features) {
          if (err || !features.length || features[0].properties['cluster']) {
            popup.remove();
            return;
          }

          var feature = features[0];
          popup.setLngLat(feature.geometry.coordinates)
            .setHTML('<div id="map-tweet">'+feature.properties.oembed.html+'</div>')
            .addTo(map);
          twttr.widgets.load($('#map-tweet'));
        });
      });

      // Display the data in three layers, each filtered to a range of
      // count values. Each range gets a different fill color.
      var layers = [
          [150, '#F4C823'],
          [20, '#F4C823'],
          [0, '#F4C823']
      ];

      layers.forEach(function (layer, i) {
        map.addLayer({
          "id": "cluster-" + i,
          "type": "circle",
          "source": "posts",
          "interactive": true,
          "paint": {
            "circle-color": layer[1],
            "circle-radius": 18
          },
          "filter": i == 0 ?
            [">=", "point_count", layer[0]] :
            ["all",
              [">=", "point_count", layer[0]],
              ["<", "point_count", layers[i - 1][0]]]
        });

        // When a click event occurs near a cluster, zoom towards it
        map.on('click', function (e) {
          map.featuresAt(e.point, {
            radius: 20,
            includeGeometry: true,
            layer: "cluster-" + i,
          }, function (err, features) {
            if (features.length && !err) {
              map.easeTo({
                zoom: map.getZoom() + 1,
                center: features[0].geometry.coordinates
              });
            }
          });
        });
      });

      // Add a layer for the clusters' count labels
      map.addLayer({
          "id": "cluster-count",
          "type": "symbol",
          "source": "posts",
          "layout": {
              "text-field": "{point_count}",
              "text-font": [
                      "DIN Offc Pro Medium",
                      "Arial Unicode MS Bold"
                  ],
              "text-size": 12
          }
      });

      // When mouse hovers near a cluster, indicate that it's clickable
      map.on('mousemove', function (e) {
        map.featuresAt(e.point, {
          radius: 16,
          layer: ["cluster-1","cluster-2","cluster-3","non-cluster-markers"],
        }, function (err, features) {
          map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
        });
      });

      map.scrollZoom.disable();
      map.addControl(new mapboxgl.Navigation());
    });
  }

  window.onload = function() {
    Tabletop.init({
      key: SPREADSHEET_KEY,
      callback: loadWidgets,
      query: 'status = accepted',
      simpleSheet: true,
      orderby: 'timestamp',
      reverse: true
    })
  };
})()
