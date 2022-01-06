var chart_temp_rain = function (day_8, chartdiv) {
  for (const item in day_8) {
    var d = new Date(day_8[item]['time'] * 1000)
    day_8[item]['time'] = d.toLocaleDateString()
  }
  var data = day_8
  // Create root element
  var root = am5.Root.new(chartdiv)

  // Set themes
  root.setThemes([am5themes_Animated.new(root)])

  // Create chart
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelY: 'none',
    }),
  )

  chart.zoomOutButton.set('forceHidden', true)

  chart.get('colors').set('step', 2)

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: 'time',
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
      }),
    }),
  )

  xAxis.get('renderer').labels.template.setAll({
    paddingTop: 20,
    fontSize: 12,
  })

  xAxis.data.setAll(data)
  // Create axes
  var distanceAxisRenderer = am5xy.AxisRendererY.new(root, {})
  distanceAxisRenderer.grid.template.set('forceHidden', true)
  var distanceAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: distanceAxisRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    }),
  )

  var durationAxisRenderer = am5xy.AxisRendererY.new(root, {
    opposite: true,
  })
  durationAxisRenderer.grid.template.set('forceHidden', true)
  var durationAxis = chart.yAxes.push(
    am5xy.DurationAxis.new(root, {
      renderer: durationAxisRenderer,
      extraMax: 0.3,
    }),
  )

  // Create series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var rainSeries = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: distanceAxis,
      valueYField: 'rain',
      categoryXField: 'time',
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueY} mml',
      }),
    }),
  )

  // Add circle bullet
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets

  var tempSeries = chart.series.push(
    am5xy.LineSeries.new(root, {
      xAxis: xAxis,
      yAxis: durationAxis,
      valueYField: 'temp',
      categoryXField: 'time',
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueY} °C',
      }),
    }),
  )

  tempSeries.strokes.template.setAll({ strokeWidth: 2 })

  // Add circle bullet
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
  tempSeries.bullets.push(function () {
    var graphics = am5.Rectangle.new(root, {
      width: 10,
      height: 10,
      centerX: am5.p50,
      centerY: am5.p50,
      fill: tempSeries.get('stroke'),
    })

    return am5.Bullet.new(root, {
      sprite: graphics,
    })
  })

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  chart.set(
    'cursor',
    am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: distanceAxis,
    }),
  )
  rainSeries.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 })
  tempSeries.set('stroke', am5.color(0xff621f))
  tempSeries.set('fill', am5.color(0xff621f))

  rainSeries.data.setAll(data)
  tempSeries.data.setAll(data)
  xAxis.data.setAll(data)

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  rainSeries.appear(1000)
  chart.appear(1000, 100)
}
