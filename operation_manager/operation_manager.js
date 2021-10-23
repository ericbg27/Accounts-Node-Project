const fs = require("fs")
const Account = require("../account/account")

const inquirer = require("inquirer")
const chalk = require("chalk")

class OperationManager {
    constructor(choices, choicesFunctionsMap, account) {
        this.choices = choices
        this.choicesFunctionsMap = choicesFunctionsMap
        this.account = account

        for(let choice in this.choices) {
            if(!(this.choices[choice] in this.choicesFunctionsMap)) {
                let err = new Error()

                throw err
            }
        }
    }
}

OperationManager.prototype.operate = async function() {
    let action = ""
    let actionFunc = ""

    await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "O que você deseja fazer?",
            choices: this.choices,
        },
    ]).then((answer) => {
        action = answer["action"]
        actionFunc = this.choicesFunctionsMap[action]
    }).catch((err) => {throw err})

    if(action !== "Sair") {
        await this.account[actionFunc]()

        this.operate()
    } else {
        this.leave()
    }
}

OperationManager.prototype.leave = function() {
    console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
    process.exit()
}

module.exports = OperationManager