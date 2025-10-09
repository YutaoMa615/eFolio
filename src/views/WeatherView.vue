<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>

      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
        />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
    </div>

    <!-- Main weather info -->
    <main>
      <!-- If there are no data returned, skip rendering -->
      <div v-if="weatherData">
        <!-- City name and country -->
        <h2>{{ weatherData.name }}, {{ weatherData.sys?.country }}</h2>

        <div class="icon-temp">
          <!-- Weather icon from API -->
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>

        <!-- weather[0] means current weather -->
        <div class="desc">
          <span>{{ weatherData.weather?.[0]?.description }}</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
/*
  This component calls OpenWeatherMap "Current Weather" API.
  - It first tries to get current location (navigator.geolocation) and loads weather.
  - It also supports searching by city name via a text input.
  - Temperature is displayed in Celsius (units=metric).
  - Weather icon is resolved from the icon code returned by the API.
*/
import axios from "axios";

// Put your API key in an env var first if possible.
// Create .env and add: VITE_OPENWEATHER_API_KEY=YOUR_KEY
const apikey = "9d958e0a660401dbb68d4b32c183867d";

  export default {
    name: "App",
    data() {
      return {
        city: "",
        weatherData: null,
        hourlyForecast: [],
        dailyForecast: [],
      };
    },
    //computed is a property that is used to define a property that 
    //is dependent on other data properties. 
    //If we using a more easy to understand words to understand the concept: 
    //the derived value such as temperature automatically update when the relevant value change.
    computed: {
      //There are multiple way to obtain the data in Celsius format.
      //Calculation by yourself like below after data is retireved or via API parameters
      
      //Example of adding additional units requirement, if you choose this, remember to change section 3.1
      //https://api.openweathermap.org/data/2.5/weather?lat=XXX&lon=-XXX.15&appid={API key}&units=metric
      temperature() {
        return this.weatherData
          ? Math.floor(this.weatherData.main.temp - 273)
          : null;
      },
      //Get the current weather icon using the API link
      iconUrl() {
        return this.weatherData
          ? `http://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
          : null;
      },
    },
    //There are two steps involved in this, 
    //step 1: identify current location 
    //step 2: after identify, get the weather data straight based on the current location.
    mounted() {
      this.fetchCurrentLocationWeather();
    },
    methods: {
      //Async in a easy to understand way means the method will run in backend thread, 
      //And it won't occupy the main thread, so the user experience is still smooth
      async fetchCurrentLocationWeather() {
        //The navigator.geolocation object is part of the Web API provided by modern web browsers
        //Please note this function is not belongs to Vue or openweather.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            //API link to obtain the current weather based on the current location browser identified 
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
            //await means wait for the fetchWeatherData method to complete before proceeding
            await this.fetchWeatherData(url);
          });
        }
      },
      async fetchWeatherData(url) {
        try {
          const response = await axios.get(url);
          //Returned data from API is stored as JSON file in weatherData
          this.weatherData = response.data;
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      },

    // Search weather by city name
    async searchByCity() {
      if (!this.city) return;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        this.city
      )}&appid=${API_KEY}&units=metric`;
      await this.fetchWeatherData(url);
    },
  },
};
</script>