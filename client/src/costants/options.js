const legalFormOptions = [
  'SS – Società semplice',
  'SNC - Società in Nome Collettivo',
  'SAS - Società in Accomandita Semplice',
  'SRL - Società a Responsabilità Limitata',
  'SPA - Società Per Azioni',
  'SAPA - Società in Accomandita Per Azioni',
  'Società cooperative'
]

const imports = [
  'fino a 50.000€',
  'da 50.000€ a 150.000€',
  'da 150.000 a 258.000€',
  'da 258.000 a 500.000€',
  'oltre 500.000€'
]

const compCatOptions = [
  {
    label: 'Micro impresa',
    value: 'xs'
  },
  {
    label: 'Piccola impresa',
    value: 'sm'
  },
  {
    label: 'Media impresa',
    value: 'md'
  },
  {
    label: 'Grande impresa',
    value: 'lg'
  }
]

const presentationFiles = [
  { label: 'Certificato o Visura Camerale', value: 'certificate' },
  { label: 'DURC', value: 'durc' },
  { label: 'Iscrizione White List o Dich. Antimafia', value: 'whiteList' },
  { label: 'ISO', value: 'iso' },
  { label: 'Patentino F-Gas', value: 'fgas' },
  { label: 'Presentazione Aziendale', value: 'presentation' },
  { label: 'SOA', value: 'soa' }

]

exports.legalFormOptions = legalFormOptions
exports.imports = imports
exports.compCatOptions = compCatOptions
exports.presentationFiles = presentationFiles
