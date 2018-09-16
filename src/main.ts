import { CSVConverter } from './CSVConverter/CSVConverter';

const main = async () => {
    const converter = new CSVConverter('./test_files/jaccs.json');
    try {
        const data = await converter.convertCsv('./test_files/WebDetail201809170253.csv');
        console.log(data);
    } catch (e) {
        console.log('エラー');
    }
}

main();