document.addEventListener("DOMContentLoaded", () => {
    //^ CHART CONTAINER DECLARATION//
    const container = document.querySelector(".chart_container");

    //^ DIMENTIONS //
    const width = 800;
    const height = 400;
    const barW = width / 275;
    const heightMargin = 60;
    //^ SVG CREATION//

    const graphContainer = d3
        .select(container)
        .append("svg")
        .attr("width", width + 100)
        .attr("height", height + heightMargin);

    graphContainer.append("text").attr("transform", "rotate(-90)").attr("x", -200).attr("y", 80).text("Gross Domestic Product");

    graphContainer
        .append("text")
        .attr("x", width)
        .attr("y", height + 40)
        .text("Timeline")
        .attr("class", "years_info");

    //^ TOOLTIP CREATION  */

    let tooltip = d3.select(container).append("div").attr("id", "tooltip").style("opacity", 0);

    //^ overlay CREATION  */

    let overlay = d3.select(container).append("div").attr("class", "overlay").style("opacity", 0);

    //! FETCHING DATA FUNCTION START//
    const fetching = async () => {
        //^  FETCHING DATA  //
        const fetchData = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");

        //^  TRANSFORM RAW DATA  //
        const rawData = await fetchData.json();

        //^  BASIC DATA  //
        const basicData = rawData.data;
        console.log(basicData);

        //^ TOOLTIP DATA  //
        const toolTipData = basicData.map((item) => {
            let quarter;
            let temp = item[0].substring(5, 7);

            if (temp === "01") {
                quarter = "First Quarter";
            } else if (temp === "04") {
                quarter = "Second Quarter";
            } else if (temp === "07") {
                quarter = "Thirt Quarter";
            } else if (temp === "10") {
                quarter = "Forth Quarter";
            }

            return item[0].substring(0, 4) + " " + quarter;
        });
        console.log(toolTipData);

        //^ DATES DATA  //
        const yearsDate = basicData.map(function (item) {
            return new Date(item[0]);
        });
        //^ DATES DATA MAX AND MIN  //
        const xMax = new Date(d3.max(yearsDate));
        const xMin = new Date(d3.min(yearsDate));

        //^ X AXES DATA  //
        const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
        const xAxis = d3.axisBottom().scale(xScale);
        graphContainer.append("g").call(xAxis).attr("id", "x-axis").attr("transform", "translate(60, 400)");

        //^ GDP DATA  //
        const gdpData = basicData.map((item) => item[1]);
        //^ GDP DATA MAX AND MIN //
        const gdpMax = d3.max(gdpData);
        const gdpMin = d3.min(gdpData);

        //^ GDP DATA SCALED //
        const linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);
        const scaledGDP = gdpData.map((item) => linearScale(item));

        //^ Y AXES DATA  //
        const yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);
        const yAxis = d3.axisLeft(yAxisScale);
        graphContainer.append("g").call(yAxis).attr("id", "y-axis").attr("transform", "translate(60, 0)");
        //^ RECT CREATION  //
        d3.select("svg")
            .selectAll("rect")
            .data(scaledGDP)
            .enter()
            .append("rect")
            .attr("data-date", (d, i) => basicData[i][0])
            .attr("data-gdp", (d, i) => basicData[i][1])
            .attr("class", "bar")
            .attr("x", (d, i) => xScale(yearsDate[i]))
            .attr("y", (d) => height - d)
            .attr("width", barW)
            .attr("height", (d) => d)
            .attr("index", (d, i) => i)
            .attr("transform", `translate(${heightMargin},0)`);
    };
    //! FETCHING DATA FUNCTION OVER//

    fetching();
});
