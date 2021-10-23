// External Modules
const inquirer = require("inquirer")
const chalk = require("chalk")

// Internal Modules
const fs = require("fs")
const OperationManager = require("./operation_manager/operation_manager")
const Account = require("./account/account")

if(!fs.existsSync("accounts")) {
    fs.mkdirSync("accounts")
}

let choices = ["Sacar", "Depositar", "Consultar Saldo", "Sair"]
let choicesFunctionsMap = {
    "Sacar": "withdraw",
    "Depositar": "deposit",
    "Consultar Saldo": "getAccountBalance",
    "Sair": "leave"
}

main()

async function main() {
    let hasAccount = false
    
    await inquirer.prompt([
        {
            type: "confirm",
            name: "hasAccount",
            message: "Seja bem-vindo! Você tem uma conta?",
            default: false,
        },
    ]).then((answer) => {
        hasAccount = answer["hasAccount"]
    }).catch((err) => {throw err})

    userAccount = undefined

    if(hasAccount) {
        let accountName = ""
        await inquirer.prompt([
            {
                name: "accountName",
                message: "Qual o nome da sua conta?"
            }
        ]).then((answer) => {
            accountName = answer["accountName"]
        }).catch(err => console.log(err))

        if(!fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("Conta não encontrada! Criando sua conta..."))

            userAccount = new Account(accountName, 0)
            await userAccount.createAccount()
        } else {
            console.log(chalk.green("Conta encontrada! Seja bem-vindo!\n"))
            userAccount = getAccount(accountName)
        }
    } else {
        let accountName = ""

        await inquirer.prompt([
            {
                name: "accountName",
                message: "Qual o nome que você deseja para sua conta?"
            }
        ]).then((answer) => {
            accountName = answer["accountName"]
        }).catch(err => console.log(err))

        userAccount = new Account(accountName, 0)
        await userAccount.createAccount()
    }

    let operationManager = new OperationManager(choices, choicesFunctionsMap, userAccount)
    operationManager.operate()
}

function getAccount(accountName) {
    let accountJSON = ""
    try {
        accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
            encoding: "utf8",
            flag: "r"
        })
    } catch(readErr) {
        return undefined
    }

    const accountData = JSON.parse(accountJSON)

    return new Account(accountName, accountData.balance)
}

//Possíveis adições: Transferência de conta, algo com juros