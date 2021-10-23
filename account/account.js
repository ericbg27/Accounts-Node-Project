const fs = require("fs")
const account_utils = require("../utils/account_utils")

const chalk = require("chalk")
const inquirer = require("inquirer")

class Account {
    constructor(accountName, balance) {
        this.accountName = accountName
        this.balance = balance
    }
}

Account.prototype.createAccount = async function() {
    await this.buildAccount()

    console.log(chalk.green("Obrigado por escolher o nosso banco!\n"))
}

Account.prototype.buildAccount = async function() {
    if(account_utils.checkIfAccountNotExists(this.accountName)) {
        let newAccountName = ""
        await inquirer.prompt([
            {
                name: "accountName",
                message: "Qual o nome que você deseja para sua conta?"
            }
        ]).then((answer) => {
            newAccountName = answer["accountName"]
        }).catch(err => console.log(err))

        this.accountName = newAccountName

        await this.buildAccount()
        return
    }

    fs.writeFileSync(
        `accounts/${this.accountName}.json`, 
        `{"balance": 0}`,
        function(err) {
            console.log(err)
        },
    )

    console.log(chalk.green("Parabéns, a sua conta foi criada!"))
    return
}

Account.prototype.deposit = async function() {
    let amount = undefined
    await inquirer.prompt([
        {
            name: "amount",
            message: "Quanto você deseja depositar?",
        },
    ]).then((answer) => {
        amount = answer["amount"]
    }).catch(err => {throw err})

    let couldAdd = this.addAmount(amount)
    if(!couldAdd) {
        this.deposit(this.accountName)
    }

    return
}

Account.prototype.addAmount = function(amount) {
    if(!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde! \n"))

        return false
    }

    this.balance = parseFloat(amount) + parseFloat(this.balance)

    fs.writeFileSync(
        `accounts/${this.accountName}.json`,
        JSON.stringify(this),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!\n`))
    return true
}

Account.prototype.getAccountBalance = async function() {
    console.log(chalk.bgBlue.black(`O saldo da sua conta é de R$${this.balance}\n`))
}

Account.prototype.withdraw = async function() {
    let amount = 0
    await inquirer.prompt([
        {
            name: "amount",
            message: "Quanto você deseja sacar?"
        }
    ]).then((answer) => {
        amount = answer["amount"]
    }).catch(err => console.log(err))

    await this.removeAmount(amount)
}

Account.prototype.removeAmount = async function(amount) {
    if(!amount) {
        chalk.bgRed.black("Ocorreu um erro, Tente novamente mais tarde!\n")
        
        return
    }

    if(this.balance < amount) {
        console.log(chalk.bgRed.black("Valor indisponível, tente novamente!\n"))
        
        await this.withdraw()
        return
    }

    this.balance = parseFloat(this.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${this.accountName}.json`,
        JSON.stringify(this),
        function(err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!\n`))
}

module.exports = Account