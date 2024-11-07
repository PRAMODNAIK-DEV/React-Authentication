import React, { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface CountryOption {
    label: string;
    value: string;
}

const CountrySelector: React.FC = () => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    // const countryOptions = [
    //     {
    //         label: 'Preferred Countries',
    //         items: [
    //             { label: 'Argentina', value: 'Argentina' },
    //             { label: 'Australia', value: 'Australia' },
    //             { label: 'Austria', value: 'Austria' },
    //             { label: 'Belgium', value: 'Belgium' },
    //             { label: 'Brazil', value: 'Brazil' },
    //             { label: 'India', value: 'India' }
    //         ]
    //     },
    //     {
    //         label: 'Non-Preferred Countries',
    //         items: [
    //             { label: 'Australia', value: 'Australia' },
    //             { label: 'Czech Republic', value: 'Czech Republic' },
    //             { label: 'Denmark', value: 'Denmark' },
    //             { label: 'Finland', value: 'Finland' },
    //             { label: 'France', value: 'France' }
    //         ]
    //     }
    // ];


    const apiResponse = {
      data: {
          preferred: ['Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'India'],
          nonpreferred: ['Australia', 'Czech Republic', 'Denmark', 'Finland', 'France']
      }
  }

  // Function to format the backend data
  const formatCountryOptions = (data: { preferred: string[]; nonpreferred: string[] }) => {
    return [
        {
            label: 'Preferred Countries',
            items: data.preferred.map(country => ({ label: country, value: country }))
        },
        {
            label: 'Non-Preferred Countries',
            items: data.nonpreferred.map(country => ({ label: country, value: country }))
        }
    ];
  };

  const countryOptions = formatCountryOptions(apiResponse.data);

  // console.log(countryOptions);
  console.log("selectedCountries",selectedCountries);
  


    return (
        <div style={{ width: '250px' }}>
            <h4>Country Timeliness</h4>
            <MultiSelect
                value={selectedCountries}
                options={countryOptions}
                onChange={(e) => setSelectedCountries(e.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Select Country"
                filter
                showSelectAll={true}
                optionGroupLabel="label"
                optionGroupChildren="items"
                panelClassName="country-selector-panel"
            />
        </div>
    );
};

export default CountrySelector;
