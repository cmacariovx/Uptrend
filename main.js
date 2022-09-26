document.addEventListener("DOMContentLoaded", () => {
    async function print(ticker = "TSLA") {

        let response = await fetchData(ticker)

        let objData = response.data

        let currentDate = new Date()

        let validTimes = []

        if (!objData) {
            alert("Invalid Ticker")
            return
        }

        objData.forEach(obj => {
            if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
                validTimes.unshift(obj)
            }
            if (obj.date.slice(8, 10) == currentDate.toString().slice(8, 10)) validTimes.unshift(obj)
        })

        let currentPrices = []

        validTimes.forEach((obj, i) => {
            let { last, volume, high, low, open, close } = obj
            if (last != null) currentPrices.push(last)
        })

        let { last, volume, high, low, open, close, symbol } = validTimes[validTimes.length - 1]

        document.getElementById("tickerBodyText").innerText = symbol == "null" ? "-" : symbol
        document.getElementById("kpiPrice").innerText = last
        document.getElementById("kpiVolume").innerText = volume
        document.getElementById("kpiHigh").innerText = high
        document.getElementById("kpiLow").innerText = low
        document.getElementById("kpiOpen").innerText = open
        document.getElementById("kpiClose").innerText = close

        document.getElementById("currentTickerDataText").innerText = `${symbol}'s Past Hour`

        let chartStatus = Chart.getChart("myChart")
        if (chartStatus != undefined) {
            chartStatus.destroy()
        }

        let ctx = document.getElementById('myChart').getContext("2d")

        let gradientStroke = ctx.createLinearGradient(1000, 0, 100, 0);
        gradientStroke.addColorStop(0, "rgb(232, 16, 95)");
        gradientStroke.addColorStop(1, "rgba(56, 69, 211, 1)");

        const labels = [
            '9:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM'
          ];

        const data = {
            labels: labels,
            datasets: [{
                label: 'Price',
                backgroundColor: gradientStroke,
                borderColor: gradientStroke,
                data: currentPrices,
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                maintainAspectRatio: false,
                pointBackgroundColor: "rgba(222, 222, 222, 1)",
                pointRadius: 0,
                elements: {
                    line: {
                        tension: 0.2,
                        borderWidth: 4
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: "rgba(160, 162, 213, 0.4)",
                            font: {
                                size: 13,
                                weight: "bold"
                            },
                            stepSize: 1,
                            beginAtZero: false
                        },
                        grid: {
                            display: true,
                            color: "rgba(160, 162, 213, 0.4)",
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: "rgba(160, 162, 213, 0.4)",
                            font: {
                                size: 13,
                                weight: "bold"
                            },
                            stepSize: 10,
                            beginAtZero: false
                        },
                        grid: {
                            display: false,
                        }
                    }
                }
            }
        };

        const myChart = new Chart(ctx, config);
    }

    print()

    document.getElementById("searchButton").addEventListener("click", async function() {
        await print(document.getElementById("searchBar").value)
    })

    document.getElementById("amazonButton").addEventListener("click", async function() {
        await print("AMZN")
    })

    document.getElementById("microsoftButton").addEventListener("click", async function() {
        await print("MSFT")
    })

    document.getElementById("appleButton").addEventListener("click", async function() {
        await print("AAPL")
    })

    document.getElementById("searchBar").addEventListener("keyup", async function(event) {
        if (event.key == "Enter") {
            await print(document.getElementById("searchBar").value)
        }
    });
})

async function fetchData(ticker) {
    let response = await fetch(`https://api.marketstack.com/v1/intraday?access_key=59e26e23923f6ad4a01fa306f6c531b8&symbols=${ticker}&interval=1hour&limit=9`)
    return response.json()
}
