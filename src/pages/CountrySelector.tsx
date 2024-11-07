import React, { useState } from 'react';
import styled from '@emotion/styled';
import { MultiSelect } from 'primereact/multiselect';

interface CountryOption {
    label: string;
    value: string;
}

// const CustomMultiSelect = styled(MultiSelect)`
//     width: 20%;
//     border-radius: 8px;
//     .p-multiselect {
//         padding: 10px;
//         border-radius: 8px;
//     }
//     .p-multiselect-panel {
//         background-color: #ffffff; /* White background */
//         border-radius: 8px;
//         box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Softer shadow */
//     }
//     .p-multiselect-header {
//         padding: 8px;
//         background-color: #f7f9fc;
//         border-bottom: 1px solid #e0e7ff;
//     }
//     .p-inputtext {
//         width: calc(100% - 16px); /* Adjust width to fit panel */
//         padding: 6px 8px;
//         border-radius: 4px;
//         border: 1px solid #d1d5db;
//     }
//     .p-multiselect-item {
//         padding: 8px 12px;
//         color: #333;
//         display: flex;
//         align-items: center;
//     }
//     .p-multiselect-item.p-highlight {
//         background-color: #000000; /* Light blue for selected item */
//         color: #0284c7; /* Darker blue text for selected item */
//     }
//     .p-multiselect-item:hover {
//         background-color: #e0e7ff;
//     }
//     .p-checkbox-box {
//         border-radius: 4px;
//         border: 1px solid #6b7280;
//     }
//     .p-checkbox-box.p-highlight {
//         background-color: #0284c7; /* Blue color for selected checkbox */
//         border-color: #0284c7;
//     }
//     .p-multiselect-item-group {
//         padding: 8px 12px;
//         font-weight: bold;
//         color: #6b7280;
//         background-color: #f3f4f6;
//         border-bottom: 1px solid #e5e7eb;
//     }
//     .p-multiselect-token {
//         background-color: #0284c7; /* Blue background for selected tags */
//         color: #ffffff;
//         border-radius: 12px;
//         padding: 4px 8px;
//     }
// `;


const CountrySelector: React.FC = () => {
    const [selectedPreferredCountries, setSelectedPreferredCountries] = useState<string[]>([]);
    const [selectedNonPreferredCountries, setSelectedNonPreferredCountries] = useState<string[]>([]);

    const countryOptions = [
        {
            label: 'Preferred Countries',
            items: [
                { label: 'Argentina', value: 'Argentina' },
                { label: 'India', value: 'India' },
                { label: 'Austria', value: 'Austria' },
                { label: 'Belgium', value: 'Belgium' },
                { label: 'Brazil', value: 'Brazil' },
                { label: 'Korea', value: 'Korea' }
            ]
        },
        {
            label: 'Non-Preferred Countries',
            items: [
                { label: 'Australia', value: 'Australia' },
                { label: 'Czech Republic', value: 'Czech Republic' },
                { label: 'Denmark', value: 'Denmark' },
                { label: 'Finland', value: 'Finland' },
                { label: 'France', value: 'France' }
            ]
        }
    ];

    const handleCountryChange = (selectedCountries: string[]) => {

      // These below function will filter the countryOptions array of 2 objects over the selectedCountries and separeates the selection based on the prefered and non-preffered countries.
        const preferredCountries = selectedCountries.filter(country =>
            countryOptions[0].items.some(item => item.value === country)
        );
        const nonPreferredCountries = selectedCountries.filter(country =>
            countryOptions[1].items.some(item => item.value === country)
        );

        setSelectedPreferredCountries(preferredCountries);
        setSelectedNonPreferredCountries(nonPreferredCountries);
    };

    console.log("selectedPreferredCountries", selectedPreferredCountries);
    console.log("selectedNonPreferredCountries", selectedNonPreferredCountries );
    
    

    return (
        <div style={{ width: '250px' }}>
            <h4>Country Timeliness</h4>
            <MultiSelect
                value={[...selectedPreferredCountries, ...selectedNonPreferredCountries]}
                options={countryOptions}
                onChange={(e) => handleCountryChange(e.value)}          // Thie e.value is an array not single value becuase this is multiselect.
                optionLabel="label"
                optionValue="value"
                placeholder="Select Country"
                filter
                showSelectAll={true}
                optionGroupLabel="label"
                optionGroupChildren="items"
                panelClassName="country-selector-panel"
            />

            {/* <div>
                <h5>Selected Preferred Countries:</h5>
                <ul>
                    {selectedPreferredCountries.map(country => (
                        <li key={country}>{country}</li>
                    ))}
                </ul>

                <h5>Selected Non-Preferred Countries:</h5>
                <ul>
                    {selectedNonPreferredCountries.map(country => (
                        <li key={country}>{country}</li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};

export default CountrySelector;
