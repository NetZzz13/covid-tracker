import "./App.scss";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import logo from "./logo.png";
import { useEffect, useState} from "react";
import axios from "axios";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./utils/utils";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenterZoom, setMapCenterZoom] = useState({
    center: [19.117199, 10.540922],
    zoom: 2,
  });

  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    axios
      .get("https://disease.sh/v3/covid-19/all")
      .then((data) => setCountryInfo(data.data));
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios(url).then((data) => {
      setCountry(countryCode);
      setCountryInfo(data.data);
      //&& for bug FIX mistakes of first country select and FIX of click on "worldwide" after clicks on other countries
      //setMapCenterZoom = {}, because I need set MapCenter and set MapZoom at the same time
      countryCode === "worldwide"
        ? setMapCenterZoom({ center: [19.117199, 10.540922], zoom: 2 })
        : setMapCenterZoom({
            center: [data.data.countryInfo.lat, data.data.countryInfo.long],
            zoom: 5,
          });
    });
  };

  useEffect(() => {
    const getCountries = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/countries")
        .then((data) => {
          const countries = data.data.map((elem) => ({
            name: elem.country,
            value: elem.countryInfo.iso2,
          }));

          const sortedData = sortData(data.data);
          setTableData(sortedData);
          setMapCountries(data.data);
          setCountries(countries);
        });
    };
    getCountries();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <div className="app__logo-block">
            <a
              target="_blank"
              href="https://www.linkedin.com/in/alexander-nemtsov-367667160/"
              title="author Aliaksandr Nemtsau"
              rel="noreferrer"
            >
              <img
                className="app__logo-block_img"
                src={logo}
                alt="corona-logo"
              />
            </a>
            <h1 className="app__logo-block_title">COVID TRACKER</h1>
          </div>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
              style={{ backgroundColor: "transparent" }}
              className="app__dropdown_select"
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((elem, index) => (
                <MenuItem key={`${elem}_${index}`} value={elem.value}>
                  {elem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={() => setCasesType("cases")}
            title="Coronavirus cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={() => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={() => setCasesType("deaths")}
            title="Death"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        <Map
          center={mapCenterZoom.center}
          zoom={mapCenterZoom.zoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>

          <Table countries={tableData} />

          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} className="app__graph" />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
