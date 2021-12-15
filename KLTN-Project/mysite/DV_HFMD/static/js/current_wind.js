$('.wind').each(function () {
  var $bar = $(this).find('.bar')
  var $val = $(this).find('span')
  var perc = $val.text()
  $({ p: 0 }).animate(
    { p: perc * 0.49 },
    {
      duration: 3000,
      easing: 'swing',
      step: function (p) {
        $bar.css({
          transform: 'rotate(' + (45 + p * 1.8) + 'deg)', // 100%=180° so: ° = % * 1.8
          // 45 is to add the needed rotation to have the green borders at the bottom
        })
      },
    },
  )
  document.addEventListener('DOMContentLoaded', () => {
    function counter(id, start, end, duration) {
      let obj = document.getElementById(id),
        current = start,
        range = end - start,
        increment = end > start ? 0.01 : -0.01,
        step = Math.abs(Math.floor(duration / range)),
        timer = setInterval(() => {
          current += increment
          obj.textContent = current.toFixed(2)
          if (current >= end) {
            clearInterval(timer)
          }
          var x = obj.textContent - 0.01
          obj.textContent = x.toFixed(2)
        }, step)
    }
    counter('count1', 2, perc, 1)
  })
})
