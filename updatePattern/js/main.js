/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { LEFT: 60, RIGHT: 20, TOP: 10, BOTTOM: 30 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

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

	const COLOR_CONTINENT = {
		'africa': () => 'red',
		'americas': () => 'yellow',
		'asia': () => 'purple',
		'europe': () => 'blue',
		'oceania': () => 'green'
	}

	// countries.forEach(country => {


	// 	circlesChart.enter()
	// 		.append('circle')
	// 		.attr('cx', x(country.income))
	// 		.attr('cy', y(country.life_exp))
	// 		.attr('r', populationScale(country.population))
	// 		.attr('stroke', 'black')
	// 		.attr('fill', COLOR_CONTINENT[country.continent]);

	// });


	let segundos = 0
	d3.interval(() => {

		countries = dataSinNull[year].countries
		update(countries)
		segundos++
		year++
		console.log("Segundos", segundos)

	}, 1000)




}).catch((err) => console.error("Hay un error BOLUDO!: ", err))


function update(countries) {
	const circles = healthChart.selectAll('circle').data(countries)
	circles.exit()

	const populationScale = d3.scalePow()
		.exponent(0.5)
		.domain([0, d3.max(countries, c => c.population)])
		.range([0, 20]);


	console.log("D3 JS", d3.max(countries, c => c.population))
	console.log("populationScale", populationScale(10000000))




	// Coloco los textos del grafico



	console.log("Countries:", countries)

	const COLOR_CONTINENT = {
		'africa': () => 'red',
		'americas': () => 'yellow',
		'asia': () => 'purple',
		'europe': () => 'blue',
		'oceania': () => 'green'

	}
	circles.enter()
		.append('circle')
		.attr('cx', d => x(d.income))
		.attr('cy', d => y(d.life_exp))
		.attr('r', d => populationScale(d.population))
		.attr('stroke', 'black')
		.attr('fill', d => COLOR_CONTINENT[d.continent]);

}