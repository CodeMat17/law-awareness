/**
 * The constitutions of the 54 African states, plus the United States, for
 * /constitutions.
 *
 * Every text links to the Constitute Project (constituteproject.org), a
 * non-profit archive of national constitutions in English run from the
 * University of Texas at Austin. `adopted` and `revised` are the years in the
 * archive's own title for each text ("Nigeria 1999 (rev. 2023)"), checked
 * against the archive on 2026-10-09 — they describe the text we link to, not a
 * claim of our own about each country's current constitutional position.
 *
 * Kept in code rather than the CMS: it is reference data that changes only when
 * a country adopts a new constitution or the archive publishes a new text.
 */

export type ConstitutionRegion =
  | "west"
  | "north"
  | "central"
  | "east"
  | "southern"
  | "americas";

export const constitutionRegions: { value: ConstitutionRegion; label: string }[] =
  [
    { value: "west", label: "West Africa" },
    { value: "north", label: "North Africa" },
    { value: "central", label: "Central Africa" },
    { value: "east", label: "East Africa" },
    { value: "southern", label: "Southern Africa" },
    { value: "americas", label: "United States" },
  ];

export interface WorldConstitution {
  country: string;
  region: ConstitutionRegion;
  /** Year the constitution in the linked text was first adopted. */
  adopted: number;
  /** Year of the latest revision the linked text includes, if any. */
  revised?: number;
  /** Path segment on constituteproject.org/constitution/. */
  constitute: string;
  /** Plain-language caveat where the linked text may not be the one in force. */
  note?: string;
}

export function constituteHref(entry: WorldConstitution): string {
  return `https://www.constituteproject.org/constitution/${entry.constitute}?lang=en`;
}

