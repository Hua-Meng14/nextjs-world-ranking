import { useState } from "react";
import CountriesTable from "../components/CountriesTable/CountriesTable";
import Layout from "../components/Layout/Layout";
import SearchInput from "../components/SearchInput/SearchInput";
import styles from "../styles/Home.module.css";

export default function Home({ countries }) {

  const [keyword, setKeyword] = useState("");

  // const filterCountries = (keyword) => {
  //   const filteredCountries = countries;

  //   countries.forEach((country) => {
  //     const { name } = country;
  //     if (
  //       name.official.includes(keyword)
  //       // region.includes(keyword) ||
  //       // subregion.includes(keyword)
  //     ) {
  //       filteredCountries.push(country);
  //     }
  //   });

  //   return filteredCountries;
  // };

  const filteredCountries = [...countries];

  const onInputchange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  }


  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}>Found {countries.length} countires</div>

        <div className={styles.input}>
          <SearchInput
            placeholder="Filter by Name, Region or SubRegion"
            onChange={onInputchange}
          />
        </div>
      </div>

      <CountriesTable countries={filteredCountries} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  console.log(countries);
  return {
    props: {
      countries,
    },
  };
};
