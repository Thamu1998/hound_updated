

    am5.ready(function() {
    
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
    am5themes_Animated.new(root)
    ]);
    
    
    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    var chart = root.container.children.push(
    am5map.MapChart.new(root, {
    panX: "rotateX",
    panY: "rotateY",
    projection: am5map.geoMercator()
    }));


    
    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow,
    exclude: ["AQ"]
    }));
    
    polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    toggleKey: "active",
    interactive: true
    });
    
    polygonSeries.mapPolygons.template.states.create("hover", {
    fill: root.interfaceColors.get("primaryButtonHover")
    });
    
    polygonSeries.mapPolygons.template.states.create("active", {
    fill: root.interfaceColors.get("primaryButtonHover")
    });
    
    var previousPolygon;
    
    polygonSeries.mapPolygons.template.on("active", function (active, target) {
    if (previousPolygon && previousPolygon != target) {
        previousPolygon.set("active", false);
    }
    if (target.get("active")) {
        polygonSeries.zoomToDataItem(target.dataItem );
    }
    else {
        chart.goHome();
    }
    previousPolygon = target;
    });
    
    // Create point series for markers
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    var colorset = am5.ColorSet.new(root, {});

    pointSeries.bullets.push(function () {
    var container = am5.Container.new(root, {});
    
    var circle = container.children.push(
        am5.Circle.new(root, {
        radius: 2,
        tooltipY: 0,
        fill: am5.color('#ffffff'),
        strokeOpacity: 0,
        tooltipText: "{title}"
        })
    );
    
    var circle2 = container.children.push(
        am5.Circle.new(root, {
        radius: 6,
        tooltipY: 0,
        fill: am5.color('#4a4e69'),
        strokeOpacity: 0,
        tooltipText: "{title}"
        })
    );
    
    
    
    return am5.Bullet.new(root, {
        sprite: container
    });
    });
    
    var cities = [
    {
        title: "Frankfurt : 300",
        latitude: 50.110924,
        longitude: 8.682127
    },
    {
        title: "Frankfurt1 : 300",
        latitude: 50.120924,
        longitude: 8.282127
    },
    {
        title: "ROT",
        latitude: 48.0137,
        longitude: 10.0317
    },
    {
        title: "Copenhagen",
        latitude: 55.6763,
        longitude: 12.5681
    },
    {
        title: "Paris",
        latitude: 48.8567,
        longitude: 2.351
    },
    {
        title: "Reykjavik",
        latitude: 64.1353,
        longitude: -21.8952
    },
    {
        title: "Moscow",
        latitude: 55.7558,
        longitude: 37.6176
    },
    {
        title: "Madrid",
        latitude: 40.4167,
        longitude: -3.7033
    },
    {
        title: "London",
        latitude: 51.5002,
        longitude: -0.1262,
        url: "http://www.google.co.uk"
    },
    {
        title: "Peking",
        latitude: 39.9056,
        longitude: 116.3958
    },
    {
        title: "New Delhi",
        latitude: 28.6353,
        longitude: 77.225
    },
    {
        title: "Tokyo",
        latitude: 35.6785,
        longitude: 139.6823,
        url: "http://www.google.co.jp"
    },
    {
        title: "Ankara",
        latitude: 39.9439,
        longitude: 32.856
    },
    {
        title: "Buenos Aires",
        latitude: -34.6118,
        longitude: -58.4173
    },
    {
        title: "Brasilia",
        latitude: -15.7801,
        longitude: -47.9292
    },
    {
        title: "Ottawa",
        latitude: 45.4235,
        longitude: -75.6979
    },
    {
        title: "Washington",
        latitude: 38.8921,
        longitude: -77.0241
    },
    {
        title: "Kinshasa",
        latitude: -4.3369,
        longitude: 15.3271
    },
    {
        title: "Cairo",
        latitude: 30.0571,
        longitude: 31.2272
    },
    {
        title: "Pretoria",
        latitude: -25.7463,
        longitude: 28.1876
    }
    ];
    
    for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    addCity(city.longitude, city.latitude, city.title);
    }
    
    function addCity(longitude, latitude, title) {
    pointSeries.data.push({
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        title: title
    });
    }
    
    // Add zoom control
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    
    
    // Set clicking on "water" to zoom out
    chart.chartContainer.get("background").events.on("click", function () {
    chart.goHome();
    })
    
    
    // Make stuff animate on load
    chart.appear(1000, 100);
    
    }); // end am5.ready()