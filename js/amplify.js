(function () {
  var SPREADSHEET_KEY = '1OGC0ecdyz4L2vTbt9USMarL0jHiBJvAYyVno6mnCe9s';

  function loadWidgets(data, tabletop) {
    $('.social-grid').socialgrid({limit:6, posts: data});
    loadMap(data);
  }

  function loadMap (posts) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidHdlbGNoIiwiYSI6ImNpcHloYnN0NzB5ZzNoMW5yd3Z4cjJ1eDQifQ.k48TV6SQlBb_9ctuj8Jrzg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/twelch/cilopb569001wa7ltp230rzkf',
      center: [-122.667040, 45.513421],
      maxBounds: [[-123.298874, 45.252655],[-122.004547, 45.739256]],
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
            postid: post.postid,
            source: post.source,
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
          radius: 16,
          includeGeometry: true,
          layer: ['non-cluster-markers']
        }, function (err, posts) {
          if (err || !posts.length || posts[0].properties['cluster']) {
            popup.remove();
            return;
          }

          var post = posts[0];
          var popClass = post.properties.source + '-popup';
          var embedDiv = $("<div/>").addClass(popClass)[0];
          embedDiv.innerHTML = post.properties.oembed.html;
          var embedDivStr = embedDiv.outerHTML;
          popup.setLngLat(post.geometry.coordinates)
            .setHTML(embedDivStr)
            .addTo(map);

          if (post.properties.source === 'twitter') {            
            twttr.widgets.load($('.twitter-popup')[0]);
          } else {
            instgrm.Embeds.process();
          }
          
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
