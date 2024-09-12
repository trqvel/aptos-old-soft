const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class logsHelper {
    constructor(address, from_token, to_token, amount, link, module, sub_module, status) {
        this.address = address;
        this.from_token = from_token;
        this.to_token = to_token;
        this.amount = amount;
        this.link = link;
        this.module = module;
        this.sub_module = sub_module;
        this.status = status;
    }

    async log_to_excel() {
        try {
            const log_file = path.join('exel', `${this.address}.xlsx`);

            const workbook = new ExcelJS.Workbook();
            if (fs.existsSync(log_file)) {
                await workbook.xlsx.readFile(log_file);
            }

            const address_short = typeof this.address === 'string' ? this.address.substring(0, 10) : 'default';
            const modules = ['LiquidSwap', 'AptoSwap', 'PancakeSwap', 'AnimeSwap', 'AuxSwap', 'ObricSwap', 'Certus', 'DittoStake', 'TortugaStake', 'WithdrawalToApt', 'WithdrawalFromApt']
            const subModules = ['SWAP', 'AddLP', 'BurnLP', 'StakeAPT', 'UnstakeAPT']
            let sheet = workbook.getWorksheet(address_short);

            if (!sheet) {
                sheet = workbook.addWorksheet(address_short);
                if (workbook.getWorksheet('Sheet')) {
                    workbook.removeWorksheet('Sheet');
                }

                modules.forEach((module_name, i) => {
                    sheet.getRow(i + 2).getCell(13).value = module_name;
                });

                subModules.forEach((subModule_name, i) => {
                    sheet.getRow(i + 2).getCell(15).value = subModule_name;
                });

                const header = ['Date', 'Time', 'FromToken', 'ToToken', 'Amount', 'Link', 'Module', 'SubModule', 'Status'];
                header.forEach((head, i) => {
                    sheet.getRow(1).getCell(i + 1).value = head;
                });
            }
            sheet.getRow(1).getCell(13).value = 'DEX';
            sheet.getRow(1).getCell(15).value = 'Modul';
            sheet.getRow(1).getCell(14).value = 'DexTXCount';
            sheet.getRow(1).getCell(16).value = 'ModulTxCount';
            sheet.getRow(1).getCell(17).value = 'Value';
            sheet.getRow(1).getCell(18).value = 'AllTx';


            const current_date_time = new Date();
            const date = current_date_time.toISOString().split('T')[0];
            const time = current_date_time.toTimeString().split(' ')[0];

            const status_str = this.status === 1 ? "Success" : "Failed";

            let amount = "-";
            if (this.status === 1) {
                if (this.from_token === "USDC") {
                    amount = BigInt(this.amount) / BigInt(10**6)
                } else {
                    amount =  BigInt(this.amount)/ BigInt(10**8 * 8);
                }
            }
            amount = parseFloat(amount).toFixed(8);
            const row = [
                date,
                time,
                this.from_token || "-",
                this.to_token || "-",
                amount || "-",
                this.link || '-',
                this.module || '-',
                this.sub_module || '-',
                status_str
            ];

            const newRow = sheet.addRow(row, sheet.lastRow.number + 1);

            if (this.status === 1) {
                modules.forEach((module_name, i) => {
                    if (this.module === module_name) {
                        const cell = sheet.getRow(i + 2).getCell(14);
                        cell.value = cell.value ? cell.value + 1 : 1;
                    }
                });

                subModules.forEach((subModule_name, i) => {
                    if (this.sub_module === subModule_name) {
                        const cell = sheet.getRow(i + 2).getCell(16);
                        cell.value = cell.value ? cell.value + 1 : 1;
                    }
                });
            }
            sheet.getRow(2).getCell(17).value = { formula: '=SUM(E2:E1000)' };
            sheet.getRow(2).getCell(18).value = { formula: '=SUM(N2:N10000)' };

            await workbook.xlsx.writeFile(log_file);
        } catch (e) {
            console.error(`Error while writing to Excel: ${e}`);
        }
    }
}

module.exports = {logsHelper};
