import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showData = false;
  constructor() { }

  rows: any = []

  ngOnInit() {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const nos = [1,2,3,4,4.5,2.5,5.5,7,10]
    for (let index = 0; index < 25; index++) {
      this.rows.push({
        month: months[Math.floor(Math.random() * months.length)],
        rad: nos[Math.floor(Math.random() * nos.length)],
        a: Math.round(Math.random()*100),
        b: Math.random().toString(36).substring(7),
        c: Math.random(),
        d: Math.round(Math.random()*100),
      })
    }
    this.addNewPlot('lineChart')
    this.addNewPlot()
    this.addNewPlot('scatterPlot')
    this.addNewPlot('bubbleChart')
  }

  columns = [
    { name: 'month', title: 'month' },
    { name: 'rad', title: 'rad' },
    { name: 'a', title: 'a' },
    { name: 'b', title: 'b' },
    { name: 'c', title: 'c' },
    { name: 'd', title: 'd' },
  ]

  config: any = {
    paging: true,
    sorting: { columns: ['a', 'b'] },
    className: ['table-responsi1ve', 't1able']
  };

  plots = []

  validPlot = [
    { name: 'Bar chart', value: 'barChart' },
    { name: 'Pie chart', value: 'pieChart' },
    { name: 'Scatter plot', value: 'scatterPlot' },
    { name: 'Bubble chart', value: 'bubbleChart' },
    { name: 'Line chart', value: 'lineChart' },
    { name: 'Time series', value: 'timeSeries' },
    { name: 'Heatmap', value: 'heatMap' },
    { name: 'Automatic', value: 'automatic' },
  ]


  requiredFields = (data, options) => {
    let errors = { isError: false, missingFeilds: [] }
    options.map(itm => {
      if (!data.hasOwnProperty(itm)) {
        errors.isError = true;
        errors.missingFeilds.push(itm)
      }
      if (errors.isError) {
        throw new Error("Required fields missing - " + errors.missingFeilds.join(','))
      }
    })
  }

  utils = {
    getFreq: (data, fieldName) => {
      let count = {}
      data.map(itm => {
        if (!count[itm[fieldName]]) {
          count[itm[fieldName]] = 0
        }
        count[itm[fieldName]]++
      })
      let countVal = []
      Object.keys(count).map(itm => { countVal.push(count[itm]) })
      return { countObj: count, labels: Object.keys(count), values: countVal }
    },
    getNColors: (n) =>{
      let random_rgba = () => {
        var num = Math.round(0xffffff * Math.random());
        var r = num >> 16;
        var g = num >> 8 & 255;
        var b = num & 255;
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
      let cols = [];
      for (let i = 0; i <= n; i++) {
        cols.push(random_rgba());
      }
      console.log(cols)
      return cols;
    },
    cordPoints(data,xField,yField,options={}){
      // valid options : sorted, sortField
      let pts = []
      data.map(itm=>{
        pts.push({x:itm[xField],y:itm[yField]})
      })
      if(options['sorted']){
        pts = pts.sort(function(a, b){return a[options['sortField']] - b[options['sortField']]});
      }
      return pts
    },
    pointArray(data,field,options={}){
      let pts = []
      data.map(itm=>{pts.push(itm[field])})
      if(options['sorted']){
        if(!options['sortField']){
          pts = pts.sort(function(a, b){return a - b});
        }else{
          pts = pts.sort(function(a, b){return a[options['sortField']] - b[options['sortField']]});
        }
      }
      return pts
    },
    bubblePoints(data,xField,yField,rField){
      let pts = []
      data.map(itm=>{
        pts.push({x:itm[xField],y:itm[yField],r: itm[rField]})
      })
      return pts
    }
  }

  initOutDOM(poltId) {
    let docId1 = document.getElementById("outer-" + poltId)
    docId1.innerHTML = `<canvas id="${poltId}" width="400px" height="400px"></canvas>`
  }

  plotGenerator = {
    barChart: {
      generate: (options) => {
        let freq = this.utils.getFreq(options['data'], options['catField'])
        this.initOutDOM(options['cssID'])

        let docId2 = document.getElementById(options['cssID'])
        var ctx: any = docId2['getContext']('2d');

        var myChart = new window['Chart'](ctx, {
          type: 'bar',
          data: {
            labels: freq.labels,
            datasets: [{
              label: 'Frequency of ' + options['catField'],
              data: freq.values,
              backgroundColor: this.utils.getNColors(freq.values.length)
            }]
          },
          options: {scales: {yAxes: [{ticks: {beginAtZero: true}}] }}
        });
      },
      init: () => {return {catField: '',}},
      formType: {
        type: 'jsonSchema',
        schema: [{"name": "catField","label": "Category field","type": "string",},],
        default: {"catField": "month"  }
      }
    },
    pieChart: {
      generate: (options) => {
        let freq = this.utils.getFreq(options['data'], options['catField'])
        this.initOutDOM(options['cssID'])
        let docId2 = document.getElementById(options['cssID'])
        var ctx: any = docId2['getContext']('2d');
        var myChart = new window['Chart'](ctx, {
          type: 'pie',
          data: {
            datasets: [{
              data: freq.values,
              backgroundColor: this.utils.getNColors(freq.values.length)
            }],
            labels: freq.labels
          }
        });
      },
      init: () => {return {catField: '',}},
      formType: {
        type: 'jsonSchema',
        schema: [ {"name": "catField","label": "Category field","type": "string",}  ],
        default: {"catField": "month"}
      }
    },
    scatterPlot: {
      generate: (options) => {
        // let freq = this.utils.getFreq(options['data'], options['catField'])
        let points = this.utils.cordPoints(options['data'],options['xField'],options['yField'])
        this.initOutDOM(options['cssID'])
        let docId2 = document.getElementById(options['cssID'])
        var ctx: any = docId2['getContext']('2d');
        var myChart = new window['Chart'](ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              data: points,
              label:options['xField']+" vs. "+ options['yField'],
              backgroundColor:"rgba(50,50,50,1)"
            }],
          }
        });
      },
      init: () => {return {xField: '',yField:''}},
      formType: {
        type: 'jsonSchema',
        schema: [ 
          {"name": "xField","label": "x-axis","type": "string"},
          {"name": "yField","label": "y-axis","type": "string"}
        ],
        default: {"xField": "c","yField":"a"}
      }
    },
    bubbleChart:{
      generate: (options) => {
        // let freq = this.utils.getFreq(options['data'], options['catField'])
        let points = this.utils.bubblePoints(options['data'],options['xField'],options['yField'],options['rField'])
        this.initOutDOM(options['cssID'])
        let docId2 = document.getElementById(options['cssID'])
        var ctx: any = docId2['getContext']('2d');

        var myChart = new window['Chart'](ctx, {
          type: 'bubble',
          data: {
            datasets: [{
              data: points,
              label:options['xField']+" vs. "+ options['yField'],
              backgroundColor:"rgba(50,50,50,1)"
            }],
          }
        });
      },
      init: () => {return {xField: '',yField:'',rField:''}},
      formType: {
        type: 'jsonSchema',
        schema: [ 
          {"name": "xField","label": "x-axis","type": "string"},
          {"name": "yField","label": "y-axis","type": "string"},
          {"name": "rField","label": "radius","type": "string"},
        ],
        default: {"xField": "c","yField":"a","rField":'rad'}
      }
    },
    lineChart: {
      generate: (options) => {
        // let freq = this.utils.getFreq(options['data'], options['catField'])
        let points = this.utils.pointArray(options['data'],options['yField'])
        let lbs = this.utils.pointArray(options['data'],options['xField'])
        console.log(lbs)
        this.initOutDOM(options['cssID'])
        let docId2 = document.getElementById(options['cssID'])
        var ctx: any = docId2['getContext']('2d');
        console.log(points)
        window['Chart'].defaults.global.elements.line.fill = false;
        var myChart = new window['Chart'](ctx, {
          type: 'line',
          data: 
          {
            labels:lbs,
            datasets: [{
              data: points,
              label: options['yField'],
              backgroundColor:"rgba(50,50,50,1)"
            }],
          }
        });
      },
      init: () => {return {xField: '',yField:''}},
      formType: {
        type: 'jsonSchema',
        schema: [ 
          {"name": "yField","label": "y-Field","type": "string"},
          {"name": "xField","label": "x-Field","type": "string"}
        ],
        default: {"yField":"a","xField":"month"}
      }
    },
    timeSeries: {

    },
    heatMap: {

    }
  }
  newPlotObj(newType) {
    let blankObj = this.plotGenerator[newType]['init']()
    blankObj['type'] = newType
    return blankObj
  }
  addNewPlot(newType = 'barChart') {
    this.plots.push(this.newPlotObj(newType))
    console.log(this.plots)
  }

  modifyPlotType(newType, i) {
    // this.plots[i] =   //  data.list[index] = JSON.parse(JSON.stringify(currObj))
  }

  plotPlot(data, inx) {
    console.log(data['data'])
    console.log(inx)
    let a = this.plots[inx]
    let opt = data['data'];
    opt['data'] = this.rows;
    opt['cssID'] = "plot-" + inx;
    this.plotGenerator[a['type']]['generate'](opt)
  }
}