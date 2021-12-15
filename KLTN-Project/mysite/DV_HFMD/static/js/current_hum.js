var current_hum = function (current_humidity) {
  $('.round1')
    .circleProgress({
      value: 0.8,
    })
    .on('circle-animation-progress', function (event, progress) {
      $(this)
        .find('strong')
        .html(Math.round(current_humidity * progress) + '%')
    })
}
