const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.txt', 'utf8').replace(/\\/g, '\\\\'));
const {interval, saveFolderPath} = config;
const backupDir = `${saveFolderPath}\\backup`;


function addZero(number) {
    if (Number(number) <= 9) {
        return `0${number}`;
    }
    return number;
}

function createDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log('Backup directory created!');
        return;
    }
    console.log('Backup directory exists!');
}

function main() {
    var startTime = performance.now();
    let currentDate = new Date();
    const date = {
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
        seconds: currentDate.getSeconds(),
    };

    const keys = Object.keys(date);
    keys.forEach(key => { date[key] = addZero(date[key]) });
    currentDate = `${date.day}.${date.month}.${date.year} ${date.hours}${date.minutes}${date.seconds}`;
    const quickSaveName = fs.readdirSync(saveFolderPath).filter(fileName => fileName.includes('quick_save'))[0];
    const quickSaveDir = `${saveFolderPath}\\${quickSaveName}`;
    const fileModificationDate = fs.statSync(quickSaveDir).mtime;
    const backupSaveDir = `${backupDir}\\${quickSaveName} ${currentDate}`;
    let equalityCounter = 0;

    const files = fs.readdirSync(backupDir);

    if (files.length == 0) {
        fs.copyFile(quickSaveDir, backupSaveDir, (err) => {
            if (err) throw err;
            console.log(`${quickSaveDir} was copied to ${backupSaveDir}`);
        });
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        savedFileDir = `${backupDir}\\${fileName}`;
        const savedFileModificationDate = fs.statSync(savedFileDir).mtime;
        if (fileModificationDate.toString() == savedFileModificationDate.toString()) {
            console.log('Save already stored!')
            break;
        }
        equalityCounter++;
        if (equalityCounter == files.length) {
            fs.copyFile(quickSaveDir, backupSaveDir, (err) => {
                if (err) throw err;
                console.log(`${quickSaveDir} was copied to ${backupSaveDir}`);
            });
        }
    }
    var endTime = performance.now();
    console.log(`Execution time: ${endTime - startTime} milliseconds`);
}


createDir(backupDir);
main();
setInterval(main, interval * 1000);