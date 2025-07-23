function getWeather(cityCode) {
  myAxios({
    url: 'https://hmajax.itheima.net/api/weather',
    params: {
      city: cityCode
    }
  }).then(result => {
    console.log(result);
    const wObj = result.data
    const dateStr = `<span class="dateShort">${wObj.date}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${wObj.dateLunar}</span>
        </span>`
    document.querySelector('.title').innerHTML = dateStr
    document.querySelector('.area').innerHTML = wObj.area
    const nowWStr = `
      <div class="tem-box">
        <span class="temp">
          <span class="temperature">${wObj.temperature}</span>
          <span>°</span>
        </span>
      </div>
      <div class="climate-box">
        <div class="air">
          <span class="psPm25">${wObj.psPm25}</span>
          <span class="psPm25Level">${wObj.psPm25Level}</span>
        </div>
        <ul class="weather-list">
          <li>
            <img src=${wObj.weatherImg} class="weatherImg" alt="">
            <span class="weather">${wObj.weather}</span>
          </li>
          <li class="windDirection">${wObj.windDirection}</li>
          <li class="windPower">${wObj.windPower}</li>
        </ul>
      </div>`
    document.querySelector('.weather-box').innerHTML = nowWStr
    const todayWeather = `
      <div class="range-box">
        <span>今天：</span>
        <span class="range">
          <span class="weather">${wObj.todayWeather.weather}</span>
          <span class="temNight">${wObj.todayWeather.temNight}</span>
          <span>-</span>
          <span class="temDay">${wObj.todayWeather.temDay}</span>
          <span>℃</span>
        </span>
      </div>
      <ul class="sun-list">
        <li>
          <span>紫外线</span>
          <span class="ultraviolet">${wObj.todayWeather.ultraviolet}</span>
        </li>
        <li>
          <span>湿度</span>
          <span class="humidity">${wObj.todayWeather.humidity}</span>%
        </li>
        <li>
          <span>日出</span>
          <span class="sunriseTime">${wObj.todayWeather.sunriseTime}</span>
        </li>
        <li>
          <span>日落</span>
          <span class="sunsetTime">${wObj.todayWeather.sunsetTime}</span>
        </li>
      </ul>`
    document.querySelector('.today-weather').innerHTML = todayWeather
    let weekWeatherItems = ``
    for (let i = 0; i < 7; i++) {
      weekWeatherItems += `<li class="item">
          <div class="date-box">
            <span class="dateFormat">${wObj.dayForecast[i].dateFormat}</span>
            <span class="date">${wObj.dayForecast[i].date}</span>
          </div>
          <img src=${wObj.dayForecast[i].weatherImg} alt="" class="weatherImg">
          <span class="weather">${wObj.dayForecast[i].weather}</span>
          <div class="temp">
            <span class="temNight">${wObj.dayForecast[i].temNight}</span>-
            <span class="temDay">${wObj.dayForecast[i].temDay}</span>
            <span>℃</span>
          </div>
          <div class="wind">
            <span class="windDirection">${wObj.dayForecast[i].windDirection}</span>
            <span class="windPower">${wObj.dayForecast[i].windPower}</span>
          </div>
        </li>`
    }
    const weekWeather = `
      <div class="title">7日内天气预报</div>
      <ul class="week-wrap">
        ${weekWeatherItems}
      </ul>`
    document.querySelector('.week-weather-box').innerHTML = weekWeather
  })
}

getWeather('110100')

document.querySelector('.search-city').addEventListener('input', e => {
  myAxios({
    url: 'https://hmajax.itheima.net/api/weather/city',
    params: {
      city: e.target.value
    }
  }).then(result => {
    console.log(result);
    const lists = result.data.map(item => {
      return `<li class="city-item" data-code="${item.code}">${item.name}</li>`
    }).join('')
    console.log(lists);

    document.querySelector('.search-list').innerHTML = lists
  })
  document.querySelector('.search-list').addEventListener('click', e => {
    console.log(e);

    if (e.target.classList.contains('city-item')) {
      const cityCode = e.target.dataset.code
      console.log(cityCode);

      getWeather(cityCode)
    }
  })
})