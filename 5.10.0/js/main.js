/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 60, RIGHT: 20, TOP: 10, BOTTOM: 30 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM

let year = 0




var healthChart = d3.select('#chart-area')
	.append("svg")
	.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
	.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
	.append("g")
	.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


const x = d3.scaleLog()
	.range([0, WIDTH])
	.base(10)


const y = d3.scaleLinear()
	.range([0, HEIGHT]);

const xAxisGroup = healthChart.append("g")
	.attr("class", "eje")
	.attr("transform", "translate(0," + HEIGHT + ")")

const yAxisGroup = healthChart.append("g")
	.attr("class", "")

healthChart.append("text")
	.attr("transform",
		"translate(" + (WIDTH / 2) + " ," +
		(HEIGHT + MARGIN.TOP + 20) + ")")
	.style("text-anchor", "middle")
	.text("GDP Per capita ($)");

healthChart.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - MARGIN.LEFT)
	.attr("x", 0 - (HEIGHT / 2))
	.attr("dy", "1em")
	.style("text-anchor", "middle")
	.text("Ezperanza de vida en años");




d3.json("data/data.json").then(function (data) {

	const dataSinNull = data.map(yearCountries => {
		const countries = yearCountries.countries.filter(country => country.income && country.life_exp)
		return {
			year: yearCountries.year,
			countries
		}

	});

	console.log(dataSinNull)
	let countries = dataSinNull[year].countries

	x.domain([100, 60000])
	y.domain([90, 0])


	const populationScale = d3.scalePow()
		.exponent(0.5)
		.domain([0, d3.max(countries, c => c.population)])
		.range([0, 20]);




	const xAxisScale = d3.axisBottom(x)
		.tickValues([400, 4000, 40000])
	const yAxisScale = d3.axisLeft(y)

	xAxisGroup
		.call(xAxisScale);

	yAxisGroup
		.call(yAxisScale);


	let segundos = 0
	const interval = d3.interval(() => {
		try {
			countries = dataSinNull[year].countries
			update(countries)
			segundos++
			year++
		} catch (error) {
			console.log(error)
			interval.stop()
		}

		console.log("Segundos", segundos)

	}, 100)




}).catch((err) => console.error("Hay un error BOLUDO!: ", err))


function update(countries) {
	//circles.exit()
	const COLOR_CONTINENT = {
		'africa': 'red',
		'americas': 'yellow',
		'asia': 'purple',
		'europe': 'blue',
		'oceania': 'green'
	}

	const populationScale = d3.scalePow()
		.exponent(0.5)
		.domain([0, d3.max(countries, c => c.population)])
		.range([0, 40]);

	// JOIN new data with old element

	const circles = healthChart.selectAll('circle').data(countries)
	//Exit old element not present in new data

	circles.exit().remove()

	// UPDATE old element present in new data
	circles
		.attr('cx', d => x(d.income))
		.attr('cy', d => y(d.life_exp))
		.attr('r', d => populationScale(d.population))
		.attr('stroke', 'black')
		.attr('fill', d => COLOR_CONTINENT[d.continent]);
	// ENTER new elements in new data
	circles.enter()
		.append('circle')
		.attr('cx', d => x(d.income))
		.attr('cy', d => y(d.life_exp))
		.attr('r', d => populationScale(d.population))
		.attr('stroke', 'black')
		.attr('fill', d => COLOR_CONTINENT[d.continent]);




	console.log("D3 JS", d3.max(countries, c => c.population))
	console.log("populationScale", populationScale(10000000))


	console.log("Countries:", countries)

	//const a = COLOR_CONTINENT['africa']
	// 	console.log('a: ',a)


}