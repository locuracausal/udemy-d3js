/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const MARGIN = { LEFT: 60, RIGHT: 20, TOP: 10, BOTTOM: 30 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const g = d3.select("#chart-area")
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
// let width = 600
// let height = 400


var data = [];
var svgRevenue = d3.select('#chart-revenue')
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)




var svgProfit = d3.select('#chart-profit')
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const xRevenue = d3.scaleBand()
    .range([0, WIDTH])
    .paddingInner(0.1)
    .paddingOuter(0.1)

const yRevenue = d3.scaleLinear()
    .range([0, HEIGHT]);


const xGroup = svgRevenue.append("g")
    .attr("class", "eje")
    .attr("transform", "translate(0," + HEIGHT + ")")

const yGroup = svgRevenue.append("g")
    .attr("class", "")

const yLabel = svgRevenue.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - MARGIN.LEFT)
    .attr("x", 0 - (HEIGHT / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")

svgRevenue.append("text")
    .attr("x", (WIDTH / 2))
    .attr("y", MARGIN.TOP)
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("text-decoration", "underline")
    .text("Revenues for month");

svgRevenue.append("text")
    .attr("transform",
        "translate(" + (WIDTH / 2) + " ," +
        (HEIGHT + MARGIN.TOP + 20) + ")")
    .style("text-anchor", "middle")
    .text("Month");
let flag = true


d3.csv("data/revenues.csv")
    .then((info) => {
        data = info
        console.log(data)

        d3.interval(() => {
            flag = !flag
            update(data)

        }, 1000)
        update(data)

    })
    .catch((err) => console.log('Entro en el error :', err));
function update(data) {
    const value = flag ? 'profit' : 'revenue'
    
    const text = flag ? 'Profit ($)' : 'Revenue ($)'
    yLabel.text(text);


    xRevenue
        .domain(data.map(d => d.month))

    yRevenue
        .domain([0, d3.max(data, d => parseInt(d.revenue))])

    const auxR = d3.scaleLinear()
        .domain([d3.max(data, d => parseInt(d.revenue)), 0])
        .range([0, HEIGHT]);

    const xAxisScale = d3.axisBottom(xRevenue)

    const yAxisScale = d3.axisLeft(auxR)



    xGroup
        .call(xAxisScale);

    yGroup
        .call(yAxisScale);
    // JOIN new data with old element
    const barsRevenue = svgRevenue.selectAll('rect').data(data)
    console.log(barsRevenue)

    //Exit old element not present in new data

    barsRevenue.exit().remove()
    // UPDATE old element present in new data
    barsRevenue
        .attr('width', xRevenue.bandwidth)
        .attr('height', (d) => yRevenue(d[value]))
        .attr('x', d => xRevenue(d.month))
        .attr('y', (d) => HEIGHT - yRevenue(d[value]))
        .style('fill', 'purple')

    // ENTER new elements in new data

    barsRevenue.enter()
        .append('rect')
        .attr('width', xRevenue.bandwidth)
        .attr('height', (d) => yRevenue(d[value]))
        .attr('x', d => xRevenue(d.month))
        .attr('y', (d) => HEIGHT - yRevenue(d[value]))
        .style('fill', 'purple')

}