export const worldConstitutions: WorldConstitution[] = [
  // West Africa -------------------------------------------------------------
  { country: "Benin", region: "west", adopted: 1990, constitute: "Benin_1990" },
  {
    country: "Burkina Faso",
    region: "west",
    adopted: 1991,
    revised: 2015,
    constitute: "Burkina_Faso_2015",
    note: "Since the military takeovers of 2022, a transitional charter has set parts of this constitution aside.",
  },
  { country: "Cabo Verde", region: "west", adopted: 1980, revised: 1992, constitute: "Cape_Verde_1992" },
  { country: "Côte d'Ivoire", region: "west", adopted: 2016, revised: 2020, constitute: "Cote_DIvoire_2020" },
  { country: "The Gambia", region: "west", adopted: 1996, revised: 2018, constitute: "Gambia_2018" },
  { country: "Ghana", region: "west", adopted: 1992, revised: 1996, constitute: "Ghana_1996" },
  {
    country: "Guinea",
    region: "west",
    adopted: 2010,
    constitute: "Guinea_2010",
    note: "Suspended after the 2021 military takeover. A new constitution was approved by referendum in 2025; the archive has not yet published it.",
  },
  { country: "Guinea-Bissau", region: "west", adopted: 1984, revised: 1996, constitute: "Guinea_Bissau_1996" },
  { country: "Liberia", region: "west", adopted: 1986, constitute: "Liberia_1986" },
  { country: "Mali", region: "west", adopted: 2023, constitute: "Mali_2023" },
  {
    country: "Niger",
    region: "west",
    adopted: 2010,
    revised: 2017,
    constitute: "Niger_2017",
    note: "Suspended after the 2023 military takeover; the country is governed under a transitional charter.",
  },
  { country: "Nigeria", region: "west", adopted: 1999, revised: 2023, constitute: "Nigeria_2023" },
  { country: "Senegal", region: "west", adopted: 2001, revised: 2016, constitute: "Senegal_2016" },
  { country: "Sierra Leone", region: "west", adopted: 1991, revised: 2022, constitute: "Sierra_Leone_2022" },
  { country: "Togo", region: "west", adopted: 2024, constitute: "Togo_2024" },

  // North Africa ------------------------------------------------------------
  { country: "Algeria", region: "north", adopted: 2020, constitute: "Algeria_2020" },
  { country: "Egypt", region: "north", adopted: 2014, revised: 2019, constitute: "Egypt_2019" },
  {
    country: "Libya",
    region: "north",
    adopted: 2011,
    revised: 2012,
    constitute: "Libya_2012",
    note: "An interim Constitutional Declaration, not a permanent constitution. A permanent text was drafted in 2017 but has not been put to a vote.",
  },
  { country: "Mauritania", region: "north", adopted: 1991, revised: 2012, constitute: "Mauritania_2012" },
  { country: "Morocco", region: "north", adopted: 2011, constitute: "Morocco_2011" },
  { country: "Tunisia", region: "north", adopted: 2022, constitute: "Tunisia_2022" },

  // Central Africa ----------------------------------------------------------
  { country: "Burundi", region: "central", adopted: 2018, constitute: "Burundi_2018" },
  { country: "Cameroon", region: "central", adopted: 1972, revised: 2008, constitute: "Cameroon_2008" },
  {
    country: "Central African Republic",
    region: "central",
    adopted: 2016,
    constitute: "Central_African_Republic_2016",
    note: "Replaced by a new constitution approved by referendum in 2023; the archive has not yet published it.",
  },
  {
    country: "Chad",
    region: "central",
    adopted: 2018,
    constitute: "Chad_2018",
    note: "Replaced by a new constitution approved by referendum in 2023; the archive has not yet published it.",
  },
  { country: "Congo (Republic)", region: "central", adopted: 2015, constitute: "Congo_2015" },
  {
    country: "Democratic Republic of the Congo",
    region: "central",
    adopted: 2005,
    revised: 2011,
    constitute: "Democratic_Republic_of_the_Congo_2011",
  },
  { country: "Equatorial Guinea", region: "central", adopted: 1991, revised: 2012, constitute: "Equatorial_Guinea_2012" },
  {
    country: "Gabon",
    region: "central",
    adopted: 1991,
    revised: 2011,
    constitute: "Gabon_2011",
    note: "Replaced by a new constitution approved by referendum in 2024; the archive has not yet published it.",
  },
  { country: "São Tomé and Príncipe", region: "central", adopted: 1975, revised: 2003, constitute: "Sao_Tome_and_Principe_2003" },

  // East Africa -------------------------------------------------------------
  { country: "Comoros", region: "east", adopted: 2018, constitute: "Comoros_2018" },
  { country: "Djibouti", region: "east", adopted: 1992, revised: 2010, constitute: "Djibouti_2010" },
  { country: "Eritrea", region: "east", adopted: 1997, constitute: "Eritrea_1997", note: "Ratified in 1997 but never put into effect." },
  { country: "Ethiopia", region: "east", adopted: 1994, constitute: "Ethiopia_1994" },
  { country: "Kenya", region: "east", adopted: 2010, constitute: "Kenya_2010" },
  { country: "Madagascar", region: "east", adopted: 2010, constitute: "Madagascar_2010" },
  { country: "Mauritius", region: "east", adopted: 1968, revised: 2016, constitute: "Mauritius_2016" },
  { country: "Rwanda", region: "east", adopted: 2003, revised: 2015, constitute: "Rwanda_2015" },
  { country: "Seychelles", region: "east", adopted: 1993, revised: 2025, constitute: "Seychelles_2025" },
  { country: "Somalia", region: "east", adopted: 2012, constitute: "Somalia_2012", note: "A provisional constitution." },
  { country: "South Sudan", region: "east", adopted: 2011, revised: 2013, constitute: "South_Sudan_2013", note: "A transitional constitution." },
  {
    country: "Sudan",
    region: "east",
    adopted: 2019,
    revised: 2020,
    constitute: "Sudan_2020",
    note: "A transitional Constitutional Declaration. Its standing has been uncertain since the war that began in 2023.",
  },
  { country: "Tanzania", region: "east", adopted: 1977, revised: 2005, constitute: "Tanzania_2005" },
  { country: "Uganda", region: "east", adopted: 1995, revised: 2017, constitute: "Uganda_2017" },

  // Southern Africa ---------------------------------------------------------
  { country: "Angola", region: "southern", adopted: 2010, constitute: "Angola_2010" },
  { country: "Botswana", region: "southern", adopted: 1966, revised: 2021, constitute: "Botswana_2021" },
  { country: "Eswatini", region: "southern", adopted: 2005, constitute: "Swaziland_2005" },
  { country: "Lesotho", region: "southern", adopted: 1993, revised: 2025, constitute: "Lesotho_2025" },
  { country: "Malawi", region: "southern", adopted: 1994, revised: 2017, constitute: "Malawi_2017" },
  { country: "Mozambique", region: "southern", adopted: 2004, revised: 2007, constitute: "Mozambique_2007" },
  { country: "Namibia", region: "southern", adopted: 1990, revised: 2014, constitute: "Namibia_2014" },
  { country: "South Africa", region: "southern", adopted: 1996, revised: 2012, constitute: "South_Africa_2012" },
  { country: "Zambia", region: "southern", adopted: 1991, revised: 2016, constitute: "Zambia_2016" },
  { country: "Zimbabwe", region: "southern", adopted: 2013, revised: 2021, constitute: "Zimbabwe_2021" },

  // Americas ----------------------------------------------------------------
  {
    country: "United States of America",
    region: "americas",
    adopted: 1789,
    revised: 1992,
    constitute: "United_States_of_America_1992",
    note: "The oldest written national constitution still in force. 1992 is the year of its most recent amendment, the 27th.",
  },
];
