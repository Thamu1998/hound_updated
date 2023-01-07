KTUtil.onDOMContentLoaded(function () {
    var p1 = new Date(); 
    var p1_e = new Date();
    p1_e.setHours(p1_e.getHours() + 4);

    var p1_s = new Date();
    p1_s.setHours(p1_s.getHours() + 9);

    var p1_a = new Date();
    console.log(p1.getTime());
    

    var p2 = new Date(); 
    p2.setHours(p2.getHours() + 4);
    var p2_e = new Date();
    p2_e.setHours(p2_e.getHours() + 6);

    p1_a.setHours(p2_e.getHours() + 2);
    
    var options = {
        series: [
        // George Washington
        {
          name: 'up',
          data: [
            {
              x: 'Availability',
              y: [
                p1.getTime(),
                p1_e.getTime()
              ]
            },
            {
                x: 'Availability',
                y: [
                    p2_e.getTime(),
                    p1_s.getTime()
                ]
              }
          ]
        },
        {
            name: 'Down',
            data: [
              {
                x: 'Availability',
                y: [
                  p2.getTime(),
                  p2_e.getTime()
                ]
              },
              {
                x: 'Availability',
                y: [
                  p1_s.getTime(),
                  p1_a.getTime()
                ]
              },
            ]
        }
      ],
        chart: {
        height: 100,
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '100%',
          rangeBarGroupRows: true
        }
      },
      colors: [
        "#c8dd96", "#e39695",
      ],
      fill: {
        type: 'solid'
      },
      xaxis: {
        type: 'datetime'
      },
      legend: {
        position: 'right'
      },
      tooltip: {
        custom: function(opts) {
          const fromYear = new Date(opts.y1).getFullYear()
          const toYear = new Date(opts.y2).getFullYear()
          const values = opts.ctx.rangeBar.getTooltipValues(opts)
      
          return (
            ''
          )
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();

});