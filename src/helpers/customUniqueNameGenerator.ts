import { uniqueNamesGenerator, Config, languages, adjectives, countries, animals, colors, names, starWars } from 'unique-names-generator';

const customConfig: Config = {
    dictionaries: [countries, colors, languages],
    separator: '_',
    length: 3,
};

export const generateUniqueName = () => uniqueNamesGenerator(customConfig);