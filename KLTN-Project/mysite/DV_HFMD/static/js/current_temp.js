var current_temp = function (current_temperature) {
  var root = am5.Root.new('chartdiv')

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)])

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/radar-chart/
  var chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'panX',
      wheelY: 'zoomX',
      innerRadius: am5.percent(60),
      startAngle: 130,
      endAngle: -90,
    }),
  )
  // Data
  var x = current_temperature + '°C'
  var data = [
    {
      name: x,
      value: current_temperature,
      full: 60,
      columnSettings: {
        fill: chart.get('colors').getIndex(0),
      },
    },
  ]
  // Add cursor
  var cursor = chart.set(
    'cursor',
    am5radar.RadarCursor.new(root, {
      behavior: 'zoomX',
    }),
  )

  cursor.lineY.set('visible', false)

  // Create axes and their renderers
  var xRenderer = am5radar.AxisRendererCircular.new(root, {
    //minGridDistance: 50
  })

  xRenderer.labels.template.setAll({
    radius: 10,
    fontSize: 10,
  })

  xRenderer.grid.template.setAll({
    forceHidden: true,
  })

  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      min: 0,
      max: 40,
      strictMinMax: true,
      numberFormat: "#'°C'",
      tooltip: am5.Tooltip.new(root, {}),
    }),
  )

  var yRenderer = am5radar.AxisRendererRadial.new(root, {
    minGridDistance: 20,
  })

  yRenderer.labels.template.setAll({
    centerX: am5.p100,
    fontWeight: '500',
    fontSize: 20,
    templateField: 'columnSettings',
  })

  yRenderer.grid.template.setAll({
    forceHidden: true,
  })

  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: 'name',
      numberFormat: "#'°C'",
      renderer: yRenderer,
    }),
  )

  yAxis.data.setAll(data)

  // Create series
  var series1 = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: 'full',
      categoryYField: 'name',
      fill: root.interfaceColors.get('alternativeBackground'),
    }),
  )

  series1.columns.template.setAll({
    width: am5.p100,
    fillOpacity: 0.08,
    strokeOpacity: 0,
    cornerRadius: 20,
  })

  series1.data.setAll(data)

  var series2 = chart.series.push(
    am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: 'value',
      categoryYField: 'name',
      tooltipText: '{name}',
    }),
  )

  series2.columns.template.setAll({
    width: am5.p100,
    strokeOpacity: 0,
    tooltipText: '{name}: {valueX}%',
    cornerRadius: 20,
    templateField: 'columnSettings',
  })
  series2.columns.template.set(
    'fillGradient',
    am5.LinearGradient.new(root, {
      stops: [
        {
          color: am5.color(0xf1af00),
        },
        {
          color: am5.color(0x205aa7),
        },
      ],
      rotation: 100,
    }),
  )
  series2.data.setAll(data)

  // Animate chart and series in
  series1.appear(1000)
  series2.appear(1000)
  chart.appear(1000, 100)
}
