import { TransactionModel } from '../../../models/Transaction.js'
import {
    formatAmount,
    percentageOfTotal,
    subtractAmounts,
    sumAmounts,
} from '../../../utils/decimal.js'

export class MongooseGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            $gte: new Date(from),
            $lte: new Date(to),
        }

        const transactions = await TransactionModel.find({
            user_id: userId,
            date: dateFilter,
        })

        const earningsAmounts = transactions
            .filter((t) => t.type === 'EARNING')
            .map((t) => t.amount)

        const expensesAmounts = transactions
            .filter((t) => t.type === 'EXPENSE')
            .map((t) => t.amount)

        const investmentsAmounts = transactions
            .filter((t) => t.type === 'INVESTMENT')
            .map((t) => t.amount)

        const earnings = sumAmounts(earningsAmounts)
        const expenses = sumAmounts(expensesAmounts)
        const investments = sumAmounts(investmentsAmounts)

        const total = sumAmounts([earnings, expenses, investments])
        const balance = subtractAmounts(
            earnings,
            sumAmounts([expenses, investments]),
        )

        return {
            earnings: formatAmount(earnings),
            expenses: formatAmount(expenses),
            investments: formatAmount(investments),
            earningPercentage: String(percentageOfTotal(earnings, total)),
            expensePercentage: String(percentageOfTotal(expenses, total)),
            investmentPercentage: String(
                percentageOfTotal(investments, total),
            ),
            balance: formatAmount(balance),
        }
    }
}
