const fs = require("fs")
const chalk = require("chalk")

function checkIfAccountExists(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta não existe, escolha outro nome!"))

        return false
    }

    return true
}

function checkIfAccountNotExists(accountName) {
    if(fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta já existe, escolha outro nome!"))

        return true
    }

    return false
}

module.exports = {
    checkIfAccountExists,
    checkIfAccountNotExists
}