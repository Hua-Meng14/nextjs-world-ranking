import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import styles from "./Country.module.css";
import Link from "next/link";

const getCountryByName = async (id) => {
  const res = await fetch(`https://restcountries.com/v3.1/name/${id}`);
  const countryRes = await res.json();
  const country = countryRes[0];
  return country;
};

const getCountryByCode = async (id) => {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
  const countryRes = await res.json();
  const country = countryRes[0];
  return country;
};

const Country = ({ country }) => {
  const [borders, setBorders] = useState([]);

  const getBorders = async () => {
    try {
      const bordersData = await Promise.all(
        country.borders.map(async (borderCode) => {
          const borderCountry = await getCountryByCode(borderCode);
          return borderCountry;
        })
      );
      setBorders(bordersData);
    } catch (error) {
      console.error("Error fetching border countries:", error);
    }
  };

  useEffect(() => {
    getBorders();
  }, []);

  return (
    <Layout title={country.name.common}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <img src={country.flags.png} alt={country.name.common}></img>

            <h1 className={styles.overview_name}>{country.name.official}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {country.population}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>

              <div className={styles.overview_area}>
                <div className={styles.overview_value}>
                  {country.area} (km<sup style={{ fontSize: "0.5rem" }}>2</sup>)
                </div>
                <div className={styles.overview_label}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div className={styles.details_panel_value}>
                {country.capital}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Languages</div>
              <div className={styles.details_panel_value}>
                {Object.values(country.languages).join(", ")}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {Object.entries(country.currencies).map(
                  ([currencyCode, currencyInfo], index, currenciesArray) => (
                    <span key={currencyCode}>
                      {currencyCode} ({currencyInfo.symbol})
                      {index < currenciesArray.length - 1 && ", "}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native name</div>
              <div className={styles.details_panel_value}>
                {Object.values(country.name.nativeName)[0].official}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Region</div>
              <div className={styles.details_panel_value}>{country.region}</div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Sub-Region</div>
              <div className={styles.details_panel_value}>
                {country.subregion}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Google Maps</div>
              <div className={styles.details_panel_value}>
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  {country.maps.googleMaps}
                </a>
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Open Street Maps</div>
              <div className={styles.details_panel_value}>
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  {country.maps.openStreetMaps}
                </a>
              </div>
            </div>

            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbouring Countries
              </div>

              <div className={styles.details_panel_borders_container}>
                {borders.map((borderCountry) => (
                  <Link
                    href={`/country/${borderCountry.cca2}`}
                    key={borderCountry.cca2}
                  >
                    <div className={styles.details_panel_borders_country}>
                      <img
                        src={borderCountry.flags.svg}
                        alt={borderCountry.name.common}
                        width={110}
                        height={100}
                      ></img>
                      <div className={styles.details_panel_borders_name}>
                        {borderCountry.name.common}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;

export const getStaticPaths = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  const paths = countries.map((country) => ({
    params: { id: country.cca2 },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const country = await getCountryByCode(params.id);
  return {
    props: {
      country,
    },
  };
};

// export const getServerSideProps = async ({ params }) => {
//   const country = await getCountryByCode(params.id);
//   return {
//     props: {
//       country,
//     },
//   };
// };
